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
    let a = link.slice(8);
    //condition ? if true do this : if false do this;
    a.includes("www") ? a = a.slice(4) : a;
    a = a.substring(0, a.indexOf("/"));
    return a;
}
