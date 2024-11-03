import mongoose from 'mongoose';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

const AppointmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
    validate: {
      validator: uuidValidate,
      message: props => `${props.value} not a valid UUID!`
    }
  },
  patientId: {
    type: String,
    required: true,
    validate: {
      validator: uuidValidate,
      message: props => `${props.value} not a valid UUID!`
    }
  },
  clinicId: {
    type: String,
    required: true,
    validate: {
      validator: uuidValidate,
      message: props => `${props.value} not a valid UUID!`
    }
  },
  doctorId: {
    type: String,
    required: true,
    validate: {
      validator: uuidValidate,
      message: props => `${props.value} not a valid UUID!`
    }
  },
  specialty: {
    type: String,
    required: true,
    enum: ['family_medicine', 'nursing', 'physiotherapy', 'gynecology', 'pediatrics', 'dermatology', 'cardiology', 'neurology', 'orthopedics', 'psychiatry', 'endocrinology', 'oncology', 'radiology', 'surgery', 'ophthalmology', 'urology', 'anesthesiology', 'otolaryngology', 'gastroenterology', 'other'],
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled', 'no_show'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Appointment', AppointmentSchema);
