export async function getCurrentTab(){
    let queryOptions = { active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
export const getName = (link) => {
    let a = link.slice(8);
    //condition ? if true do this : if false do this;
    a.includes("www") ? a = a.slice(4) : a;
    a = a.substring(0, a.indexOf("/"));
    return a;
}
