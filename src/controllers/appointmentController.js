import Appointment from '../schemas/Appointment.js';

export const createAppointment = async (req, res) => {
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
    if (!appointment)
      return res.status(404).json({ error: 'Appointment not found' });
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
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      error: 'Error obtaining patient appointments',
      message: error.message,
    });
  }
};
export const updateAppointment = async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedAppointment)
      return res.status(404).json({ error: 'Appointment not found' });
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
    if (!deletedAppointment)
      return res.status(404).json({ error: 'Appointment not found' });
    res.status(200).json({ message: 'Appointment correctly deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error deleting appointment', message: error.message });
  }
};
