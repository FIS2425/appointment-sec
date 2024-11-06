import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import Appointment from '../../../src/schemas/Appointment.js'
import { v4 as uuidv4 } from 'uuid';
import * as db from '../../setup/database';
import { request } from '../../setup/setup';

const sampleAppointments = [
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'family_medicine',
    appointmentDate: new Date('2024-01-15T10:30:00Z'),
    status: 'pending',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'dermatology',
    appointmentDate: new Date('2024-02-10T14:00:00Z'),
    status: 'pending',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'pediatrics',
    appointmentDate: new Date('2024-03-05T09:00:00Z'),
    status: 'completed',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'cardiology',
    appointmentDate: new Date('2024-03-20T11:30:00Z'),
    status: 'canceled',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'orthopedics',
    appointmentDate: new Date('2024-04-01T15:00:00Z'),
    status: 'pending',
  },
];

beforeAll(async () => {
  await db.clearDatabase();
  await Appointment.insertMany(sampleAppointments);
});


afterAll(async () => {
  await db.clearDatabase();
});

describe('APPOINTMENT ENDPOINTS TEST', () => {
  describe('test GET /appointments', () => {
    it('should return 200 and same number of elements as sample', async () => {
      const response = await request.get('/appointments');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(sampleAppointments.length);
    });
  });
  describe('test GET /appointments/:id', () => {
    it('should return 200 and the correct appointment', async () => {
      const response = await request.get(`/appointments/${sampleAppointments[0]._id}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(sampleAppointments[0]._id);
    });
  });
  describe('test negative no id GET /appointments/:id', () => {
    it('should return 404', async () => {
      const response = await request.get(`/appointments/${uuidv4()}`);
      expect(response.status).toBe(404);
    });
  });
  describe('test POST /appointments', () => {
    it('should return 201 and should add a appointment', async () => {
      const previousAppointments = await Appointment.find();
      const newAppointment = {
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-05-15T10:30:00Z'),
        status: 'pending',
      };
      const response = await request.post('/appointments').send(newAppointment);
      const currentAppointments = await Appointment.find();
      expect(response.status).toBe(201);
      expect(currentAppointments.length).toBe(previousAppointments.length + 1);
    });
  });
  describe('test negative no body POST /appointments', () => {
    it('should return 400', async () => {
      const response = await request.post('/appointments');
      expect(response.status).toBe(400);
    });
  });
  describe('test PUT /appointments/:id', () => {
    it('should return 200 and should update the appointment', async () => {
      const updatedAppointment = {
        specialty: 'dermatology',
        status: 'completed',
      };
      const response = await request.put(`/appointments/${sampleAppointments[0]._id}`).send(updatedAppointment);
      expect(response.status).toBe(200);
      const appointment = await Appointment.findById(sampleAppointments[0]._id);
      expect(appointment.specialty).toBe('dermatology');
      expect(appointment.status).toBe('completed');
    });
  });
  describe('test negative no id PUT /appointments/:id', () => {
    it('should return 404', async () => {
      const updatedAppointment = {
        specialty: 'dermatology',
        status: 'completed',
      };
      const response = await request.put(`/appointments/${uuidv4()}`).send(updatedAppointment);
      expect(response.status).toBe(404);
    });
  });
  describe('test negative no body PUT /appointments/:id', () => {
    it('should return 400', async () => {
      console.log('_id:', sampleAppointments[2]._id);
      const response = await request.put(`/appointments/${sampleAppointments[2]._id}`);
      expect(response.status).toBe(400);
      const appointment = await Appointment.findById(sampleAppointments[2]._id);
      expect(appointment.specialty).toBe(sampleAppointments[2].specialty);
    });
  });
  describe('test DELETE /appointments/:id', () => {
    it('should return 200 and should delete the appointment', async () => {
      const previousAppointments = await Appointment.find();
      const response = await request.delete(`/appointments/${sampleAppointments[0]._id}`);
      const currentAppointments = await Appointment.find();
      expect(response.status).toBe(200);
      expect(currentAppointments.length).toBe(previousAppointments.length - 1);
    });
  });
});
describe('APPOINTMENT BUSSINES LOGIC VALIDATION TEST', () => {
  describe('should not allow appointment with a past date', () => {
    it('should return 400 for appointment with past date', async () => {
      const pastAppointment = {
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
        status: 'pending',
      };
      const response = await request.post('/appointments').send(pastAppointment);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Appointment date cannot be in the past');
    });
  });
  describe('should not allow appointment with a date more than 30 days in the future', () => {
    it('should return 400 for appointment with date more than 30 days in the future', async () => {
      const futureAppointment = {
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000), // Dentro de 31 días
        status: 'pending',
      };
      const response = await request.post('/appointments').send(futureAppointment);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Appointment date cannot be more than 30 days in the future');
    });
  });
  describe('should prevent overlapping appointments for the same patient', () => {
    it('should return 400 for overlapping appointments for the same patient', async () => {
      const patientId = uuidv4();
      const firstAppointment = new Appointment({
        _id: uuidv4(),
        patientId,
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-05-15T10:30:00Z'),
        status: 'pending',
      });
      await firstAppointment.save();

      const overlappingAppointment = {
        patientId,
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-05-15T10:45:00Z'), // Overlapping time
        status: 'pending',
      };
      const response = await request.post('/appointments').send(overlappingAppointment);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Overlapping appointments are not allowed');
    });
  });
  describe('should prevent overlapping appointments for the same doctor', () => {
    it('should return 400 for overlapping appointments for the same doctor', async () => {
      const doctorId = uuidv4();
      const firstAppointment = new Appointment({
        _id: uuidv4(),
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId,
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-05-15T10:30:00Z'),
        status: 'pending',
      });
      await firstAppointment.save();

      const overlappingAppointment = {
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId,
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-05-15T10:45:00Z'), // Overlapping time
        status: 'pending',
      };
      const response = await request.post('/appointments').send(overlappingAppointment);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Overlapping appointments are not allowed');
    });
  });
});
