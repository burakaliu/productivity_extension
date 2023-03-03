//script for popup.html page

import { getCurrentTab, getName, getTabUrl, getHomeURL, getHostName, extractNameFromURL, parseMillisecondsIntoReadableTime} from "./utils.js";
//import Chart from 'chart.js/auto';
let blacklist = []; 
//"https://monkeytype.com/", "https://www.youtube.com/"

/* make sure that the current state of the slider is consistent with the value in storage*/
chrome.storage.local.get(["onoff"], (result) => {
    console.log(result.onoff);
    result.onoff == "on" ? document.getElementById("checkbox").checked = true : document.getElementById("checkbox").checked = false;
});

/* make sure the lsit of blacklisted sites is consistent with the ones in storage */ 
/* basically just loading the list of blocked sites */
//chrome.storage.local.set({list: ["https://monkeytype.com/", "https://www.youtube.com/"]}, function(){ });

chrome.storage.local.get(["list"], (result) => { 
    //console.log(result.list);
    if (result.list == null){
        //console.log("nothing in chrome data index 'list'");
    }else{
        for (let i = 0; i < result.list.length; i ++){
            addOldBlacklistedSite(result.list[i]);
            //console.log(result.list[i] + "is now on the popup ");
        }
    }
});
if (document.getElementById("checkbox") != null){
    /* change the on/off status of the blacklisting program in the chrome storage*/
    document.getElementById("checkbox").addEventListener("click", ()=>{
        //console.log("clicked on slider");
        if (document.getElementById("checkbox").checked) {
            chrome.storage.local.set({"onoff": "on"}, function(){
                //console.log("tab blocker is now on");
            });
        } else {
            chrome.storage.local.set({"onoff": "off"}, function(){
                //console.log("tab blocker is now off");
            });
        }
    });
}



async function addNewBlacklistedSite (url) {

    if (url.length > 1){

        /* making the actual html object */
        const newblsite = document.createElement("div");
        const deleteIMG = document.createElement("img");
        const urlName = getName(url);

        //controlsElement.className = "blsite-controls";

        newblsite.className = "blacklisted";
        newblsite.id = "blacklisted-" + urlName;
        newblsite.textContent = urlName;
        newblsite.setAttribute("url", url);

        deleteIMG.src = "assets/delete.png";
        deleteIMG.title = "delete";
        deleteIMG.className = "blsite-delete";
        deleteIMG.height = 20;
        deleteIMG.width = 20;
        deleteIMG.addEventListener("click", ()=> {
            //console.log("clicked the delete button");
            chrome.storage.local.remove(urlName, () => {
                //console.log("tab blocker is now off for " + urlName);
                //console.log("blacklisted-" + urlName);
                document.getElementById("blacklisted-" + urlName).remove();
                //console.log("removed blacklisted tab");
            });
            chrome.storage.local.get(["list"], (result) => {
                let newList = [];
                for (let i = 0; i < result.list.length; i ++){
                    if (result.list[i] != url){
                        newList.push(result.list[i]);
                    }else{
                        //console.log("removed " + url + " from list in chrome storage");
                    }
                }
                chrome.storage.local.set({list: newList}, function(){
                    //console.log( url + " is now removed from storage and the list is added back to storage");
                });
            });
        });

        newblsite.appendChild(deleteIMG);
        document.getElementById("blsites").appendChild(newblsite);

        chrome.storage.local.get(["list"], (result) => {
            let newList = [];
            if (result.list != null){
                for (let i = 0; i < result.list.length; i ++){
                    newList.push(result.list[i]);
                }
            }
            newList.push(url);
            chrome.storage.local.set({list: newList}, function(){
                //console.log( urlName + " is now added to storage");
            });
        });
        
    }  
}

function addOldBlacklistedSite (url) {
    
    if (url.length > 1){

        /* making the actual html object */
        const newblsite = document.createElement("div");
        const deleteIMG = document.createElement("img");
        const urlName = getName(url);

        newblsite.className = "blacklisted";
        newblsite.id = "blacklisted-" + urlName;
        newblsite.textContent = urlName;
        newblsite.setAttribute("url", url);

        deleteIMG.src = "assets/delete.png";
        deleteIMG.title = "delete";
        deleteIMG.className = "blsite-delete";
        deleteIMG.height = 20;
        deleteIMG.width = 20;
        deleteIMG.addEventListener("click", ()=> {
            //console.log("clicked the delete button");
            chrome.storage.local.remove(urlName, () => {
                //console.log("tab blocker is now off for " + urlName);
                //console.log("blacklisted-" + urlName);
                document.getElementById("blacklisted-" + urlName).remove();
                //console.log("removed blacklisted tab");
            });
            chrome.storage.local.get(["list"], (result) => {
                let newList = [];
                for (let i = 0; i < result.list.length; i ++){
                    if (result.list[i] != url){
                        newList.push(result.list[i]);
                    }else{
                        //console.log("removed " + url + " from list in chrome storage");
                    }
                }
                chrome.storage.local.set({list: newList}, function(){
                    //console.log( url + " is now removed from storage and the list is added back to storage");
                });
            });
        });
        
        newblsite.appendChild(deleteIMG);
        try{
            document.getElementById("blsites").appendChild(newblsite);
        }catch{
            console.log("error adding old blacklisted site");
        }
    }  
}

//new link submitted
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("submit") != null){
        document.getElementById("submit").onclick = formdata;
    }
    if (document.getElementById("blsiteadder") != null){
        document.getElementById("blsiteadder").onclick = formdata;
    }

    
    // index.js
    console.log("this is running");
    // get the tabs table from the HTML file
    const tabsTable = document.getElementById("tabs");

    // get all of the tab records from storage
    chrome.storage.local.get(null, function(result) {
        console.log(result);
        // sort the tab records by time spent
        const sortedTabRecords = Object.values(result).sort(function(a, b) {
            return (b.timeSpent || 0) - (a.timeSpent || 0);
        });
    
        // create a row in the table for each tab
        for (const tabRecord of sortedTabRecords) {
            try {
                const row = document.createElement("tr");
    
                const urlCell = document.createElement("td");
                //console.log(tabRecord.url);
                urlCell.textContent = new URL(tabRecord.url).origin;
                row.appendChild(urlCell);
                /*
                const titleCell = document.createElement("td");
                titleCell.textContent = tabRecord.title;
                row.appendChild(titleCell);
                */
                const timeSpentCell = document.createElement("td");
                timeSpentCell.textContent = parseMillisecondsIntoReadableTime(tabRecord.timeSpent);
                row.appendChild(timeSpentCell);
            
                tabsTable.appendChild(row);
            } catch (error) {
                console.log("error with tab: " + tabRecord.url + " " + error);
            }
        }

        /* create the pie chart */
        // get the total time spent on all tabs
        const chartData = Object.values(result)
            .filter(item => item.timeSpent > 60000)
            .map(item => ({
                label: extractNameFromURL(item.url),
                data: item.timeSpent,
                readableTime: parseMillisecondsIntoReadableTime(item.timeSpent),
                backgroundColor: randomColor(),
            }));

        const totalTimeSpent = chartData.reduce((sum, item) => sum + item.data, 0);

        // create the pie chart
        const ctx = document.getElementById("pieChart").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: chartData.map(item => `${item.label} (${parseMillisecondsIntoReadableTime(item.data)})`),
                datasets: [
                    {
                        data: chartData.map(item => item.data),
                        backgroundColor: chartData.map(item => item.backgroundColor),
                    },
                ],
            },
            options: {
                title: {
                    display: false,
                    text: `Total Time Spent: ${parseMillisecondsIntoReadableTime(totalTimeSpent)}`,
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgb(255, 99, 132)'
                        }
                    }
                }
            },
        });
    });
      function randomColor() {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`;
      }
    
});

function formdata() {
    
    // use `url` here inside the callback because it's asynchronous!
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        console.log(url);
        addNewBlacklistedSite(url);
        document.getElementById("blacklistInput").value = "";
        // use `url` here inside the callback because it's asynchronous!
        
    });
    /*
    console.log(getTabUrl());
    addNewBlacklistedSite(getTabUrl());
    document.getElementById("blacklistInput").value = "";
    */
    //var siteURL = document.getElementById("blacklistInput").value;
    //console.log(document.getElementById("blacklistInput").value);
    
}













/*

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setAttributes("play", onPlay, controlsElement);
    setAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    }else{
        bookmarksElement.innerHTML = '<i class="row"> No bookmarks to show.</i>';
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getCurrentTab();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    })
};

const onDelete = async e => {
    const activeTab = await getCurrentTab();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime);

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    }, viewBookmarks);
};

const setAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];   

            viewBookmarks(currentVideoBookmarks)
        })
    }else {
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title"> This is not a youtube video page. </div>';
    }
});
*/
