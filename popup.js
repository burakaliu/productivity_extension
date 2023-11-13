//script for popup.html page

import {extractNameFromURL, parseSecondsIntoReadableTime, getTodayDateString, resetChromeStorage, getTotalTimeOfToday, randomColor} from "./utils.js";
import {timerLogic, addNewBlacklistedSite, addOldBlacklistedSite, statusUpdate, updateTimer, listenForTimerEnd, startTime, loadOldBlacklistedSitesFromStorage, formdata} from "./blacklister.js";

//open new tab page if the user clicks on home button
if (document.getElementById("home") != null){
    document.getElementById("home").addEventListener("click", function(){
        chrome.tabs.create({url: "fullscreen.html"});
    });
}

//blacklister timer functions
loadOldBlacklistedSitesFromStorage();
statusUpdate();
updateTimer();
listenForTimerEnd();

//when all content on page is loaded
document.addEventListener("DOMContentLoaded", function () {
    //if the blsiteadder button is there, add event listener to it
    if (document.getElementById("blsiteadder") != null){
        document.getElementById("blsiteadder").onclick = formdata;
    } 
    
    //if selectedTime exists, watch it for time selection changes
    if (document.getElementById("selectedTime") != null){
        document.getElementById("selectedTime").addEventListener("change", ()=>{
            document.getElementById("countdown-number").textContent = document.getElementById("selectedTime").value + ":00";
        });
    }
    
    timerLogic();
        
    if(dateElement){
        loadChartOfDay(dateElement.innerText);
        getTotalTimeOfToday(dateElement.innerText);
    }
    
});

function loadChartOfDay(day){

    console.log("loading chart of day: ", day);
    console.log(getTodayDateString());
    // destroy the previous chart
    if (window.myChart) {
        window.myChart.destroy();
      }
    

    
    // get all of the day records from storage
    chrome.storage.local.get(null, function(result) {
        console.log("result: ", result);

        const today = day; //getTodayDateString();
        var sortedTabRecords = [];
        try{
            sortedTabRecords = Object.entries(result[today]).filter(element => element[1] > 60 && element.length > 1).sort((a, b) => b[1] - a[1]);
        }catch(error){
            console.log("error sorting tab records: ", error);
        }

        console.log("sortedTabRecords: ", sortedTabRecords);

        if (document.getElementById("tabs") != null){
            document.getElementById("tabs").innerHTML = "";
        }

        // create a row in the table for each tab
        for (const tabRecord of sortedTabRecords) {
            if (document.getElementById("tabs") != null){

                const tabsTable = document.getElementById("tabs");
                const tabRow = document.createElement("tr");
                const icon = document.createElement("img");
                const urlCell = document.createElement("td");
                const timeSpentCell = document.createElement("td");

                tabRow.className = "tab-row";
                icon.className = "tab-icon";
                urlCell.className = "tab-url";
                timeSpentCell.className = "tab-time-spent";

                urlCell.textContent = tabRecord[0];
                //grab official icon of site but if it does not exist, use default icon
                //icon.src = `https://www.${urlCell.textContent}/favicon.ico`; chrome-extension://${chrome.runtime.id}/_favicon/
                //icon.src = `chrome://favicon/https://${urlCell.textContent}/home`;
                icon.src = `chrome-extension://${urlCell.textContent}/_favicon/`;
                icon.addEventListener("error", () => {
                    icon.src = "/assets/default.png"; // replace with URL of default icon
                });
                tabRow.appendChild(icon);
                tabRow.appendChild(urlCell);

                timeSpentCell.textContent = parseSecondsIntoReadableTime(tabRecord[1]);
                tabRow.appendChild(timeSpentCell);

                tabsTable.appendChild(tabRow);
            }
        }

        /* create the pie chart */
        // get the total time spent on all tabs for today
        var chartData = [];
        try {
            chartData = Object.entries(result[today])
            .filter(element => element[1] > 60 && element.length > 1)
            .map(item => ({
            label: extractNameFromURL(item[0]),
            data: item[1],
            readableTime: parseSecondsIntoReadableTime(item[1]),
            backgroundColor: randomColor(),
            }));
        } catch (error) {
            console.log("error creating chart data: ", error);
        }
        

        const totalTimeSpent = chartData.reduce((sum, item) => sum + item.data, 0);

        // create the pie chart
        try {
            const ctx = document.getElementById("chart").getContext("2d");

            window.myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: chartData.map(item => `${item.label}`),
                    datasets: [
                        {
                            data: chartData.map(item => item.data),
                            //backgroundColor: chartData.map(item => item.backgroundColor),
                        },
                    ],
                },
                options: {
                    plugins: {
                        tooltip: {
                            enabled: true,
                            boxWidth: 0,
                            boxHeight: 0,
                            callbacks: {
                                label: function(context) {
                                    var label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y + ' seconds';
                                    }
                                    return parseSecondsIntoReadableTime(context.parsed).slice(0,-7);
                                }
                            }
                        },
                        legend: {
                            display: false,
                        },
                        title: {
                            display: false,
                            text: `Total Time: ${parseSecondsIntoReadableTime(totalTimeSpent).slice(0,-7)}`,
                        },
                    }
                },
            });
        } catch (error) {
            console.log("error creating pie chart" + error);
        }
        
    });

}


//check wether reset chrome storage button exists
if (document.getElementById("resetChromeStorage") != null){
    document.getElementById("resetChromeStorage").onclick = resetChromeStorage;
}
//check if print chrome storage button exists
if (document.getElementById("printChromeStorage") != null){
    document.getElementById("printChromeStorage").onclick = function(){chrome.storage.local.get(null, function (data) { console.info("all of chrome storage", data) })};
}

let dateElement;
let leftButton;
let rightButton;
//date picker
try {
    dateElement = document.getElementById('date');
    leftButton = document.getElementById('left-button');
    rightButton = document.getElementById('right-button');

    // Get today's date
    let date = new Date();
    updateDate();

    // Listen for left button click
    leftButton.addEventListener('click', () => {
    date.setDate(date.getDate() - 1);
    updateDate();
    loadChartOfDay(dateElement.innerText);
    getTotalTimeOfToday(dateElement.innerText);
    });

    // Listen for right button click
    rightButton.addEventListener('click', () => {
    date.setDate(date.getDate() + 1);
    updateDate();
    loadChartOfDay(dateElement.innerText);
    getTotalTimeOfToday(dateElement.innerText);
    });

    // Function to update the date on the page
    function updateDate() {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        dateElement.innerText = `${year}-${month}-${day}`;
    }
} catch (error) {
    console.log("error with date element: ", error);
}



