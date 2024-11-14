import Appointment from '../schemas/Appointment.js';
import {
  validateRequestBody,
  isDateInPast,
  isDateMoreThan30Days,
  isAvailable,
  validateField
} from '../utils/validation.js';
import {
  getAppointmentsWorkshiftByDoctorAndDate,
  getFreeTimeIntervals,
  getAvailableAppointmentsByWorkshift,
} from '../utils/workshiftQueries.js';
import { getLatituteLongitude, getWeather } from '../utils/weather.js';
import logger from '../config/logger.js';

let appointmentFields = [
  'patientId',
  'clinicId',
  'doctorId',
  'specialty',
  'appointmentDate',
];

export const createAppointment = async (req, res) => {
  if(!validateRequestBody(req.body, appointmentFields, true)) {
    logger.error('Error creating appointment: Missing required fields', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { patientId, doctorId, appointmentDate, duration } = req.body;

  const patientAvailable = await isAvailable(patientId, 'patientId', appointmentDate, duration);
  // todo: check if doctor is in working hours
  const doctorAvailable = await isAvailable(doctorId, 'doctorId', appointmentDate, duration);
  if (
    isDateInPast(appointmentDate) ||
    isDateMoreThan30Days(appointmentDate) ||
    !patientAvailable ||
    !doctorAvailable
  ) {
    const error = isDateInPast(appointmentDate)
      ? 'Appointment date cannot be in the past'
      : isDateMoreThan30Days(appointmentDate)
        ? 'Appointment date cannot be more than 30 days in the future'
        : !patientAvailable
          ? 'Patient already has an appointment at that time'
          : 'Doctor already has an appointment at that time';

    logger.error('Error creating appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error
    });

    return res.status(400).json({ error });
  }

  const { clinicId, specialty } =
    req.body;

  try {
    const newAppointment = new Appointment({
      patientId,
      clinicId,
      doctorId,
      specialty,
      appointmentDate,
    });

    await newAppointment.save();
    logger.info(`Appointment ${newAppointment._id} created`, {
      method: req.method,
      url: req.originalUrl,
      appointmentId: newAppointment._id,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    return res.status(201).json(newAppointment);
  } catch (error) {
    logger.error('Error creating appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    return res.status(500).json({
      error: 'Error creating appointment',
      message: error.message,
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    logger.debug(`Returning ${appointments.length} appointments`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(appointments);
  } catch (error) {
    logger.error('Error obtaining appointments', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error obtaining appointments', message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment){
      logger.error(`Appointment ${req.params.id} not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointment not found'
      });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.debug(`Returning appointment ${appointment._id}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(appointment);
  } catch (error) {
    logger.error('Error obtaining appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error obtaining appointment', message: error.message });
  }
};

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    });
    if (!appointments){
      logger.error(`Appointments not found for patient ${req.params.patientId}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointments not found'
      });
      return res.status(404).json({ error: 'Appointments not found for patient ' + req.params.patientId });
    }
    logger.debug(`Returning ${appointments.length} appointments for patient ${req.params.patientId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(appointments);
  } catch (error) {
    logger.error('Error obtaining patient appointments', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res.status(500).json({
      error: 'Error obtaining patient appointments',
      message: error.message,
    });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
    });
    if (!appointments){
      logger.error(`Appointments not found for doctor ${req.params.doctorId}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointments not found'
      });
      return res.status(404).json({ error: 'Appointments not found for doctor ' + req.params.doctorId });
    }
    logger.debug(`Returning ${appointments.length} appointments for doctor ${req.params.doctorId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(appointments);
  } catch (error) {
    logger.error('Error obtaining doctor appointments', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res.status(500).json({
      error: 'Error obtaining doctor appointments',
      message: error.message,
    });
  }
};

export const getAppointmentsByClinic = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      clinicId: req.params.clinicId,
    });
    if (!appointments){
      logger.error(`Appointments not found for clinic ${req.params.clinicId}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointments not found'
      });
      return res.status(404).json({ error: 'Appointments not found for clinic ' + req.params.clinicId });
    }
    logger.debug(`Returning ${appointments.length} appointments for clinic ${req.params.clinicId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(appointments);
  } catch (error) {
    logger.error('Error obtaining clinic appointments', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res.status(500).json({
      error: 'Error obtaining clinic appointments',
      message: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const validation = validateRequestBody(req.body, appointmentFields, false);
    if(!validation || !req.params.id) {
      logger.error('Error updating appointment: Missing required fields', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip
      });
      return res.status(400).json({ error: 'You need to provide at least one field to update' });
    }

    const updatedData = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );
    if (!updatedAppointment){
      logger.error(`Appointment ${req.params.id} not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointment not found'
      });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${updatedAppointment._id} updated`, {
      method: req.method,
      url: req.originalUrl,
      appointmentId: updatedAppointment._id,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    logger.error('Error updating appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error updating appointment', message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedAppointment){
      logger.error(`Appointment ${req.params.id} not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointment not found'
      });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${req.params.id} deleted`, {
      method: req.method,
      url: req.originalUrl,
      appointmentId: req.params.id,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json({ message: 'Appointment correctly deleted' });
  } catch (error) {
    logger.error('Error deleting appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error deleting appointment', message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    if(!req.params.id) {
      logger.error('Error cancelling appointment: Missing required fields', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip
      });
      return res.status(400).json({ error: 'You need to provide an appointment id' });
    }
    const updatedData = { status: 'cancelled' };
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedAppointment){
      logger.error(`Appointment ${req.params.id} not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointment not found'
      });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${updatedAppointment._id} cancelled`, {
      method: req.method,
      url: req.originalUrl,
      appointmentId: updatedAppointment._id,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    logger.error('Error cancelling appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error cancelling appointment', message: error.message });
  }
}

export const completeAppointment = async (req, res) => {
  try {
    if(!req.params.id) {
      logger.error('Error completing appointment: Missing required fields', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip
      });
      return res.status(400).json({ error: 'You need to provide an appointment id' });
    }
    const updatedData = { status: 'completed' };
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedAppointment){
      logger.error(`Appointment ${req.params.id} not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointment not found'
      });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${updatedAppointment._id} completed`, {
      method: req.method,
      url: req.originalUrl,
      appointmentId: updatedAppointment._id,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    logger.error('Error completing appointment', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error completing appointment', message: error.message });
  }
}

export const noShowAppointment = async (req, res) => {
  try{
    if(!req.params.id) {
      logger.error('Error marking no show: Missing required fields', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip
      });
      return res.status(400).json({ error: 'You need to provide an appointment id' });
    }
    const updatedData = { status: 'no_show' };
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedAppointment){
      logger.error(`Appointment ${req.params.id} not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        error: 'Appointment not found'
      });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${updatedAppointment._id} marked as no show`, {
      method: req.method,
      url: req.originalUrl,
      appointmentId: updatedAppointment._id,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    logger.error('Error marking no show', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res
      .status(500)
      .json({ error: 'Error marking no show', message: error.message });
  }
}

export const getAvailableAppointments = async (req, res) => {
  try {
    const { clinicId, doctorId, date } = req.query;

    if (!validateField(clinicId, 'uuid') || !validateField(doctorId, 'uuid') || !validateField(date, 'date')) {
      logger.error('Error obtaining available appointments: Invalid or missing required fields', { 
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip 
      });
      return res.status(400).json({ error: 'You need to provide valid clinicId, doctorId, and date' });
    }
    const appointments = await getAppointmentsWorkshiftByDoctorAndDate(clinicId, doctorId, date);
    const intervals = await getFreeTimeIntervals(appointments);
    const availableAppointments = await getAvailableAppointmentsByWorkshift(intervals, 30); // 30 minutes duration by default
    logger.debug(`Returning ${availableAppointments.length} available appointments`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip
    });
    res.status(200).json(availableAppointments);
  } catch (error) {
    logger.error('Error obtaining available appointments', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      error: error.message
    });
    res.status(500).json({
      error: 'Error obtaining clinic appointments',
      message: error.message,
    });
  }
}

export const getAppointmentWeather = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      logger.error(`Appointment ${req.params.id} not found`);
      return res.status(404).json({ error: 'Appointment not found' });
    }
    // todo: get clinic location, now im mocking it
    const clinicZipCode = '41012';
    const clinicCountryCode = 'ES';

    // const location = await getLatituteLongitude(clinicZipCode, clinicCountryCode);
    const location = { latitude: 37.3886303, longitude: -5.9824303 };

    console.log(location);

    if (!location) {
      logger.error(`Error obtaining location for clinic ${clinicZipCode}, ${clinicCountryCode}`);
      return res.status(500).json({ error: 'Error obtaining location' });
    }

    const weather = await getWeather(location.latitude, location.longitude);

    return res.status(200).json(weather);
  } catch (error) {
    res.status(500).json({
      error: 'Error obtaining weather data',
      message: error.message,
    });
  }
}
