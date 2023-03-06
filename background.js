//dormant until an event the file is listening for fires, react with specified instructions, then unload.
// background.js

/*
// USE THIS TO CLEAR STORAGE 
chrome.storage.local.clear(function() {
  var error = chrome.runtime.lastError;
  if (error) {
      console.error(error);
  }
  // do something more
});
chrome.storage.sync.clear(); // callback is optional
*/
//chrome://newtab

let activeTabUrl = null;
let ignoredURLs = ["chrome://newtab","chrome://newtab/", "chrome://extensions/", "chrome://settings/"];

// initialize the last active time
let lastActiveTime = Date.now();

// when the user switches to a new tab, update the record for the previous tab
console.log("testing");
chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log("active tab changed to " + activeInfo.tabId + "");
  try {
    //console.log("active tab changed to " + activeInfo.tabId + "");
    chrome.tabs.get(activeInfo.tabId, async function(tab){
        console.log(tab.url);
        if (activeTabUrl !== null) {
          console.log(activeTabUrl);
          console.log(tab.url);
          await updateTimeSpent(activeTabUrl);
        }
        activeTabUrl = tab.url;
        updateStartTime(activeTabUrl);
    });
  } catch (error) {
    console.error(error);
  }
});

// when the user closes a tab, update the record for that tab
chrome.tabs.onRemoved.addListener(function(tabId,removeInfo) {
  console.log("onRemoved listener");
    try {
      chrome.tabs.get(tabId, function(tab){
        updateTimeSpent(tab.url);
        if (activeTabUrl === tab.url) {
          activeTabUrl = null;
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
  

// when the user closes a window, update the record for the active tab
chrome.windows.onRemoved.addListener(function() {
  console.log("windows.onRemoved listener");
  try {
    if (activeTabUrl !== null) {
      updateTimeSpent(activeTabUrl);
      activeTabUrl = null;
    }
  } catch (error) {
    console.error(error);
  }
});

// update the start time for a tab
function updateStartTime(tabUrl) {
  console.log("updating start time for :", tabUrl);
  // if new tab is chrome://newtab, do nothing
  if (ignoredURLs.includes(tabUrl)) {
    console.log("ignored url :", tabUrl);
    return;
  }

  // get the current time
  const currentTime = Date.now();

  // get tab origin
  let url;
  try{
    const temp = new URL(tabUrl).origin;
    console.log("url:-", temp, "-");
    url = temp;
  } catch(error){
    console.log("not a proper url");
    return;
  }
  console.log("url 2: ", url);
  // get the tab record from storage
  chrome.storage.local.get([url], function(result) {
    let tabRecord = result[url];
    if (tabRecord === undefined) {
      tabRecord = {};
    }

    // get the date for the current time
    const date = new Date(currentTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // month is 0-indexed, so add 1
    const day = date.getDate();

    // create a new object to store the time spent data for the current day
    const timeSpentByDay = tabRecord.timeSpentByDay || {};
    const currentDayKey = `${year}-${month}-${day}`;
    const currentTimeSpent = timeSpentByDay[currentDayKey] || 0;
    const newTimeSpentByDay = { ...timeSpentByDay, [currentDayKey]: currentTimeSpent };

    // set the start time for the tab if the user is not idle
    if (lastActiveTime > (currentTime - 60 * 1000)) {
      tabRecord.startTime = currentTime;
      tabRecord.url = url;
    }

    // save the updated tab record to storage
    chrome.storage.local.set({ [url]: { ...tabRecord, timeSpentByDay: newTimeSpentByDay } });
  });
}


// update the time spent on a tab
function updateTimeSpent(tabUrl) {
  console.log("updating time spent for: ", tabUrl);
  //if new tab is chrome://newtab, do nothing
  if (ignoredURLs.includes(tabUrl)) return;

  // get the current time and date
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];

  //get tab origin
  let url;
  try{
    const temp = new URL(tabUrl).origin;
    console.log("url: ", temp);
    url = temp;
  } catch(error){
    console.log("from inside updateTimeSpent() not a proper url");
    return;
  }
  console.log("url 2: ", url);

  // get the tab record from storage
  chrome.storage.local.get([currentDate], function(result) {
    let data = result[currentDate] || {};

    // get the record for the current tab
    let tabRecord = data[url] || {};

    // if the tab has a start time, calculate the time spent
    if (tabRecord.hasOwnProperty("startTime") && lastActiveTime > (currentTime - 60 * 1000)) {
      const timeSpent = now.getTime() - tabRecord.startTime;
      tabRecord.timeSpent = (tabRecord.timeSpent || 0) + timeSpent;
      delete tabRecord.startTime;

      // store the updated tab record in the data object
      data[url] = tabRecord;

      // save the updated data object to storage
      chrome.storage.local.set({[currentDate]: data});
    }
  });
}

  

/*
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    /*
    if (tab.url && tab.url.includes("youtube.com/watch")){
        const queryParameters = tab.url.split("?")[1];
        const  urlParameters = new URLSearchParams(queryParameters);

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v")
        });
    }
    
   // by passing an object you can define default values e.g.: []
    chrome.storage.local.get({tabs: []}, function (result) {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        var tabs = result.tabs;
        tabs.push({keyPairId: keyPairId, HasBeenUploadedYet: false});
        // set the new array value to the same key
        chrome.storage.local.set({tabs: tabs}, function () {
            // you can use strings instead of objects
            // if you don't  want to define default values
            chrome.storage.local.get('tabs', function (result) {
                console.log(result.tabs)
            });
        });
    })

})
*/