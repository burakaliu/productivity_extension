

let blacklist = ["https://monkeytype.com/", "https://www.youtube.com/"]; 

const generateHTML = (pageName) => {
    return `
<div id="clouds">
    <div class="cloud x1"></div>
    <div class="cloud x1_5"></div>
    <div class="cloud x2"></div>
    <div class="cloud x3"></div>
    <div class="cloud x4"></div>
    <div class="cloud x5"></div>
</div>
<div class='c'>
    <div class='_404'>404</div>
    <hr>
    <div class='_1'>get back to work</div>
    <div class='_2'>studying > ${pageName}</div>
</div>
    `;
};
const generateSTYLING = () => {
    return `<style>@import url(https://fonts.googleapis.com/css?family=opensans:500);
body {
background: #33cc99;
color: #fff;
font-family: "Open Sans", sans-serif;
max-height: 700px;
overflow: hidden;
}
.c {
text-align: center;
display: block;
position: relative;
width: 80%;
margin: 200px auto;
}
._404 {
font-size: 220px;
position: relative;
display: inline-block;
z-index: 2;
height: 250px;
letter-spacing: 15px;
}
._1 {
text-align: center;
display: block;
position: relative;
letter-spacing: 12px;
font-size: 5em;
line-height: 90%;
margin: 10px;
}
._2 {
text-align: center;
display: block;
position: relative;
font-size: 30px;
}
.text {
font-size: 70px;
text-align: center;
position: relative;
display: inline-block;
margin: 19px 0px 0px 0px;
/* top: 256.301px; */
z-index: 3;
width: 100%;
line-height: 1.2em;
display: inline-block;
}


.right {
float: right;
width: 60%;
}

hr {
padding: 0;
border: none;
border-top: 5px solid #fff;
color: #fff;
text-align: center;
margin: 0px auto;
width: 420px;
height: 10px;
z-index: -10;
}

hr:after {
display: inline-block;
position: relative;
top: -0.75em;
font-size: 2em;
padding: 0 0.2em;
background: #33cc99;
}

.cloud {
width: 350px;
height: 120px;

background: #fff;
background: linear-gradient(top, #fff 100%);
background: -webkit-linear-gradient(top, #fff 100%);
background: -moz-linear-gradient(top, #fff 100%);
background: -ms-linear-gradient(top, #fff 100%);
background: -o-linear-gradient(top, #fff 100%);

border-radius: 100px;
-webkit-border-radius: 100px;
-moz-border-radius: 100px;

position: absolute;
margin: 120px auto 20px;
z-index: -1;
transition: ease 1s;
}

.cloud:after,
.cloud:before {
content: "";
position: absolute;
background: #fff;
z-index: -1;
}

.cloud:after {
width: 100px;
height: 100px;
top: -50px;
left: 50px;

border-radius: 100px;
-webkit-border-radius: 100px;
-moz-border-radius: 100px;
}

.cloud:before {
width: 180px;
height: 180px;
top: -90px;
right: 50px;

border-radius: 200px;
-webkit-border-radius: 200px;
-moz-border-radius: 200px;
}

.x1 {
top: -50px;
left: 100px;
-webkit-transform: scale(0.3);
-moz-transform: scale(0.3);
transform: scale(0.3);
opacity: 0.9;
-webkit-animation: moveclouds 15s linear infinite;
-moz-animation: moveclouds 15s linear infinite;
-o-animation: moveclouds 15s linear infinite;
}

.x1_5 {
top: -80px;
left: 250px;
-webkit-transform: scale(0.3);
-moz-transform: scale(0.3);
transform: scale(0.3);
-webkit-animation: moveclouds 17s linear infinite;
-moz-animation: moveclouds 17s linear infinite;
-o-animation: moveclouds 17s linear infinite;
}

.x2 {
left: 250px;
top: 30px;
-webkit-transform: scale(0.6);
-moz-transform: scale(0.6);
transform: scale(0.6);
opacity: 0.6;
-webkit-animation: moveclouds 25s linear infinite;
-moz-animation: moveclouds 25s linear infinite;
-o-animation: moveclouds 25s linear infinite;
}

.x3 {
left: 250px;
bottom: -70px;

-webkit-transform: scale(0.6);
-moz-transform: scale(0.6);
transform: scale(0.6);
opacity: 0.8;

-webkit-animation: moveclouds 25s linear infinite;
-moz-animation: moveclouds 25s linear infinite;
-o-animation: moveclouds 25s linear infinite;
}

.x4 {
left: 470px;
botttom: 20px;

-webkit-transform: scale(0.75);
-moz-transform: scale(0.75);
transform: scale(0.75);
opacity: 0.75;

-webkit-animation: moveclouds 18s linear infinite;
-moz-animation: moveclouds 18s linear infinite;
-o-animation: moveclouds 18s linear infinite;
}

.x5 {
left: 200px;
top: 300px;

-webkit-transform: scale(0.5);
-moz-transform: scale(0.5);
transform: scale(0.5);
opacity: 0.8;

-webkit-animation: moveclouds 20s linear infinite;
-moz-animation: moveclouds 20s linear infinite;
-o-animation: moveclouds 20s linear infinite;
}

@-webkit-keyframes moveclouds {
0% {
    margin-left: 1000px;
}
100% {
    margin-left: -1000px;
}
}
@-moz-keyframes moveclouds {
0% {
    margin-left: 1000px;
}
100% {
    margin-left: -1000px;
}
}
@-o-keyframes moveclouds {
0% {
    margin-left: 1000px;
}
100% {
    margin-left: -1000px;
}
}
</style>`;
};
const generateHTML2 = () => {
    return `<div class="stars-wrapper">
	<h1>get back to work</h1>
  <svg class="stars" width="100%" height="100%" preserveAspectRatio="none">
    <circle class="star"></circle>
    <!-- repeat the circle element 200 times with different properties -->
  </svg>
  <svg class="stars" width="100%" height="100%" preserveAspectRatio="none">
    <circle class="star"></circle>
    <!-- repeat the circle element 200 times with different properties -->
  </svg>
  <svg class="stars" width="100%" height="100%" preserveAspectRatio="none">
    <circle class="star"></circle>
    <!-- repeat the circle element 200 times with different properties -->
  </svg>
  <svg class="extras" width="100%" height="100%" preserveAspectRatio="none">
    <defs>
      <radialGradient id="comet-gradient" cx="0" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="rgba(255,255,255,.8)"></stop>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"></stop>
      </radialGradient>
    </defs>
    <g transform="rotate(-135)">
      <ellipse class="comet comet-a" fill="url(#comet-gradient)" cx="0" cy="0" rx="150" ry="2"></ellipse>
    </g>
    <g transform="rotate(20)">
      <ellipse class="comet comet-b" fill="url(#comet-gradient)" cx="100%" cy="0" rx="150" ry="2"></ellipse>
    </g>
    <g transform="rotate(300)">
      <ellipse class="comet comet-c" fill="url(#comet-gradient)" cx="40%" cy="100%" rx="150" ry="2"></ellipse>
    </g>
  </svg>
  }
`;
};
const generateSTYLING2 = () => {
    return `
    :root {
      --twinkle-duration: 4s;
    }
    
    .stars-wrapper {
      position: relative;
      pointer-events: none;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(#16161d, #1f1f3a, #3b2f4a);
      overflow: hidden;
    }
    
    .stars {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .star {
      fill: white;
      animation: twinkle var(--twinkle-duration) ease-in-out infinite;
    }
    
    @keyframes twinkle {
      25% {
        opacity: 0;
      }
    }
    
    .comet {
      transform-origin: center center;
      animation: comet 10s linear infinite;
    
      @keyframes comet {
        0%,
        40% {
          transform: translateX(0);
          opacity: 0;
        }
    
        50% {
          opacity: 1;
        }
    
        60%,
        100% {
          transform: translateX(-100vmax);
          opacity: 0;
        }
      }
    }
    
    .comet-b {
      animation-delay: -3.3s;
    }
    
    .comet-c {
      animation-delay: -5s;
    }
    
    /* Additional styling */
    
    body {
      margin: 0;
      padding: 0;
      font-family: "Montserrat ", sans-serif;
      color: white;
    }
    
    h1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      text-align: center;
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
    }
    
    p {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
    }
    `;
};

const getName = (link) => {
    let a = link.slice(8);
    //condition ? if true do this : if false do this;
    a.includes("www") ? a = a.slice(4) : a;
    a = a.substring(0, a.indexOf("/"));
    return a;
}

chrome.storage.local.get(["onoff"], (result) => {
    //console.log("result: " + result.onoff);
    chrome.storage.local.get(["list"], (r) => {
        // console.log("the thing on the list: " + r.list);
        // console.log("the window you are on: " + window.location.href);
        // console.log("the thing on the list using getName: " + getName(r.list[0]));
        for (let i = 0; i < r.list.length; i++){
            if (getName(window.location.href) == getName(r.list[i]) && result.onoff == "on"){
                //console.log("you are on " + r.list[i]);
                document.head.innerHTML = generateSTYLING();
                document.body.innerHTML = generateHTML(getName(r.list[i]));
            }
        }
    });
});

let data = new Promise((resolve, reject) => {
  chrome.storage.sync.get(['limits'], function(result) {
      //console.log("result: ", result);
      if(result.limits){
          resolve(result.limits);
      }else{
          resolve([]);
      }
  });
});
//why is every website being blocked
//console.log("data: ", data);
data.then(limits => {
  //console.log("limits: ", limits);
  if(limits.length > 0){
      for (const limit of limits){
          //console.log("limit: ", limit.name);
          //console.log("page: ", getName(window.location.href));
          if (limit.name == getName(window.location.href) && limit.active == false){
            //console.log("limit: ", limit.name, ": ", limit);
            document.head.innerHTML = generateSTYLING();
            document.body.innerHTML = generateHTML(limit.name);
          }
      }
  }else{
    //console.log("limitnot over yet: ", limit.name, ": ", limit);
    document.getElementById("limits").innerHTML = "No limits set";
  }
});
/*
//TERMPORARY CODE FOR BLOCKING ALL WEBSITES SELECTED IN THE LIST
chrome.storage.local.get(["list"], (r) => {
    console.log("the thing on the list: " + r.list);
    for (let i = 0; i < r.list.length; i++){
        if (getName(window.location.href) == getName(r.list[i])){
            document.body.innerHTML = generateHTML2();
            document.head.innerHTML = generateSTYLING2();
        }
    }
});
*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.greeting === "hello"){
            sendResponse({farewell: "goodbye"});
        }
    }
);

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8);
}