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
  type: {
    type: String,
    required: true,
    enum: ['consult', 'revision', 'follow_up'],
    default: 'consult',
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 60,
    default: 30,
  },
  appointmentEndDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled', 'no_show'],
    default: 'pending',
  },
});

AppointmentSchema.pre('save', function (next) {
  this.appointmentEndDate = new Date(this.appointmentDate);
  this.appointmentEndDate.setMinutes(this.appointmentEndDate.getMinutes() + this.duration);
  next();
});

AppointmentSchema.pre('findByIdAndUpdate', function (next) {
  this._update.appointmentEndDate = new Date(this._update.appointmentDate);
  this._update.appointmentEndDate.setMinutes(this._update.appointmentEndDate.getMinutes() + this._update.duration);
  next();
});

AppointmentSchema.pre('insertMany', function (next, docs) {
  docs.forEach((doc) => {
    doc.appointmentEndDate = new Date(doc.appointmentDate);
    doc.appointmentEndDate.setMinutes(doc.appointmentEndDate.getMinutes() + doc.duration);
  });
  next();
});

export default mongoose.model('Appointment', AppointmentSchema);
