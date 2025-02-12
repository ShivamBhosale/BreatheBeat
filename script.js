let timer;
let seconds = 0;
let minutes = 0;
let hours = 0;

// Get the audio element
const audio = document.getElementById("timerAudio");

function updateStopwatch() {
  seconds++;
  if (seconds === 60) {
    seconds = 0;
    minutes++;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.getElementById("stopwatch").innerText = formattedTime;
}

function startStopwatch() {
  timer = setInterval(function () {
    updateStopwatch();
    // Start the glow animation only when the timer is ON
    document.body.classList.add("glow-animation");

    // Play the audio only when the timer is ON
    audio.play();
  }, 1000);
}

function stopStopwatch() {
  clearInterval(timer);

  // Stop the glow animation when the timer is OFF
  document.body.classList.remove("glow-animation");

  // Pause the audio when the timer is OFF
  audio.pause();
}

function resetStopwatch() {
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  hours = 0;
  document.getElementById("stopwatch").innerText = "00:00:00";

  // Stop the glow animation when the timer is OFF
  document.body.classList.remove("glow-animation");

  // Pause and reset the audio when the timer is OFF
  audio.pause();
  audio.currentTime = 0;
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
