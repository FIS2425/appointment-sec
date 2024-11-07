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
  
  // Obtener los turnos de trabajo
  const workShifts = appointments[0].workshift;  // Asumiendo que todos los turnos de trabajo están en el mismo formato
  
  // Iterar sobre los turnos de trabajo
  for (let i = 0; i < workShifts.length; i++) {
    const workShiftStart = new Date(workShifts[i].startDate);
    const workShiftEnd = new Date(workShiftStart.getTime() + workShifts[i].duration * 60000);
    
    // Verificar si hay tiempo libre antes de la primera cita
    const firstAppointmentStart = new Date(appointments[0].appointmentDate);
    if (i === 0 && firstAppointmentStart.getTime() > workShiftStart.getTime()) {
      freeTimeIntervals.push({
        start: workShiftStart,
        end: firstAppointmentStart,
      });
    }
    
    let previousAppointmentEndTime = new Date(appointments[0].appointmentEndDate);
    
    // Iterar sobre las citas para calcular intervalos libres
    for (let j = 1; j < appointments.length; j++) {
      const appointment = appointments[j];
  
      // Verificar si la cita está dentro del turno de trabajo
      if (appointment.appointmentDate >= workShiftStart && appointment.appointmentDate < workShiftEnd) {
        let freeStartDate = new Date(previousAppointmentEndTime);
        let freeEndDate = new Date(appointment.appointmentDate);
    
        // Agregar el intervalo libre a la lista si hay suficiente tiempo
        if (freeEndDate.getTime() - freeStartDate.getTime() >= 60000) {
          freeTimeIntervals.push({
            start: freeStartDate,
            end: freeEndDate,
          });
        }
    
        // Actualizar el inicio del siguiente intervalo libre
        previousAppointmentEndTime = new Date(appointment.appointmentEndDate);
      }
    }
    
    // Verificar si hay tiempo libre después de la última cita, dentro del rango del turno de trabajo
    if (previousAppointmentEndTime.getTime() < workShiftEnd.getTime()) {
      freeTimeIntervals.push({
        start: previousAppointmentEndTime,
        end: workShiftEnd,
      });
    }
  }
  
  // Filtrar y devolver solo los intervalos dentro de los turnos de trabajo
  return freeTimeIntervals.filter(interval => interval.start < interval.end);
};