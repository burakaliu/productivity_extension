const chartContainer = document.getElementById('sessions-chart-container');
const chartCanvas = document.getElementById('sessions-chart-canvas');

var weeklyChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [{
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        data: [10, 20, 30, 40, 50, 60, 70],
        label: "My data"
    }]
    }
  });
/*
var monthlyChart = new Chart(chartCanvas, { 
   type: "bar",
   data: {
    
   }
});
*/