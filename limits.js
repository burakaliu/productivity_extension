import {getName, getFaviconUrl} from "./utils.js";

//domcontentloaded
document.addEventListener("DOMContentLoaded", function () {
    displayLimits();
});

document.getElementById("printStorage").onclick = function() {
    chrome.storage.local.get(null, function(items) {
        console.log('Chrome Storage Contents: ', items);
    });
}


document.getElementById("limitsAdder").onclick = function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        console.log("from limits.js - current url: ", url);
        addLimitToStorage(getName(url), 6000, url);
    });
    window.location.reload();
}

document.getElementById("limitsRemover").onclick = function() {
    clearAllLimits();
}


function createNewLimit(url, time){
    console.log(url);
    const newLimit = {
        name: url,
        time: time,
        url: url,
        imageURL: getFaviconUrl(url),
        active: true
    };
    console.log("new limit: ", newLimit);
    return newLimit;
}

export function addLimitToStorage(name, time, url) {
    const newLimit = createNewLimit(name, time, url);
    chrome.storage.sync.get(['limits'], function(result) {
        console.log("result: ", result);
        const limits = result.limits || [];

        // Check for duplicate limits based on the url property
        const isDuplicate = limits.some(limit => limit.url === newLimit.url);

        if (!isDuplicate) {
            limits.push(newLimit);
            chrome.storage.sync.set({ limits: limits }, function() {
                console.log("added new limit to storage");
            });
        } else {
            console.log("Duplicate limit exists. Skipping addition.");
        }
    });
}


export function removeLimitFromStorage(name, time, url){
    const newLimit = createNewLimit(name, time, url);
    chrome.storage.sync.get(['limits'], function(result) {
        console.log("result: ", result);
        if(result.limits){
            result.limits = result.limits.filter(limit => limit.name != name);
            chrome.storage.sync.set({limits: result.limits}, function() {
                console.log("removed limit from storage");
            });
        }
    });
}

export function getLimitsFromStorage(){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['limits'], function(result) {
            console.log("result: ", result);
            if(result.limits){
                resolve(result.limits);
            }else{
                resolve([]);
            }
        });
    });
}

export function getLimitFromStorage(name){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['limits'], function(result) {
            console.log("result: ", result);
            if(result.limits){
                const limit = result.limits.find(limit => limit.name == name);
                resolve(limit);
            }else{
                resolve(null);
            }
        });
    });
}

export function updateLimitInStorage(name, time, url){
    const newLimit = createNewLimit(name, time, url);
    chrome.storage.sync.get(['limits'], function(result) {
        console.log("result: ", result);
        if(result.limits){
            result.limits = result.limits.filter(limit => limit.name != name);
            result.limits.push(newLimit);
            chrome.storage.sync.set({limits: result.limits}, function() {
                console.log("updated limit in storage");
            });
        }
    });
}

export function displayLimits(){
    getLimitsFromStorage().then(limits => {
        //console.log("limits: ", limits);
        if(limits.length > 0){
            for (const limit of limits){
                //console.log("limit: ", limit);
                const limitElement = document.createElement("div");
                const limitTime = document.createElement("div");
                const deleteIMG = document.createElement("img");
                const editIMG = document.createElement("img");

                limitElement.className = "limit";
                //<img src="${limit.imageURL}" class="limit-icon">
                //<div class="limit-time">${limit.time}</div>
                limitElement.innerHTML = `<div class="limit-name">${limit.name}</div>`;
                
                limitTime.className = "limit-time";
                limitTime.innerHTML = limit.time;
                
                deleteIMG.src = "/assets/delete.png";
                deleteIMG.className = "delete-limit";
                deleteIMG.onclick = function(){
                    removeLimitFromStorage(limit.name, limit.time, limit.url);
                    window.location.reload();
                }
        
                editIMG.src = "/assets/edit.png";
                editIMG.className = "edit-limit";
                editIMG.onclick = function(){
                    const newTime = prompt("Enter new time limit in seconds: ");
                    updateLimitInStorage(limit.name, newTime, limit.url);
                    window.location.reload();
                }
                document.getElementById("limits").appendChild(limitElement);
                limitElement.appendChild(limitTime);
                limitElement.appendChild(deleteIMG);
                limitElement.appendChild(editIMG);
                
            }
        }else{
            document.getElementById("limits").innerHTML = "No limits set";
        }
    });
}

//clear all limits from storage
export function clearAllLimits(){
    chrome.storage.sync.set({limits: []}, function() {
        console.log("cleared all limits");
    });
}




