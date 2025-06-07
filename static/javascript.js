let militaryTime = 0; // 0 for 12-hour format, 1 for 24-hour format

async function displayTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Always show two digits for minutes

    let timeString;

    if (militaryTime === 1) {
        // Use 24-hour format
        timeString = `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else {
        // Use 12-hour format
        let displayHours = hours % 12;
        displayHours = displayHours ? displayHours : 12; // Handle midnight and noon
        timeString = `${displayHours}:${minutes}`;
    }

    document.getElementById("time").innerHTML = timeString;
}

// Call displayTime every second
setInterval(displayTime, 1000);


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearScreen() {
  satelliteIcon = document.getElementById("satelliteStatus");
  userRequestBox = document.getElementById("userRequestTextBox");
  assistantResponse = document.getElementById("assistantResponse");
  assistantResponse.style.display = "none";
  userRequestBox.style.display = "none";
  satelliteIcon.style.background = "white";
}

async function processEvent(request){
  satelliteIcon = document.getElementById("satelliteStatus");
  userRequestBox = document.getElementById("userRequestTextBox");
  assistantResponse = document.getElementById("assistantResponse");

  switch(request.event){
    case "detection":
      clearScreen()
      satelliteIcon.style.background = "lime";
      return "Success"
    case "transcript":
      userRequestBox.innerHTML = request.data;
      userRequestBox.style.display = "block";
      userRequestBox.style.padding = "5px 10px";
      return "Success"
    case "synthesize":
      assistantResponse.innerHTML = request.data;
      assistantResponse.style.display = "block";
      assistantResponse.style.padding = "5px 10px";
      return "Success"
    case "error":
      satelliteIcon.style.background = "red";
      await sleep(3000);
      satelliteIcon.style.background = "white";
      return "Success"
    case "response_finished":
      await sleep(3000);
      clearScreen();
      return "Success"
  }
}
