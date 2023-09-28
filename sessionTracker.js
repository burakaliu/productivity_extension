//import { resetChromeStorage } from "./utils";

const chartContainer = document.getElementById('sessions-chart-container');
const chartCanvas = document.getElementById('sessions-chart-canvas');

function getStudySessionData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['studySessions'], function (data) {
      console.log("result: ", data);
      if (data) {
        resolve(data);
      } else {
        resolve([]);
      }
    });
  });
}
      
// Function to update the chart with study session data
async function updateChart() {
  console.log('Updating chart');
  const studySessionData = await getStudySessionData();
  console.log(studySessionData);

  // Ensure that studySessionData is an object with a studySessions property
  if (studySessionData && Array.isArray(studySessionData.studySessions)) {
    // Create an array of dates for the week
    const startDate = new Date(); // You can set your desired start date here
    const endDate = new Date();   // You can set your desired end date here
    const daysOfWeek = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      daysOfWeek.push(new Date(d));
    }

    // Extract the data you want to display on the chart
    const sessionDates = daysOfWeek.map(date => date.toISOString().split('T')[0]); // Format date as "YYYY-MM-DD"
    const sessionLengths = sessionDates.map(date => {
      // Calculate total length for each date
      const sessionsOnDate = studySessionData.studySessions.filter(session => session.date === date);
      return sessionsOnDate.reduce((total, session) => total + session.length, 0);
    });

    console.log(sessionDates);
    console.log(sessionLengths);

    // Update the chart data
    window.weeklyChart.data.labels = sessionDates;
    window.weeklyChart.data.datasets[0].data = sessionLengths;

    // Update any other chart settings or labels as needed
    window.weeklyChart.update();
  } else {
    console.error('Invalid study session data format.');
  }
}




document.addEventListener("DOMContentLoaded", function () {
  if (window.myChart) {
    window.myChart.destroy();
  }
  window.weeklyChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [{
        barPercentage: 0.5,
        barThickness: 40,
        maxBarThickness: 50,
        minBarLength: 2,
        borderRadius: 10,
        backgroundColor: "#3e95cd",
        data: [1, 2, 3, 4, 3, 2, 5],
        label: "Daily Sessions",
      }]
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 5,
          ticks: {
            stepSize: 1,
            max: 10,
            display: true,
          },
          grid: {
            display: false,
          },
        }
      }
    }
  });

  // Call the updateChart function to populate the chart with data
  updateChart();
});



/*
var monthlyChart = new Chart(chartCanvas, { 
   type: "bar",
   data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [{
          barPercentage: 0.5,
          barThickness: 50,
          maxBarThickness: 50,
          minBarLength: 2,
          data: [0, 5, 0, 0, 0, 0, 0],
          label: "Monthly Sessions",
      }]
    },
});
*/

