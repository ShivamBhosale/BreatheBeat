let timer;
let seconds = 0;
let minutes = 0;
let hours = 0;
let breathingTimer;

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

  startBreathingGuide();
}

function startBreathingGuide() {
  const breathingGuide = document.getElementById("breathingGuide");
  const breathingText = document.getElementById("breathingText");
  const breathingParticles = document.getElementById("breathingParticles");

  breathingGuide.classList.add("active");

  let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold
  const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
  const durations = [4000, 1000, 4000, 1000]; // in milliseconds

  // Create breathing particles
  function createParticles() {
    breathingParticles.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random position around the circle
      const angle = (i / 12) * 2 * Math.PI;
      const radius = 50;
      const x = Math.cos(angle) * radius + 50;
      const y = Math.sin(angle) * radius + 50;

      particle.style.left = x + "%";
      particle.style.top = y + "%";
      particle.style.animationDelay = i * 0.1 + "s";

      breathingParticles.appendChild(particle);
    }
  }

  createParticles();

  function cycleBreathing() {
    breathingText.textContent = phases[phase];
    breathingGuide.className = `breathing-guide active phase-${phase}`;

    // Add subtle text animation based on phase
    if (phase === 0) {
      // Inhale
      breathingText.style.transform = "scale(1.1)";
      breathingText.style.color = "rgba(100, 255, 100, 0.9)";
    } else if (phase === 2) {
      // Exhale
      breathingText.style.transform = "scale(0.9)";
      breathingText.style.color = "rgba(100, 150, 255, 0.9)";
    } else {
      // Hold
      breathingText.style.transform = "scale(1)";
      breathingText.style.color = "rgba(255, 255, 255, 0.9)";
    }

    setTimeout(() => {
      phase = (phase + 1) % 4;
      cycleBreathing();
    }, durations[phase]);
  }

  cycleBreathing();
}

function stopStopwatch() {
  clearInterval(timer);

  // Stop the glow animation when the timer is OFF
  document.body.classList.remove("glow-animation");

  // Pause the audio when the timer is OFF
  audio.pause();

  // Stop breathing guide
  const breathingVisualization = document.getElementById(
    "breathingVisualization"
  );
  breathingVisualization.classList.remove("active");
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

  // Stop breathing guide
  const breathingVisualization = document.getElementById(
    "breathingVisualization"
  );
  breathingVisualization.classList.remove("active");
}

function adjustVolume(value) {
  const volume = value / 100;
  audio.volume = volume;
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
