export async function getCurrentTab(){
    let queryOptions = { active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
export async function getTabUrl(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        console.log(url);
        // use `url` here inside the callback because it's asynchronous!
        return url;
    });
}
export const getName = (link) => {
    if (!link) {
        return '';
    }
    let a = link.slice(8);
    a.includes("www") ? a = a.slice(4) : a;
    a = a.substring(0, a.indexOf("/"));
    return a;
}
export const getHostName = (url) => {
    let newURL = new URL(url);
    if (newURL.startsWith("chrome://")) {
        return url;
    }
    let hostname = new URL(url).hostname;
    if (hostname.startsWith("https://www.")) {
      hostname = hostname.slice(12);
    }
    return hostname;
  }
  export const extractNameFromURL = (url) => {
    const urlRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i;
    const match = urlRegex.exec(url);
    return match ? match[1] : "";
  }
  
  

export const getHomeURL = (url) => {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.protocol + '//' + parser.hostname;
}
export const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
        (minutes+1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds
      );
}

/* USE THIS TO CLEAR STORAGE */
export const clearStorage = () => {
    chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
    // do something more
    });
    chrome.storage.sync.clear(); // callback is optional
}
  
