import { describe, expect, it, afterEach,beforeEach, vi } from 'vitest';
import Appointment from '../../../src/schemas/Appointment.js';
// import Workshift from '../../../src/schemas/Workshift.js';
import redisClient from '../../../src/config/redis.js';
import { request } from '../../setup/setup';
import jwt from 'jsonwebtoken';
import {
  // today,
  // tomorrow,
  // tomorrowPlus15min,
  sampleAppointments,
  // workshift,
  // tenAM,
  // sampleUser,
} from '../utils/testData';

beforeEach(() => {
  vi.spyOn(jwt, 'verify').mockReturnValueOnce({
    userId: 'userId',
    roles: ['patient'],
  });
  vi.spyOn(redisClient, 'exists').mockResolvedValue(true);
});

afterEach(() => {
  vi.resetAllMocks();
});


describe('Appointment Controller Unit', () => {
  
  describe('GET /appointments', () => {
    it('should return a list of appointments', async () => {
      vi.spyOn(Appointment, 'find').mockResolvedValue(sampleAppointments);
      const response = await request.get('/appointments').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(sampleAppointments.length);
    });
  });
  describe('POST /appointments', () => {
    it('should create an appointment', async () => {
      const appointment = sampleAppointments[0];
      delete appointment._id;
      vi.spyOn(Appointment, 'find').mockResolvedValue([]);
      vi.spyOn(Appointment, 'create').mockResolvedValue(appointment);
      const response = await request.post('/appointments').send(appointment).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(201);
      expect(response.body.doctorId).toEqual(appointment.doctorId);
      expect(response.body.patientId).toEqual(appointment.patientId);
    });
    it('should return 400 if appointment already exists', async () => {
      const appointment = sampleAppointments[0];
      vi.spyOn(Appointment, 'find').mockResolvedValue([appointment]);
      const response = await request.post('/appointments').send(appointment).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(400);
    });
    it('should return 400 if appointment is invalid', async () => {
      const appointment = sampleAppointments[0];
      delete appointment.doctorId;
      const response = await request.post('/appointments').send(appointment).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(400);
    });
  });
  describe('GET /appointments/:id', () => {
    it('should return an appointment', async () => {
      const appointment = sampleAppointments[0];
      vi.spyOn(Appointment, 'findById').mockResolvedValue(appointment);
      const response = await request.get(`/appointments/${appointment._id}`).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.doctorId).toEqual(appointment.doctorId);
      expect(response.body.patientId).toEqual(appointment.patientId);
    });
    it('should return 404 if appointment is not found', async () => {
      vi.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const response = await request.get('/appointments/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('GET /appointments/patient/:id', () => {
    it('should return a list of appointments for a patient', async () => {
      vi.spyOn(Appointment, 'find').mockResolvedValue(sampleAppointments);
      const response = await request.get('/appointments/patient/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(sampleAppointments.length);
    });
    it('should return 404 if patient is not found', async () => {
      const response = await request.get('/appointments/patient/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('GET /appointments/doctor/:id', () => {
    it('should return a list of appointments for a doctor', async () => {
      vi.spyOn(Appointment, 'find').mockResolvedValue(sampleAppointments);
      const response = await request.get('/appointments/doctor/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(sampleAppointments.length);
    });
    it('should return 404 if doctor is not found', async () => {
      const response = await request.get('/appointments/doctor/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('GET /appointments/clinic/:id', () => {
    it('should return a list of appointments for a clinic', async () => {
      vi.spyOn(Appointment, 'find').mockResolvedValue(sampleAppointments);
      const response = await request.get('/appointments/clinic/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(sampleAppointments.length);
    });
    it('should return 404 if clinic is not found', async () => {
      const response = await request.get('/appointments/clinic/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('PUT /appointments/:id', () => {
    it('should update an appointment', async () => {
      const appointment = sampleAppointments[0];
      vi.spyOn(Appointment, 'findByIdAndUpdate').mockResolvedValue(appointment);
      const response = await request.put(`/appointments/${appointment._id}`).send(appointment).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
    });
    it('should return 404 if appointment is not found', async () => {
      vi.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const response = await request.put('/appointments/123').send(sampleAppointments[0]).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('DELETE /appointments/:id', () => {
    it('should delete an appointment', async () => {
      const appointment = sampleAppointments[0];
      vi.spyOn(Appointment, 'findByIdAndDelete').mockResolvedValue(appointment);
      const response = await request.delete(`/appointments/${appointment._id}`).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
    });
    it('should return 404 if appointment is not found', async () => {
      vi.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const response = await request.delete('/appointments/123').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('PUT /appointments/:id/complete', () => {
    it('should complete an appointment', async () => {
      const appointment = sampleAppointments[0];
      appointment.status = 'completed';
      vi.spyOn(Appointment, 'findByIdAndUpdate').mockResolvedValue(appointment);
      const response = await request.put(`/appointments/${appointment._id}/complete`).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
    });
    it('should return 404 if appointment is not found', async () => {
      vi.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const response = await request.put('/appointments/123/complete').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('PUT /appointments/:id/cancel', () => {
    it('should cancel an appointment', async () => {
      const appointment = sampleAppointments[0];
      appointment.status = 'canceled';
      vi.spyOn(Appointment, 'findByIdAndUpdate').mockResolvedValue(appointment);
      const response = await request.put(`/appointments/${appointment._id}/cancel`).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('canceled');
    });
    it('should return 404 if appointment is not found', async () => {
      vi.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const response = await request.put('/appointments/123/cancel').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
  describe('PUT /appointments/:id/noshow', () => {
    it('should mark an appointment as no show', async () => {
      const appointment = sampleAppointments[0];
      appointment.status = 'no_show';
      vi.spyOn(Appointment, 'findByIdAndUpdate').mockResolvedValue(appointment);
      const response = await request.put(`/appointments/${appointment._id}/noshow`).set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('no_show');
    });
    it('should return 404 if appointment is not found', async () => {
      vi.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const response = await request.put('/appointments/123/noshow').set('Cookie', ['token=authToken&refreshToken=refreshToken']);
      expect(response.status).toBe(404);
    });
  });
});