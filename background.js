chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background.js:", message, "from tab:", sender.tab ? sender.tab.id : "unknown");

  // IMPORTANT: Set this flag to true if you are going to call sendResponse asynchronously.
  let willSendResponseAsync = false; 

  //Only triggers through CONTENT.js
  if (message.type === "SELECTED_TEXT") {
    //Storing the Price of the DETECTED item into local storage
    chrome.storage.local.set({ lastSelectedText: message.data })
      .then(() => {
        console.log("SELECTED_TEXT stored successfully:", message.data);
      })
      .catch(error => {
        console.error("Error storing SELECTED_TEXT:", error);
      });
  } 
  //Only triggers through HELLO.js when user 
  else if (message.type === "REQUEST") {
    willSendResponseAsync = true; 
    //Retrieving price of the ITEM on amazon through the local storage
    chrome.storage.local.get('lastSelectedText')
      .then(value => {
        //Storing the value as selectedText variable
        const selectedText = value.lastSelectedText;

        //Passing the value back to hello.js (RESPONSE)
        if (selectedText !== undefined) {
          console.log("Sending response from background:", { data: selectedText });
          sendResponse({ data: selectedText });
        } else {
          console.log("Sending null data response from background (text undefined):", { data: null });
          sendResponse({ data: null, error: "No selected text found in storage." });
        }
      })
      .catch(error => {
        console.error("Error retrieving lastSelectedText from storage:", error);
        sendResponse({ data: null, error: "Failed to retrieve data from storage: " + error.message });
      });
  }

  //Must always return value back otherwise waste of memory and won't work
  return willSendResponseAsync;
});