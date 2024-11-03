import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Appointment from '../src/schemas/Appointment.js'; // Adjust path if needed

const MONGO_URI = process.env.MONGOURL;

const connectToDatabase = async () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
    });
};

// Sample appointment data
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

async function populateAppointments() {
  try {
    // Delete sample appointments with matching patientId and doctorId
    await Appointment.deleteMany({
      patientId: { $in: sampleAppointments.map((appt) => appt.patientId) },
      doctorId: { $in: sampleAppointments.map((appt) => appt.doctorId) },
    });

    // Save each appointment
    for (const apptData of sampleAppointments) {
      const appointment = new Appointment(apptData);
      await appointment.save();
      console.log(`Appointment for ${appointment.specialty} created successfully`);
    }

    console.log('All sample appointments have been created');
  } catch (error) {
    console.error('Error populating appointments:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the script
(async () => {
  await connectToDatabase();
  await populateAppointments();
})();
