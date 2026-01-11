let cost = ""
const statsDiv = document.getElementById('stats');
const savedDisplay = document.getElementById('totalSaved');
const spentDisplay = document.getElementById('totalSpent');
const receivedDataDiv = document.getElementById('receivedData');


//Ensuring that the website as fully loaded
document.addEventListener('DOMContentLoaded', async () => {

  chrome.storage.local.get(['totalSaved', 'totalSpent'], (result) => {
        savedDisplay.textContent = `$${(result.totalSaved || 0).toFixed(2)}`;
        spentDisplay.textContent = `$${(result.totalSpent || 0).toFixed(2)}`;
        statsDiv.style.display = "block";
  });
  
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

// Inside calculate() function
function calculate() {
    let hourlyRate = document.getElementById("hourly").value;
    let numericCost = parseFloat(cost);

    if (isNaN(numericCost) || isNaN(hourlyRate) || hourlyRate <= 0) {
        receivedDataDiv.textContent = "Please enter a valid rate.";
        return;
    }

    // Calculation for the amount of hours
    let totalMinutes = Math.round((numericCost / hourlyRate) * 60);
    let fixedHours = Math.floor(totalMinutes / 60);
    let fixedMinutes = totalMinutes % 60;

    // Display the Time Cost
    receivedDataDiv.innerHTML = `
      <div style="text-align:center">
        <div class="label">This item costs</div>
        <div class="value" style="font-size:1.4rem">$${numericCost.toFixed(2)}</div>
        <div class="label" style="margin-top:10px">Work time required:</div>
        <div class="value" style="color:#6366f1">${fixedHours}h ${fixedMinutes}m</div>
      </div>
    `;

    // Show the "Did you buy it?" buttons
    const actionContainer = document.getElementById('action-container');
    actionContainer.classList.remove('hidden');
    
    // Set up button listeners
    document.getElementById('buy-btn').onclick = () => handleDecision('spent', numericCost);
    document.getElementById('save-btn').onclick = () => handleDecision('saved', numericCost);
}

async function handleDecision(type, amount) {
    const key = type === 'saved' ? 'totalSaved' : 'totalSpent';
    
    // Get existing totals from storage
    const data = await chrome.storage.local.get(['totalSaved', 'totalSpent']);
    const currentTotal = data[key] || 0;
    
    // Update storage
    await chrome.storage.local.set({ [key]: currentTotal + amount });

    // Hide decision buttons and show results
    document.getElementById('action-container').classList.add('hidden');
    updateStatsDisplay();
    document.getElementById('results-area').classList.remove('hidden');
}

function updateStatsDisplay() {
    chrome.storage.local.get(['totalSaved', 'totalSpent'], (data) => {
        const saved = data.totalSaved || 0;
        const spent = data.totalSpent || 0;
        
        document.getElementById('total-saved').textContent = `$${saved.toFixed(2)}`;
        document.getElementById('total-spent').textContent = `$${spent.toFixed(2)}`;
        
        // Compound growth calculation
        const growth = saved * 1.0415;
        document.getElementById('saving-amount').textContent = `$${growth.toFixed(2)}`;
    });
}

// Call this on load to show existing totals
updateStatsDisplay();