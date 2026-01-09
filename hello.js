let cost = ""
const receivedDataDiv = document.getElementById('receivedData');


//Ensuring that the website as fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  
  //If the div exists then execute following
  if (!receivedDataDiv) return;
  //Updating the div in hello.html (POPUP)
  receivedDataDiv.textContent = "Requesting data from background...";


  try {
    //Send request to BACKGROUND.js (requesting for price of item from local storage)
    const response = await chrome.runtime.sendMessage({ type: "REQUEST" });
  
    // Check if response and data exist   
    if (response && response.data !== undefined) { 
      //Updating the display div to display the price of the item detected
      receivedDataDiv.textContent = `Detected price of Item: "${response.data}"`;
      //Proceed to remove the $ from the string 
      cost = response.data
      cost = cost.replace("$", "")
      
    } else {
      //Worst comes to worst will display this error mesage to the user.
      receivedDataDiv.textContent = `Error: Data not received or is undefined. Response: ${JSON.stringify(response)}`;
    }
  } catch (error) {
    console.error("Error sending message or receiving response:", error);
    receivedDataDiv.textContent = `Error: ${error.message}`;
  }
});


//Declaring and adding event listening for calculate button on the popup (hello.html)
let button = document.getElementById("submit")
button.addEventListener("click", function() {
    //Will run function calculate()
    calculate()
})

//Calculates the amount of hours required to work considering the price of the item and the user's hourly rate
function calculate() {
    let hourlyRate = document.getElementById("hourly")  
    
    //Converting the string to a float value
    cost = parseFloat(cost)

    //Calculation for the amount of hours
    let hours = (cost / hourlyRate.value).toFixed(2)
    let minutes = Math.round(hours * 60)


    let fixedHours = Math.floor(minutes / 60)
    let fixedMinutes = minutes - (fixedHours * 60)
    console.log(fixedHours)
    console.log(fixedMinutes)



    //Clearing the popup's body before interacting with the DOM
    receivedDataDiv.innerHTML = ""

    //Creating div along with labels and values for the user's inputted HOURLY rate 
    let hourlyRateDiv = document.createElement("div")
    let hourlyRateLabel = document.createElement("h1")
    hourlyRateLabel.innerHTML = "Your Hourly Rate:"
    let hourleyRateDisplay = document.createElement("h2")
    hourleyRateDisplay.innerHTML = "$"+hourlyRate.value
    hourlyRateDiv.appendChild(hourlyRateLabel)
    hourlyRateDiv.appendChild(hourleyRateDisplay)

    //Creating div along with labels and values for the price of the item the user is viewing
    let costDiv = document.createElement("div")
    let costLabel = document.createElement("h1")
    costLabel.innerHTML = "Cost of Item"
    let costDisplay = document.createElement("h2")
    costDisplay.innerHTML = "$"+cost
    costDiv.appendChild(costLabel)
    costDiv.appendChild(costDisplay)

    //Creating div along with labels and values for the amount of hours the user will have to work in order to be able to purchase the item
    let hoursDiv = document.createElement("div")
    let hoursLabel = document.createElement("h1")


    hoursLabel.innerHTML = "Amount of Time to work:"
    let hoursDisplay = document.createElement("h1")
    hoursDisplay.innerHTML = `${fixedHours} Hours and ${fixedMinutes} Minutes`
    hoursDiv.appendChild(hoursLabel)
    hoursDiv.appendChild(hoursDisplay)

    //Appending all information to the body div in hello.html (POPUP)
    receivedDataDiv.appendChild(hourlyRateDiv)
    receivedDataDiv.appendChild(costDiv)
    receivedDataDiv.appendChild(hoursDiv)
    
    // receivedDataDiv.textContent = `In order to purchase this item at the cost of `+ cost +` and your hourly rate of `+ hourlyRate.value + ` you will have to work: ` + hours + ` amount of hours`;

}