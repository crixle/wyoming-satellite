let militaryTime = 0; // 0 for 12-hour format, 1 for 24-hour format

function displayTime() {
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

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

function newUserRequest(request){
    UserRequestBox = document.getElementById("userRequestTextBox");
    UserRequestBox.style.display = "block";
    UserRequestBox.style.padding = "5px 10px";
    UserRequestBox.innerHTML = request;
    return "Success"
}

function postAssistantResponse(request){
    UserRequestBox = document.getElementById("userRequestTextBox");
    assistantResponse = document.getElementById("assistantResponse");
    assistantResponse.style.display = "block";
    assistantResponse.style.padding = "5px 10px";
    assistantResponse.innerHTML = request;
    setTimeout(() => {
      UserRequestBox.style.display = "none";
      assistantResponse.style.display = "none";
  }, 30000);
    return "Successfully posted assistant response."
}

function satelliteListeningStart(){
  satelliteIcon = document.getElementById("satelliteStatus");
  satelliteIcon.style.background = "lime";
  return "Satellite listening."
}
