import Appointment from '../schemas/Appointment.js';
import Workshift from '../schemas/Workshift.js';

export const getAppointmentsWorkshiftByDoctorAndDate = async (clinicId, doctorId, date) => {
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
        
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const appointmentsWithWorkshift = await Appointment.aggregate([
      {
        $match: {
          doctorId: doctorId,
          clinicId: clinicId,
          status: 'pending',
          appointmentDate: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $lookup: {
          from: 'workshifts',
          let: { 
            doctor_id: '$doctorId',
            appointment_date: '$appointmentDate'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$doctorId', '$$doctor_id'] },
                    { $eq: ['$clinicId', clinicId] },
                    { $gte: ['$startDate', startDate] },
                    { $lte: ['$endDate', endDate] }
                  ]
                }
              }
            }
          ],
          as: 'workshift'
        }
      }
    ]);
    return appointmentsWithWorkshift;
  } catch (error) {
    throw new Error(`Error getting appointments and workshift: ${error.message}`);
  }
};

const getWorkshiftByDoctorIdAndDate = async (doctorId, clinicId, date) => {
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const workshifts = await Workshift.find({ doctorId: doctorId, clinicId: clinicId, startDate: { $lte: endDate }, endDate: { $gte: startDate } });

    return workshifts;
  } catch (error) {
    throw new Error(`Error getting workshift: ${error.message}`);
  }
};


export const getFreeTimeIntervals = async (appointments, date, doctorId, clinicId) => {
  // Fetch workshifts for the doctor, clinic, and date
  const workshifts = await getWorkshiftByDoctorIdAndDate(doctorId, clinicId, date);

  const freeTimeIntervals = [];

  // If no appointments exist, return the full workshifts as free intervals
  if (!appointments || appointments.length === 0) {
    return workshifts.map((workshift) => {
      const workShiftStart = new Date(workshift.startDate);
      const workShiftEnd = new Date(workShiftStart.getTime() + workshift.duration * 60000);
      return { start: workShiftStart, end: workShiftEnd };
    });
  }

  // Sort appointments by start date
  appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  // Sort workshifts by start date
  const sortedWorkshifts = workshifts.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  // Iterate over workshifts
  for (let i = 0; i < sortedWorkshifts.length; i++) {
    const workShiftStart = new Date(sortedWorkshifts[i].startDate);
    const workShiftEnd = new Date(workShiftStart.getTime() + sortedWorkshifts[i].duration * 60000);

    // Filter appointments within the current workshift
    const appointmentsInShift = appointments.filter(
      (appointment) =>
        new Date(appointment.appointmentDate) >= workShiftStart &&
        new Date(appointment.appointmentDate) < workShiftEnd
    );

    let previousAppointmentEndTime = workShiftStart;

    // Iterate through appointments to find free time intervals
    for (let j = 0; j < appointmentsInShift.length; j++) {
      const appointmentStart = new Date(appointmentsInShift[j].appointmentDate);
      const appointmentEnd = new Date(appointmentsInShift[j].appointmentEndDate);

      // Add free time interval between previous end and current start
      if (appointmentStart > previousAppointmentEndTime) {
        freeTimeIntervals.push({
          start: previousAppointmentEndTime,
          end: appointmentStart,
        });
      }

      // Update the end of the last processed appointment
      previousAppointmentEndTime = appointmentEnd;
    }

    // Add free time interval between the last appointment and the end of the workshift
    if (previousAppointmentEndTime < workShiftEnd) {
      freeTimeIntervals.push({
        start: previousAppointmentEndTime,
        end: workShiftEnd,
      });
    }
  }

  // Return only valid intervals where start < end
  return freeTimeIntervals.filter((interval) => interval.start < interval.end);
};


export const getAvailableAppointmentsByWorkshift = async (intervals, duration) => {
  const result = [];

  intervals.forEach(interval => {
    let start = new Date(interval.start);
    const end = new Date(interval.end);

    while (start < end) {
      result.push({ appointmentDate: start.toISOString() });
      start = new Date(start.getTime() + duration * 60000);
    }
  });

  return result;
}