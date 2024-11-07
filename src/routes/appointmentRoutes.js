import express from 'express';
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  getAppointmentsByPatient,
  getAppointmentsByClinic,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
  noShowAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);

router.put('/:id/cancel', cancelAppointment);
router.put('/:id/complete', completeAppointment);
router.put('/:id/noshow', noShowAppointment);

router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

router.get(
  '/patient/:patientId',
  getAppointmentsByPatient
);
router.get(
  '/doctor/:doctorId',
  getAppointmentsByDoctor
);
router.get(
  '/clinic/:clinicId',
  getAppointmentsByClinic
);


export default router;
