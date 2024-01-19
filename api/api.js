// api.js
import axios from 'axios';

// const baseUrl = 'http://localhost:8080/mannit';

const baseUrl = 'http://localhost:8080/mannit';

export async function loginUser(username, password) {
  try {
    const response = await fetch('http://localhost:8080/mannit/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('An error occurred while logging in', error.message);
    return { success: false, error: 'Network error' };
  }
}

export async function fetchDataByPhoneNumber(phoneNumber) {
  try {
    const url = `${baseUrl}/eSearch?domain=healthCare&subdomain=clinic&userId=657ef4b72bafd911c42813b3&f=phonenumber_S eq ${phoneNumber}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function saveFormData(data) {
  try {
    const url = `${baseUrl}/eCreate?domain=healthCare&subdomain=clinic&userId=657ef4b72bafd911c42813b3`;

    data.creationDate = new Date();
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateFormData(data) {
  try {
    const url = `${baseUrl}/eUpdate?domain=healthCare&subdomain=clinic&userId=65a8c67e7b18c25411705eaf&resourceId=65a93bea7b18c25411705ed4`;
    const response = await axios.put(url, data);
    return { success: true, data: response.data };
  } catch (error) {
    throw error;
  }
}



