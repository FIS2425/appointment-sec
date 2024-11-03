import express from 'express';
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  getAppointmentsByPatient,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.get(
  '/patient/:patientId',
  getAppointmentsByPatient
);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
