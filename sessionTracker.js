//import { resetChromeStorage } from "./utils";

const chartContainer = document.getElementById('sessions-chart-container');
const chartCanvas = document.getElementById('sessions-chart-canvas');

function getStudySessionData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['studySessions'], function (data) {
      console.log("result: ", data);
      if (data.studySession) {
        resolve(data.studySession);
      } else {
        resolve([]);
      }
    });
  });
}
      
// Function to update the chart with study session data
async function updateChart() {
  const studySessionData = await getStudySessionData();

  // Extract the data you want to display on the chart
  const sessionDates = studySessionData.map(session => session.date);
  const sessionLengths = studySessionData.map(session => session.length);

  // Update the chart data
  window.weeklyChart.data.datasets[0].data = sessionLengths;

  // Update any other chart settings or labels as needed
  window.weeklyChart.update();
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

