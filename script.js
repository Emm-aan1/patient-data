const API_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const API_USERNAME = 'coalition';
const API_PASSWORD = 'skills-test';

// Function to generate basic authentication header
function getBasicAuthHeader() {
  const combined = `${API_USERNAME}:${API_PASSWORD}`;
  return `Basic ${btoa(combined)}`;
}

// Function to fetch patient data from the API
async function getPatientData() {
  const headers = new Headers({
    'Authorization': getBasicAuthHeader()
  });

  try {
    const response = await fetch(API_URL, { headers });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// Function to create blood pressure chart
function createBloodPressureChart(diagnosisHistory) {
  // Filter data to include only from October 2023 to March 2024
  const filteredData = diagnosisHistory.filter(entry => {
    const entryDate = new Date(`${entry.month} 1, ${entry.year}`);
    return (entryDate >= new Date('October 1, 2023') && entryDate <= new Date('March 31, 2024'));
  });

  // Sort the filtered data by date
  filteredData.sort((a, b) => new Date(`${a.month} 1, ${a.year}`) - new Date(`${b.month} 1, ${b.year}`));

  const months = filteredData.map(entry => `${entry.month} ${entry.year}`);
  const systolicValues = filteredData.map(entry => entry.blood_pressure.systolic.value);
  const diastolicValues = filteredData.map(entry => entry.blood_pressure.diastolic.value);

  const ctx = document.getElementById('bloodPressureChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Systolic',
          data: systolicValues,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Diastolic',
          data: diastolicValues,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    }
  });
}

// Function to display patient data
async function displayPatientData() {
  const data = await getPatientData();
  console.log('Data:', data);

  if (!data || data.length === 0) {
    console.error('No data received or data structure is incorrect');
    return;
  }

  const jessicaData = data.find(patient => patient.name === 'Jessica Taylor');

  if (jessicaData) {
    document.getElementById('patient-name').textContent = jessicaData.name;
    if (jessicaData.diagnosis_history) {
      createBloodPressureChart(jessicaData.diagnosis_history);
    } else {
      console.error('No diagnostic history available for Jessica Taylor');
    }
  } else {
    console.error('Jessica Taylor not found in the data');
  }
}

// Event listener to trigger the display of patient data
document.addEventListener('DOMContentLoaded', displayPatientData);
