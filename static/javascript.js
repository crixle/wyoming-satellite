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
  userRequestBox = document.getElementById("transcript");
  assistantResponse = document.getElementById("assistantResponse");
  topBar = document.getElementById("topBar");
  assistantResponse.style.display = "none";
  userRequestBox.style.display = "none";
  userRequestBox.innerHTML = "";
  satelliteIcon.style.background = "rgb(56, 56, 56)";
  topBar.style.transform = "translateY(-11vh)";
  satelliteIcon.style.animation = "none";
}

async function startTimer(secs, id) {
  var seconds = secs;
  var minutes = 0;
  var timerID = id;
  timerContainer = document.getElementById("bottomContent")
  timerContainer.innerHTML += '<div ' + 'id="' + timerID + '"class="timerCard">50</div>';
  timerValue = document.getElementById(timerID)
  while (seconds != 0) {
    seconds -= 1;
    if (seconds > 60) {
      minutes = Math.floor(seconds / 60);
      seconds -= (minutes * 60)
    }
    if (minutes > 0) {
      timerValue.innerHTML = minutes + "m " + seconds + "s";
    }else{
      timerValue.innerHTML = seconds;
    }
    await sleep(1000)
  }
}

async function processEvent(request){
  satelliteIcon = document.getElementById("satelliteStatus");
  userRequestBox = document.getElementById("transcript");
  topBar = document.getElementById("topBar")
  assistantResponse = document.getElementById("assistantResponse");

  switch(request.event){
    case "detection":
      clearScreen()
      topBar.style.transform = "translateY(0vh)";
      satelliteIcon.style.background = "rgba(0, 255, 16, 0.5)";
      satelliteIcon.style.animation = "1s linear pulse infinite";
      return "Success"
    case "transcript":
      userRequestBox.innerHTML = request.data;
      userRequestBox.style.display = "flex";
      userRequestBox.style.padding = "5px 10px";
      return "Success"
    case "synthesize":
      assistantResponse.innerHTML = request.data;
      assistantResponse.style.display = "flex";
      assistantResponse.style.padding = "5px 10px";
      return "Success"
    case "voice-stopped":
      satelliteIcon.style.background = "rgb(56, 56, 56)"
      satelliteIcon.style.animation = "none"
      return "Success"
    case "error":
      satelliteIcon.style.background = "red";
      await sleep(3000);
      satelliteIcon.style.background = "rgb(56, 56, 56)";
      clearScreen()
      return "Success"
    case "response_finished":
      await sleep(3000);
      clearScreen();
      return "Success"
    case "timer-started":
      startTimer(request.data, request.id);
      return "Success"
  }
}
