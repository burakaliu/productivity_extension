//dormant until an event the file is listening for fires, react with specified instructions, then unload.

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