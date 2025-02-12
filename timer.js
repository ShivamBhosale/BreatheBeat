let timer;
let timerValue = 0;
let audio;

function promptSetTimer() {
  const userInput = prompt("Enter timer duration in minutes:");
  const parsedInput = parseFloat(userInput);

  if (!isNaN(parsedInput) && parsedInput > 0) {
    setTimer(parsedInput * 60); // Convert minutes to seconds
  } else {
    alert("Please enter a valid positive number for the timer.");
  }
}

function setTimer(minutes) {
  timerValue = minutes;
  updateTimerDisplay();
}

const audio2 = document.getElementById("timerAudio");

function startStopwatch() {
  if (timerValue > 0 && !timer) {
    timer = setInterval(() => {
      timerValue--;
      if (timerValue <= 0) {
        stopStopwatch();
      }
      updateTimerDisplay();
    }, 1000);
    audio2.play();
  }
}

function stopStopwatch() {
  clearInterval(timer);
  timer = null;
  updateTimerDisplay();
  playAudio(); // Call the function to play audio
  audio2.pause();
}

function playAudio() {
  audio = document.getElementById("timerAudio2");
  audio.play();

  // Add click event listener to stop audio on click anywhere on the screen
  document.body.addEventListener("click", stopAudioOnClick);
}

function stopAudioOnClick() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0; // Reset audio to the beginning
    document.body.removeEventListener("click", stopAudioOnClick); // Remove the click event listener
  }
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("stopwatch");
  const hours = Math.floor(timerValue / 3600);
  const minutes = Math.floor((timerValue % 3600) / 60);
  const seconds = timerValue % 60;
  timerDisplay.textContent = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX - 10 + "px";
  cursor.style.top = e.clientY - 10 + "px";
});

document.addEventListener("mousedown", () => {
  cursor.classList.add("clicking");
});

document.addEventListener("mouseup", () => {
  cursor.classList.remove("clicking");
});

const clickSound = new Audio("sounds/click.mp3"); // You'll need to add the actual audio file
clickSound.volume = 0.2; // Adjust volume to be subtle (20% volume)

// Add click sound to document
document.addEventListener("mousedown", () => {
  cursor.classList.add("clicking");
  clickSound.currentTime = 0; // Reset sound to start
  clickSound.play();
});

document.addEventListener("mouseup", () => {
  cursor.classList.remove("clicking");
});
