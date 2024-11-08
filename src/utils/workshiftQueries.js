import Appointment from '../schemas/Appointment.js';

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

export const getFreeTimeIntervals = async (appointments) => {
  const freeTimeIntervals = [];

  // Ordenar las citas por fecha de inicio
  appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  // Obtener los turnos de trabajo y ordenarlos por fecha de inicio
  const workShifts = appointments[0].workshift.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  // Iterar sobre los turnos de trabajo
  for (let i = 0; i < workShifts.length; i++) {
    const workShiftStart = new Date(workShifts[i].startDate);
    const workShiftEnd = new Date(workShiftStart.getTime() + workShifts[i].duration * 60000);

    // Filtrar las citas que están dentro del turno de trabajo actual
    const appointmentsInShift = appointments.filter(
      (appointment) =>
        new Date(appointment.appointmentDate) >= workShiftStart &&
        new Date(appointment.appointmentDate) < workShiftEnd
    );

    let previousAppointmentEndTime = workShiftStart;

    // Iterar sobre las citas en el turno de trabajo para calcular intervalos libres
    for (let j = 0; j < appointmentsInShift.length; j++) {
      const appointmentStart = new Date(appointmentsInShift[j].appointmentDate);
      const appointmentEnd = new Date(appointmentsInShift[j].appointmentEndDate);

      // Verificar si hay un intervalo libre entre el final de la cita anterior y el inicio de la actual
      if (appointmentStart > previousAppointmentEndTime) {
        freeTimeIntervals.push({
          start: previousAppointmentEndTime,
          end: appointmentStart,
        });
      }

      // Actualizar el final de la última cita procesada
      previousAppointmentEndTime = appointmentEnd;
    }

    // Verificar si hay tiempo libre después de la última cita, hasta el final del turno de trabajo
    if (previousAppointmentEndTime < workShiftEnd) {
      freeTimeIntervals.push({
        start: previousAppointmentEndTime,
        end: workShiftEnd,
      });
    }
  }

  // Filtrar y devolver solo los intervalos válidos (donde la hora de inicio es menor que la hora de fin)
  return freeTimeIntervals.filter(interval => interval.start < interval.end);
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