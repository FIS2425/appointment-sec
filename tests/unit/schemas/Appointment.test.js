import { describe, expect, it } from 'vitest';
import Appointment from '../../../src/schemas/Appointment.js'
import { v4 as uuidv4 } from 'uuid';

describe('APPOINTMENT VALIDATION TEST', () => {
  describe('all fields are required', () => {
    it('should not create an appointment without required fields', async () => {
      const appointment = new Appointment({
        specialty: 'family_medicine',
      });
      await expect(appointment.save()).rejects.toThrowError('Appointment validation failed: appointmentDate: Path `appointmentDate` is required., doctorId: Path `doctorId` is required., clinicId: Path `clinicId` is required., patientId: Path `patientId` is required.');
    });
  });
  describe('ids should be uuidv4', () => {
    it('should create them correctly', async () => {
      const validId = uuidv4();
      const validPatientId = uuidv4();
      const validClinicId = uuidv4();
      const validDoctorId = uuidv4();

      const appointment = new Appointment({
        _id: validId,
        patientId: validPatientId,
        clinicId: validClinicId,
        doctorId: validDoctorId,
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-01-15T10:30:00Z'),
        status: 'pending',
      });
      await appointment.save();

      expect(appointment._id).toBe(validId);
      expect(appointment.patientId).toBe(validPatientId);
      expect(appointment.clinicId).toBe(validClinicId);
      expect(appointment.doctorId).toBe(validDoctorId);
    });
    it('shouldn t create them', async () => {
      const invalidId = 'invalidId';
      const invalidPatientId = 'invalidPatientId';
      const invalidClinicId = 'invalidClinicId';
      const invalidDoctorId = 'invalidDoctorId';

      const appointment = new Appointment({
        _id: invalidId,
        patientId: invalidPatientId,
        clinicId: invalidClinicId,
        doctorId: invalidDoctorId,
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-01-15T10:30:00Z'),
        status: 'pending',
      });
      await expect(appointment.save()).rejects.toThrowError('Appointment validation failed: _id: invalidId not a valid UUID!, patientId: invalidPatientId not a valid UUID!, clinicId: invalidClinicId not a valid UUID!, doctorId: invalidDoctorId not a valid UUID!');
    });
  });
  describe('specialty should be one of the specified ones', () => {
    it('should create it correctly', async () => {
      const validSpecialty = 'family_medicine';

      const appointment = new Appointment({
        _id: uuidv4(),
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: validSpecialty,
        appointmentDate: new Date('2024-01-15T10:30:00Z'),
        status: 'pending',
      });
      await appointment.save();

      expect(appointment.specialty).toBe(validSpecialty);
    });
    it('shouldn t create it', async () => {
      const appointment = new Appointment({
        _id: uuidv4(),
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'invalidSpecialty',
        appointmentDate: new Date('2024-01-15T10:30:00Z'),
        status: 'pending',
      });
      await expect(appointment.save()).rejects.toThrowError('Appointment validation failed: specialty: `invalidSpecialty` is not a valid enum value for path `specialty`.');
    });
  });
  describe('status should be one of the specified ones', () => {
    it('should create it correctly', async () => {
      const validStatus = 'pending';

      const appointment = new Appointment({
        _id: uuidv4(),
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-01-15T10:30:00Z'),
        status: validStatus,
      });
      await appointment.save();

      expect(appointment.status).toBe(validStatus);
    });
    it('shouldn t create it', async () => {
      const appointment = new Appointment({
        _id: uuidv4(),
        patientId: uuidv4(),
        clinicId: uuidv4(),
        doctorId: uuidv4(),
        specialty: 'family_medicine',
        appointmentDate: new Date('2024-01-15T10:30:00Z'),
        status: 'invalidStatus',
      });
      await expect(appointment.save()).rejects.toThrowError('Appointment validation failed: status: `invalidStatus` is not a valid enum value for path `status`.');
    });
  });
});
