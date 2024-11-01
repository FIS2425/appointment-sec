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
      error: 'Error al crear la cita',
      message: error.message,
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ error: 'Cita no encontrada' });
    res.status(200).json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al obtener la cita', message: error.message });
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
      error: 'Error al obtener las citas del paciente',
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
      return res.status(404).json({ error: 'Cita no encontrada' });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al actualizar la cita', message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment)
      return res.status(404).json({ error: 'Cita no encontrada' });
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al eliminar la cita', message: error.message });
  }
};
