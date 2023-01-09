//dormant until an event the file is listening for fires, react with specified instructions, then unload.
// background.js

// keep track of the active tab
let activeTabId = null;

// when the user switches to a new tab, update the record for the previous tab
chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (activeTabId !== null) {
    updateTimeSpent(activeTabId);
  }
  activeTabId = activeInfo.tabId;
});

// when the user closes a tab, update the record for that tab
chrome.tabs.onRemoved.addListener(function(tabId) {
  if (activeTabId === tabId) {
    activeTabId = null;
  } else {
    updateTimeSpent(tabId);
  }
});

// update the time spent on a tab
function updateTimeSpent(tabId) {
  // get the current time
  const currentTime = Date.now();

  // get the tab record from storage
  chrome.storage.local.get([tabId], function(result) {
    let tabRecord = result[tabId];
    if (tabRecord === undefined) {
      tabRecord = {};
    }

    // if the tab has a start time, calculate the time spent
    if (tabRecord.hasOwnProperty("startTime")) {
      const timeSpent = currentTime - tabRecord.startTime;
      tabRecord.timeSpent = (tabRecord.timeSpent || 0) + timeSpent;
      delete tabRecord.startTime;
    }

    // save the updated tab record to storage
    chrome.storage.local.set({[tabId]: tabRecord});
  });
}


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
    */
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