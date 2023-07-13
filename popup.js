//script for popup.html page

import {extractNameFromURL, parseSecondsIntoReadableTime, getTodayDateString} from "./utils.js";
import {addNewBlacklistedSite, addOldBlacklistedSite, statusUpdate, updateTimer, listenForTimerEnd, startTime} from "./blacklister.js";

/* make sure the lsit of blacklisted sites is consistent with the ones in storage */ 
/* basically just loading the list of blocked sites */
chrome.storage.local.get(["list"], (result) => { 
    //console.log(result.list);
    if (result.list == null){
        console.log("nothing in chrome data index 'list'");
    }else{
        for (let i = 0; i < result.list.length; i ++){
            addOldBlacklistedSite(result.list[i]);
            //console.log(result.list[i] + "is now on the popup ");
        }
    }
});

//open new tab page if the user clicks on home button
if (document.getElementById("home") != null){
    document.getElementById("home").addEventListener("click", function(){
        chrome.tabs.create({url: "popup.html"});
    });
}
/*
chrome.runtime.sendMessage({ cmd: 'GET_STATUS' }, response => {
    if (response) {
        console.log("recieved status: ", response, " now setting the status on the popup");
        chrome.storage.local.set({"onoff": response}, function(){
            console.log("tab blocker is now" + response);
        });
    }
    if (response == "off"){
        try {
            document.getElementById("selectedTime").disabled = false;
            document.getElementById("focusModeStart").disabled = false;
            document.getElementById("focusModeStart").style.filter = "saturate(100%)";
            document.getElementById("focusModeStart").style.transform = "none";
            document.getElementById("timerCircle").style.animation = "none";
        } catch (error) {
            console.log("error probably on wrong html page: " + error);
        }
    }else if (response == "on"){
        try {
            document.getElementById("focusModeStart").disabled = true;
            document.getElementById("selectedTime").disabled = true;
            document.getElementById("focusModeStart").style.filter = "saturate(10%)";
            document.getElementById("focusModeStart").style.transform = "scale(0.9)";
        } catch (error) {
            console.log("error probably on wrong html page: " + error);
        }
    }
});


// Call this when the pop-up is shown to update the time displayed
chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
    if (response.time) {
        console.log("recieved time: ", response.time, " ---- now setting the time on the popup");
        var countdownNumber = document.getElementById('countdown-number');
        var timeSelected = (document.getElementById("selectedTime") != null ? (response.time) : 90);
        countdownNumber ? (countdownNumber.textContent = formatTime(response.time)) : console.log("countdownNumber: ", countdownNumber);
        chrome.storage.local.get(["onoff"], (result) => {
            console.log("tab blocker is: " + result.onoff);
            if (result.onoff == "on"){
                startTimer(timeSelected);
            }else{
                console.log("tab blocker is: " + result.onoff);
            }
        });
    }
});

//this listens for when the timer is finished
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'finished') {
        document.getElementById("focusModeStart").disabled = false;
        document.getElementById("selectedTime").disabled = false;
        document.getElementById("focusModeStart").style.filter = "saturate(100%)";
        document.getElementById("focusModeStart").style.transform = "none";
        document.getElementById("timerCircle").style.setProperty("animation", "none");
        console.log("request.cmd is finished and this is timerCircle: ", document.getElementById("timerCircle").style);
        //turn off tab blocker
        chrome.storage.local.set({"onoff": "off"}, function(){
            console.log("tab blocker is now off line");
        });
    }else{
        console.log("request.cmd is not finished idk why this is being called");
    }
});
*/
//blacklister timer functions
statusUpdate();
updateTimer();
listenForTimerEnd();





//when all content on page is loaded
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("submit") != null){
        document.getElementById("submit").onclick = formdata;
    }
    if (document.getElementById("blsiteadder") != null){
        document.getElementById("blsiteadder").onclick = formdata;
    } 
    if (document.getElementById("selectedTime") != null){
        document.getElementById("selectedTime").addEventListener("change", ()=>{
            document.getElementById("countdown-number").textContent = document.getElementById("selectedTime").value + ":00";
        });
    }
    
    let pomodoroON = false;
    if (document.getElementById("focusModeStart") != null){
        console.log("focusModeElement exists");
        document.getElementById("focusModeStart").addEventListener("click", function() {
            if (!pomodoroON){
                pomodoroON = true;
                console.log("this shoudl not be running at the beginning");
                //disable start button
                document.getElementById("focusModeStart").disabled = true;
                document.getElementById("selectedTime").disabled = true;
                document.getElementById("focusModeStart").style.filter = "saturate(10%)";
                document.getElementById("focusModeStart").style.transform = "scale(0.9)";
                var timeSelected = (document.getElementById("selectedTime") != null ? (document.getElementById("selectedTime").value * 60) : 90);
                //initialize countdown
                if (document.getElementById('countdown-number')){
                    startTime(timeSelected);
                }
                console.log(timeSelected);
                focusMode(timeSelected);
            }
        });
    }
    //set tab blocker on
    //set a timer to turn off tab blocker after timer is over
    function focusMode(lengthInSeconds){
        console.log("focus mode started");
        //start animation
        let timerCircle = document.getElementById("timerCircle");
        //timerCircle.style.setProperty("animation", "countdown " + (lengthInSeconds) + "s linear infinite forwards");
        //timerCircle.style.setProperty("animation-delay", (document.getElementById("selectedTime").value + "s"));
        
        //turn on tab blocker
        chrome.storage.local.set({"onoff": "on"}, function(){
            console.log("tab blocker is now on");
        });
        setTimeout(() => {
            //turn off tab blocker after the specified time
            chrome.storage.local.set({"onoff": "off"}, async function(){
                console.log("tab blocker is now off after timer is done");
                //stop animation
                console.log("before: ", timerCircle.style.animation);
                timerCircle.style.setProperty("animation", "none");
                console.log("after: ", timerCircle.style.animation);
                pomodoroON = false;
            }); 
        }, (lengthInSeconds * 1000));//convert to milliseconds
    }
        
    console.log(getTodayDateString());
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
                icon.src = `https://www.${urlCell.textContent}/favicon.ico`;
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

function randomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function formdata() {
    
    // use `url` here inside the callback because it's asynchronous!
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        console.log("adding site to blacklist: ", url);
        addNewBlacklistedSite(url);
        // use `url` here inside the callback because it's asynchronous!
        
    });
}
//reset and print chrome storage
function resetChromeStorage() {
    chrome.storage.local.clear(function() {
        console.log("cleared chrome storage");
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
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

function getTotalTimeOfToday(date){
    //total time spent display
    if (document.getElementById("totalTime") != null){
        chrome.storage.local.get(null, function (data) {
            let totalTimeSpent = 0;
            for (let key in data) {
                if (key == date) {
                    for (let key2 in data[key]) {
                        totalTimeSpent += data[key][key2];
                    }
                }
            }
            console.log("total time spent: ", totalTimeSpent);
            document.getElementById("totalTime").innerHTML = `Total Time Today: ${parseSecondsIntoReadableTime(totalTimeSpent).slice(0,-7)}`;
        });
    }
}

