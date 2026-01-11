//Storing and logging the URL of the website the user has accessed
const url = window.location.href;
console.log("URL from content script:", url);

//Determining what website the user is on to decide on what argument to pass through the function
if (url.includes("https://www.amazon.com.au/")) {
    console.log("AMAZON!!!")
    getInfo("AMAZON")
} else if (url.includes("https://www.umart.com.au/")) {
    console.log("UMART!!!")
    getInfo("UMART")
} else if (url.includes("https://www.ebay.com.au/")) {
    console.log("EBAY!!!")
    getInfo("EBAY")
} else if (url.includes("https://www.facebook.com/")) {
    console.log("FACEBOOK")
    getInfo("FACEBOOK")
}

//Considering the STORE, it will retrieve the price tag from said store and pass it through to BACKGROUND.js where it will be stored locally
function getInfo(store) {
    //If statements to determine what website the user has accessed and how to grab the information (based on DOM elements)
    if (store === "UMART") {
        imgs = document.getElementsByClassName("goods-price ele-goods-price")
        information = imgs[0].innerHTML
    } else if (store === "AMAZON") {
        imgs = document.getElementsByClassName("a-offscreen")
        information = imgs[0].innerHTML
    } else if (store === "EBAY") {
        imgs = document.querySelector('.x-price-primary')
        price = imgs.querySelector('.ux-textspans');
        information = price.innerHTML
        information = information.split(' ')
        information = information[1]
    } else if (store === "FACEBOOK") {
        const elements = Array.from(document.querySelectorAll('span[dir="auto"]'));
        const priceElement = elements.find(el => el.textContent.includes('$'));

        information = priceElement.innerText
    }
    
    
    if (information.includes(",")) {
        information = information.replace(",", "")
    }

    //Storing the price of the item detected
    console.log(information)



    //Passing through to BACKGROUND.js
    chrome.runtime.sendMessage({
        type:"SELECTED_TEXT",
        data: information
    })
}

