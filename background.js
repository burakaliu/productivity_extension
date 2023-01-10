//dormant until an event the file is listening for fires, react with specified instructions, then unload.
// background.js


/* USE THIS TO CLEAR STORAGE
chrome.storage.local.clear(function() {
  var error = chrome.runtime.lastError;
  if (error) {
      console.error(error);
  }
  // do something more
});
chrome.storage.sync.clear(); // callback is optional
*/


let activeTabUrl = null;

// when the user switches to a new tab, update the record for the previous tab
chrome.tabs.onActivated.addListener(function(activeInfo) {
  try {
    console.log("active tab changed to " + activeInfo.tabId + "");
    chrome.tabs.get(activeInfo.tabId, function(tab){
        console.log(tab.url);
        if (activeTabUrl !== null) {
          console.log(activeTabUrl);
          console.log(tab.url);
          updateTimeSpent(activeTabUrl);
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
  // get the current time
  const currentTime = Date.now();

  //get tab origin
  const url = new URL(tabUrl).origin;

  // get the tab record from storage
  chrome.storage.local.get([url], function(result) {
    let tabRecord = result[url];
    if (tabRecord === undefined) {
      tabRecord = {};
    }

    // set the start time for the tab
    tabRecord.startTime = currentTime;
    tabRecord.url = url;

    // save the updated tab record to storage
    chrome.storage.local.set({[url]: tabRecord});
  });
}

// update the time spent on a tab
function updateTimeSpent(tabUrl) {
  // get the current time
  const currentTime = Date.now();

  //get tab origin
  const url = new URL(tabUrl).origin;

  // get the tab record from storage
  chrome.storage.local.get([url], function(result) {
    let tabRecord = result[url];
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
    chrome.storage.local.set({[url]: tabRecord});
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