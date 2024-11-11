import Appointment from '../schemas/Appointment.js';

export function validateRequestBody(reqBody, requiredFields, strict) {
  if (!reqBody || Object.keys(reqBody).length === 0) {
    return false;
  }

  const validFields = requiredFields.filter(field => reqBody[field]);
  if (!strict) {
    return validFields.length > 0;
  }

  return validFields.length === requiredFields.length;
}

export function isDateInPast(date) {
  return new Date(date).getTime() < Date.now();
}

export function isDateMoreThan30Days(date) {
  const maxDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
  return new Date(date).getTime() > maxDate;
}

export async function isAvailable(id, idKey, appointmentDate, duration = 30) {
  const start = new Date(appointmentDate);
  const end = new Date(start);
  end.setMinutes(start.getMinutes() + duration);

  const query = {
    [idKey]: id,
    $or: [
      {
        // new appointment starts within an existing appointment
        appointmentDate: { $lte: start },
        appointmentEndDate: { $gt: start }
      },
      {
        // new appointment ends within an existing appointment
        appointmentDate: { $lt: end },
        appointmentEndDate: { $gte: end }
      },
      {
        // new appointment fully covers an existing appointment
        appointmentDate: { $gte: start },
        appointmentEndDate: { $lte: end }
      }
    ]
  };

  const overlappingAppointments = await Appointment.find(query);

  return overlappingAppointments.length === 0;
}

export function validateField(value, type) {
  switch (type) {
  case 'uuid': {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
  case 'date': {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(value) && !isNaN(Date.parse(value));
  }
  case 'number':
    return typeof value === 'number' && !isNaN(value);
  case 'string':
    return typeof value === 'string';
  case 'boolean':
    return typeof value === 'boolean';
  default:
    return false;
  }
}