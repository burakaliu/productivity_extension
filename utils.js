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
    return (match ? match[1] : "").toString();
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

export const parseMillisecondsIntoReadableTime = (milliseconds) => {
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
  
    return h + ' hours, ' + m + 'minutes, ' + s + " seconds";
  }
  
  export const parseSecondsIntoReadableTime = (seconds) => {
    // Get hours from seconds
    var hours = seconds / 3600;
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    // Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    // Get remainder from minutes and convert to seconds
    var remainingSeconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(remainingSeconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
    return h + ' hrs ' + m + ' min ' + s + ' sec';
  }
  

  // Function to get today's date string in the format of YYYY-MM-DD
export const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

export const formatTime = (seconds) => {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
  
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
  
    if (remainingSeconds < 10) {
      remainingSeconds = "0" + remainingSeconds;
    }
  
    return minutes + ":" + remainingSeconds;
}
  
  
