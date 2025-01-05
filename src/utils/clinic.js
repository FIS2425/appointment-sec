import axios from 'axios';

export async function getClinicData(clinicId, cookie) {
  const url = process.env.PAYMENT_SVC + `/clinics/${clinicId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: cookie
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error);
      console.error(`Error getting clinic data:', ${error.message}`);
      if (error.response) {
        console.error(`Error response: ${error.response.data}`);
      }
    } else {
      console.error(`Unexpected error: ${error.message}`);
    }
    throw error;
  }
}
