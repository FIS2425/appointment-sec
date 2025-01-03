# Appointment Service

> Version 1.0.0

Appointment management microservice for medical consultation application. Handles scheduling, retrieval, updating, and cancellation of patient appointments.


## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/appointments](#getappointments) | Get all appointments |
| POST | [/appointments](#postappointments) | Create a new appointment |
| GET | [/appointments/available](#getappointmentsavailable) | Get available appointment slots |
| GET | [/appointments/clinic/{clinicId}](#getappointmentsclinicclinicid) | Get all appointments for a clinic |
| GET | [/appointments/doctor/{doctorId}](#getappointmentsdoctordoctorid) | Get all appointments for a doctor |
| GET | [/appointments/patient/{patientId}](#getappointmentspatientpatientid) | Get all appointments for a patient |
| DELETE | [/appointments/{id}](#deleteappointmentsid) | Delete an appointment |
| GET | [/appointments/{id}](#getappointmentsid) | Get appointment by ID |
| PUT | [/appointments/{id}](#putappointmentsid) | Update an appointment |
| PUT | [/appointments/{id}/cancel](#putappointmentsidcancel) | Cancel an appointment |
| PUT | [/appointments/{id}/complete](#putappointmentsidcomplete) | Complete an appointment |
| PUT | [/appointments/{id}/noshow](#putappointmentsidnoshow) | Mark an appointment as no_show |
| GET | [/appointments/{id}/weather](#getappointmentsidweather) | Get weather forecast for appointment |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| Appointment | [#/components/schemas/Appointment](#componentsschemasappointment) |  |
| AppointmentCreate | [#/components/schemas/AppointmentCreate](#componentsschemasappointmentcreate) |  |
| AppointmentUpdate | [#/components/schemas/AppointmentUpdate](#componentsschemasappointmentupdate) |  |
| cookieAuth | [#/components/securitySchemes/cookieAuth](#componentssecurityschemescookieauth) |  |

## Path Details

***

### [GET]/appointments

- Summary  
Get all appointments

- Description  
Retrieve a list of all appointments in the system.

- Security  
cookieAuth  

#### Responses

- 200 List of appointments

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}[]
```

- 500 Error retrieving appointments

***

### [POST]/appointments

- Summary  
Create a new appointment

- Description  
Schedule a new appointment for a patient with specified details.

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
{
  // ID of the patient for whom the appointment is created
  patientId: string
  // ID of the clinic where the appointment will be held
  clinicId: string
  // ID of the doctor for the appointment
  doctorId: string
  // Medical specialty for the appointment
  specialty: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate: string
}
```

#### Responses

- 201 Appointment created successfully

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

- 500 Error creating the appointment

***

### [GET]/appointments/available

- Summary  
Get available appointment slots

- Description  
Retrieve available appointment slots for a specific clinic, doctor, and date.

- Security  
cookieAuth  

#### Parameters(Query)

```ts
clinicId: string
```

```ts
doctorId: string
```

```ts
date: string
```

#### Responses

- 200 List of available appointment slots

`application/json`

```ts
{
  // Start time of the available appointment slot
  startTime?: string
  // End time of the available appointment slot
  endTime?: string
}[]
```

- 500 Error obtaining clinic appointments

`application/json`

```ts
{
  error?: string
  message?: string
}
```

***

### [GET]/appointments/clinic/{clinicId}

- Summary  
Get all appointments for a clinic

- Description  
Retrieve a list of all appointments for a specific clinic by its ID.

- Security  
cookieAuth  

#### Responses

- 200 List of appointments for the clinic

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}[]
```

- 500 Error retrieving appointments for the clinic

***

### [GET]/appointments/doctor/{doctorId}

- Summary  
Get all appointments for a doctor

- Description  
Retrieve a list of all appointments for a specific doctor by their ID.

- Security  
cookieAuth  

#### Responses

- 200 List of appointments for the doctor

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}[]
```

- 500 Error retrieving appointments for the doctor

***

### [GET]/appointments/patient/{patientId}

- Summary  
Get all appointments for a patient

- Description  
Retrieve a list of all appointments for a specific patient by their ID.

- Security  
cookieAuth  

#### Responses

- 200 List of appointments for the patient

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}[]
```

- 500 Error retrieving appointments for the patient

***

### [DELETE]/appointments/{id}

- Summary  
Delete an appointment

- Description  
Remove an appointment from the system by its ID.

- Security  
cookieAuth  

#### Responses

- 200 Appointment deleted successfully

`application/json`

```ts
{
  message?: string
}
```

- 404 Appointment not found

- 500 Error deleting the appointment

***

### [GET]/appointments/{id}

- Summary  
Get appointment by ID

- Description  
Retrieve details of a specific appointment by its ID.

- Security  
cookieAuth  

#### Responses

- 200 Appointment details retrieved successfully

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

- 404 Appointment not found

- 500 Error retrieving the appointment

***

### [PUT]/appointments/{id}

- Summary  
Update an appointment

- Description  
Modify details of an existing appointment by ID.

- Security  
cookieAuth  

#### RequestBody

- application/json

```ts
{
  // Updated medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Updated date and time of the appointment
  appointmentDate?: string
  // Updated status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
}
```

#### Responses

- 200 Appointment updated successfully

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

- 404 Appointment not found

- 500 Error updating the appointment

***

### [PUT]/appointments/{id}/cancel

- Summary  
Cancel an appointment

- Description  
Change the status of an appointment to "cancelled" by its ID.

- Security  
cookieAuth  

#### Responses

- 200 Appointment cancelled successfully

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

- 400 Appointment ID not provided

- 404 Appointment not found

- 500 Error cancelling the appointment

***

### [PUT]/appointments/{id}/complete

- Summary  
Complete an appointment

- Description  
Change the status of an appointment to "completed" by its ID.

- Security  
cookieAuth  

#### Responses

- 200 Appointment completed successfully

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

- 400 Appointment ID not provided

- 404 Appointment not found

- 500 Error completing the appointment

***

### [PUT]/appointments/{id}/noshow

- Summary  
Mark an appointment as no_show

- Description  
Change the status of an appointment to "no_show" by its ID.

- Security  
cookieAuth  

#### Responses

- 200 Appointment marked as no_show successfully

`application/json`

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

- 400 Appointment ID not provided

- 404 Appointment not found

- 500 Error marking appointment as no_show

***

### [GET]/appointments/{id}/weather

- Summary  
Get weather forecast for appointment

- Description  
Retrieve weather forecast for the location and date of a specific appointment by ID.

#### Responses

- 200 Weather forecast for the appointment date and location

- 404 Appointment or weather data not found

- 500 Error retrieving the weather information

## References

### #/components/schemas/Appointment

```ts
{
  // Unique identifier for the appointment
  id?: string
  // ID of the patient associated with the appointment
  patientId?: string
  // ID of the clinic where the appointment is scheduled
  clinicId?: string
  // ID of the doctor handling the appointment
  doctorId?: string
  // Medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate?: string
  // Current status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
  // Appointment creation timestamp
  createdAt?: string
}
```

### #/components/schemas/AppointmentCreate

```ts
{
  // ID of the patient for whom the appointment is created
  patientId: string
  // ID of the clinic where the appointment will be held
  clinicId: string
  // ID of the doctor for the appointment
  doctorId: string
  // Medical specialty for the appointment
  specialty: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Date and time of the appointment
  appointmentDate: string
}
```

### #/components/schemas/AppointmentUpdate

```ts
{
  // Updated medical specialty for the appointment
  specialty?: enum[family_medicine, nursing, physiotherapy, gynecology, pediatrics, dermatology, cardiology, neurology, orthopedics, psychiatry, endocrinology, oncology, radiology, surgery, ophthalmology, urology, anesthesiology, otolaryngology, gastroenterology, other]
  // Updated date and time of the appointment
  appointmentDate?: string
  // Updated status of the appointment
  status?: enum[pending, completed, cancelled, no_show]
}
```

### #/components/securitySchemes/cookieAuth

```ts
{
  "type": "apiKey",
  "in": "cookie",
  "name": "token"
}
```