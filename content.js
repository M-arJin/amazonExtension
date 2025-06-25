const imgs = document.getElementsByClassName("a-offscreen")

console.log(imgs[0].innerHTML)
let information = imgs[0].innerHTML


chrome.runtime.sendMessage({
    type:"SELECTED_TEXT",
    data: information
})

console.log("Message sent from content.js:", information);