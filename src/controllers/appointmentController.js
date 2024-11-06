import Appointment from '../schemas/Appointment.js';
import { validateRequestBody } from '../utils/validation.js';
import logger from '../config/logger.js';

let appointmentFields = ['patientId', 'clinicId', 'doctorId', 'specialty', 'appointmentDate'];

export const createAppointment = async (req, res) => {
  if(!validateRequestBody(req.body, appointmentFields, true)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const { patientId, clinicId, doctorId, specialty, appointmentDate } = req.body;
  try {
    const newAppointment = new Appointment({
      patientId,
      clinicId,
      doctorId,
      specialty,
      appointmentDate,
    });

    await newAppointment.save();
    logger.info(`Appointment ${newAppointment._id} created`);
    return res.status(201).json(newAppointment);
  } catch (error) {
    return res.status(500).json({
      error: 'Error creating appointment',
      message: error.message,
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    logger.debug(`Returning ${appointments.length} appointments`);
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error obtaining appointments', message: error.message });
  }
}

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment){
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.debug(`Returning appointment ${appointment._id}`);
    res.status(200).json(appointment);
  } catch (error) {
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
    logger.debug(`Returning ${appointments.length} appointments for patient ${req.params.patientId}`);
    res.status(200).json(appointments);
  } catch (error) {
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
    logger.debug(`Returning ${appointments.length} appointments for doctor ${req.params.doctorId}`);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      error: 'Error obtaining doctor appointments',
      message: error.message,
    });
  }
}

export const getAppointmentsByClinic = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      clinicId: req.params.clinicId,
    });
    logger.debug(`Returning ${appointments.length} appointments for clinic ${req.params.clinicId}`);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      error: 'Error obtaining clinic appointments',
      message: error.message,
    });
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const validation = validateRequestBody(req.body, appointmentFields, false);
    if(!validation || !req.params.id) {
      return res.status(400).json({ error: 'You need to provide at least one field to update' });
    }

    const updatedData = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedAppointment){
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${updatedAppointment._id} updated`);
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error updating appointment', message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment){
      return res.status(404).json({ error: 'Appointment not found' });
    }
    logger.info(`Appointment ${req.params.id} deleted`);
    res.status(200).json({ message: 'Appointment correctly deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error deleting appointment', message: error.message });
  }
};
