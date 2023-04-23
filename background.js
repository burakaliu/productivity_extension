//dormant until an event the file is listening for fires, react with specified instructions, then unload.
// background.js

let activeTabUrl = null;
let ignoredURLs = ["chrome://newtab","chrome://newtab/", "chrome://extensions/", "chrome://settings/"];


// initialize an object to store tab URLs
const tabUrls = {};

// initialize the last active time
let lastActiveTime = performance.now();

// Declare a variable to store the time spent on the current tab
var timeSpent = 0;

// Declare a variable to store the current tab ID
var currentTabId;
var currentTabName;

// Start the timer to update the time spent every second
let timerId = null; // initialize timerId variable

function startTimer() {
  if (!timerId) { // check if timer is not already running
    timerId = setInterval(updateTimeSpent, 1000); // start the timer
  }
}

function stopTimer() {
  if (timerId) { // check if timer is running
    clearInterval(timerId); // stop the timer
    timerId = null; // reset the timerId variable
  }
}

startTimer(); // start the timer when the extension is loaded


//to track wether the user is idle or not
let lastRequestTime = Date.now();

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    lastRequestTime = Date.now();
  },
  { urls: ["<all_urls>"] }
);


// Function to update the time spent on the current tab
function updateTimeSpent() {

  //for testing if the timer is working   
  //console.log("updating time spent. Date.now is ", Date.now()/1000, " performance.now is ", performance.now()/1000);

  // Get the current date in YYYY-MM-DD format
  var currentDate = getTodayDateString();
  
  // Get the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // If there is a current tab
    if (tabs[0] && Date.now() - lastRequestTime < 10 * 60 * 1000) { //if idle for longer than 10 minutes, don't update time spent

      //console.log("tabs[0].url is ", tabs[0].url, "performance is ", performance.now()/1000, "Date.now is ", Date.now()/1000);
      
      // Get the tab data for the current date from chrome storage
      chrome.storage.local.get(currentDate, function(result) {

          // If the current tab ID has changed, update the currentTabId variable and reset the timeSpent variable
        if (currentTabName !== extractNameFromURL(tabs[0].url)) {
          currentTabName = extractNameFromURL(tabs[0].url);
          timeSpent = result[currentDate][currentTabName] || 0;
        }

        // Increment the time spent variable with the elapsed time, converted to seconds
        timeSpent += 1;

        var dayData = result[currentDate] || {};
        // Update the time spent for the current tab in the day data object
        dayData[currentTabName] = timeSpent;
        // Store the updated day data object back in chrome storage
        var data = {};
        data[currentDate] = dayData;
        chrome.storage.local.set(data);
      });
    }
  });
}

let pomodoroID;
let pomodoroTime;
let timerStatus;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'START_TIMER') {
    timerStatus = "on";
    console.log("starting timer");
    pomodoroTime = request.length;
    pomodoroID = setInterval(function() {
      if (pomodoroTime > 0) {
          pomodoroTime--;
      }else{
          console.log("countdown is 0");
          timerStatus = "off";
          sendResponse({ cmd: 'finished' });
          clearInterval(pomodoroID); 
      }
    }, 1000);
  } else if (request.cmd === 'GET_TIME') {
    console.log("getting time: ", pomodoroTime, " from background.js");
    if (pomodoroTime) {
      sendResponse({ time: pomodoroTime });
    }else{
      sendResponse({ time: 30*60 });
    }
  } else if(request.cmd === 'GET_STATUS'){
    console.log("getting status: ", timerStatus, " from background.js");
    sendResponse(timerStatus);
  }
});

function getTodayDateString(){
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

function extractNameFromURL(url){
  const urlRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i;
  const match = urlRegex.exec(url);
  return (match ? match[1] : "").toString();
}