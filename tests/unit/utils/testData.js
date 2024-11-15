import { v4 as uuidv4 } from 'uuid';

let today = new Date();
today.setHours(today.getHours() + 1);

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

let tomorrowPlus15min = new Date();
tomorrowPlus15min.setDate(tomorrowPlus15min.getDate() + 1);
tomorrowPlus15min.setMinutes(tomorrowPlus15min.getMinutes() + 15);

let monthFromNow = new Date();
monthFromNow.setDate(monthFromNow.getDate() + 31);

let oneWeekFromNow = new Date();
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

let nineAM = new Date(oneWeekFromNow);
nineAM.setHours(9, 0, 0, 0);

let tenAM = new Date(oneWeekFromNow);
tenAM.setHours(10, 30, 0, 0);

let elevenAM = new Date(oneWeekFromNow);
elevenAM.setHours(11, 30, 0, 0);

let twelvePM = new Date(oneWeekFromNow);
twelvePM.setHours(12, 0, 0, 0);

let twoPM = new Date(oneWeekFromNow);
twoPM.setHours(14, 0, 0, 0);

let threePM = new Date(oneWeekFromNow);
threePM.setHours(15, 0, 0, 0);

let fourPM = new Date(oneWeekFromNow);
fourPM.setHours(16, 0, 0, 0);

const sampleAppointments = [
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'family_medicine',
    appointmentDate: tenAM,
    duration: 30,
    status: 'pending',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'dermatology',
    appointmentDate: twoPM,
    duration: 30,
    status: 'pending',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'pediatrics',
    appointmentDate: nineAM,
    duration: 30,
    status: 'completed',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'cardiology',
    appointmentDate: elevenAM,
    duration: 30,
    status: 'canceled',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'orthopedics',
    appointmentDate: threePM,
    duration: 30,
    status: 'pending',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'gynecology',
    appointmentDate: threePM,
    duration: 30,
    status: 'pending',
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    clinicId: uuidv4(),
    doctorId: uuidv4(),
    specialty: 'family_medicine',
    appointmentDate: threePM,
    duration: 30,
    status: 'pending',
  }
];

const workshift = {
  clinicId: sampleAppointments[0].clinicId,
  doctorId: sampleAppointments[0].doctorId,
  startDate: nineAM,
  duration: 240,
  endDate: new Date(nineAM.getTime() + 240 * 60000),
};

const sampleUser = {
  _id: uuidv4(),
  email: 'testuser2@mail.com',
  password: 'pAssw0rd!',
  roles: ['patient'],
};

const sampleUser2 = {
  _id: uuidv4(),
  email: 'testuser2@mail.com',
  password: 'pAssw0rd!',
  roles: ['doctor'],
};

export {
  today,
  yesterday,
  tomorrow,
  tomorrowPlus15min,
  monthFromNow,
  oneWeekFromNow,
  nineAM,
  tenAM,
  elevenAM,
  twelvePM,
  twoPM,
  threePM,
  fourPM,
  sampleAppointments,
  workshift,
  sampleUser,
  sampleUser2,
};