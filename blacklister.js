import {getName, formatTime} from "./utils.js";

export function loadOldBlacklistedSitesFromStorage(){
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
}

// adds a new blacklisted site to the list of blacklisted sites
export async function addNewBlacklistedSite(url) { 

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

// adds the old blacklisted site to the list of blacklisted sites so that it can be displayed
export function addOldBlacklistedSite (url) {
    
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

//update the status of the tab blocker
export function statusUpdate () {
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
}

// Call this when the pop-up is shown to update the time displayed
export function updateTimer () {
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
}

//this listens for when the timer is finished
export function listenForTimerEnd () {
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
}

//Starts a countdown timer based on the provided time value, 
//updating the UI and performing actions when the countdown reaches zero.
function startTimer(time) {
    if (time && location.href.split("/").slice(-1)[0] == "blacklistPage.html") {
        var countdownNumberEl = document.getElementById('countdown-number');
        var countdownNumberValue = document.getElementById('countdown-number').innerHTML;
        console.log(countdownNumberEl);
        var countdown = time;

        //set animation position
        let timerCircle = document.getElementById("timerCircle");
        let timeSelected = (document.getElementById("selectedTime") != null ? (document.getElementById("selectedTime").value * 60) : 90);
        chrome.storage.local.get(["timerLength"], (result) => {
            console.log(result.timerLength);
            let timerLength = (result.timerLength != null ? result.timerLength : [90]);
            try {
                timerCircle.style.animation = "countdown " + timerLength + "s linear infinite forwards";
                timerCircle.style.setProperty("animation-delay", "-" + (timerLength - time) + "s");
                console.log(timerCircle.style.animationDelay);
                console.log("timeselected: ", timerLength + "time: ", time, "sub: ", timerLength - time);
                console.log("timerCircle animation is changed to reflect new values after opening again", timerCircle);
            } catch (error) {
                console.log("error: " + error);
            }
        });
        
        
        

        countdownNumberEl ? countdownNumberEl.innerHTML = formatTime(countdown) : console.log("countdownNumberEl: ", countdownNumberEl);
        var countDownInterval = setInterval(function() {
            if (countdown > 0) {
                countdown--;
                //console.log(countdown);
            }else{
                console.log("countdown is 0");
                document.getElementById("focusModeStart").disabled = false;
                document.getElementById("selectedTime").disabled = false;
                document.getElementById("focusModeStart").style.filter = "saturate(100%)";
                document.getElementById("focusModeStart").style.transform = "none";
                document.getElementById("timerCircle").style.animation = "none";
                clearInterval(countDownInterval);
                chrome.storage.local.set({"onoff": "off"}, function(){
                    console.log("tab blocker is now off line 115");
                });
            }
    
            countdownNumberEl.textContent = formatTime(countdown);

        }, 1000);
    }
}

//calls startTimer(time) after changing timer length in chrome storage
//sometimes the time in storage is already right so startTimer can be called directly
//Initiates the timer by sending a message to the background script, storing the time value, 
//and starting the countdown using startTimer(time).
export function startTime(time) {
    chrome.runtime.sendMessage({ cmd: 'START_TIMER', length: time });
    chrome.storage.local.set({"timerLength": time}, function(){
        console.log("timer length in chrome storage is now " + time);
    });
    startTimer(time);
}
    
export function formdata() {
    //this is called when the user clicks on the add button and it adds the site to the blacklist
    // use `url` here inside the callback because it's asynchronous!
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        addNewBlacklistedSite(url);
    });
}

//just moved everything from popup.js to here
export function timerLogic(){
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
                //set tab blocker on
                //set a timer to turn off tab blocker after timer is over
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
                }, (timeSelected * 1000));//convert to milliseconds
            }
        });
    }
}