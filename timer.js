let timer;
let timerValue = 0;
let initialTimerValue = 0;
let audio;
let isPaused = false;
let breathingTimer;
let breathingPhase = 0;

function promptSetTimer() {
  const userInput = prompt("Enter timer duration in minutes:");
  const parsedInput = parseFloat(userInput);

  if (!isNaN(parsedInput) && parsedInput > 0) {
    setTimer(parsedInput * 60); // Convert minutes to seconds
  } else {
    alert("Please enter a valid positive number for the timer.");
  }
}

function setTimer(seconds) {
  timerValue = seconds;
  initialTimerValue = seconds;
  updateTimerDisplay();
  updateProgressRing();
}

const audio2 = document.getElementById("timerAudio");

function startStopwatch() {
  if (timerValue > 0 && !timer) {
    isPaused = false;
    timer = setInterval(() => {
      timerValue--;
      if (timerValue <= 0) {
        stopStopwatch();
        return;
      }
      updateTimerDisplay();
      updateProgressRing();
    }, 1000);
    audio2.play();
    document.body.classList.add("timer-active");
    startTimerBreathing();
  }
}

function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    isPaused = true;
    audio2.pause();
    document.body.classList.remove("timer-active");
    stopTimerBreathing();
  }
}

function stopStopwatch() {
  clearInterval(timer);
  timer = null;
  isPaused = false;

  if (timerValue <= 0) {
    // Timer completed
    playAudio();
    showCompletionMessage();
  }

  // Reset timer
  timerValue = initialTimerValue;
  updateTimerDisplay();
  updateProgressRing();
  audio2.pause();
  document.body.classList.remove("timer-active");
  stopTimerBreathing();
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

function updateProgressRing() {
  const circle = document.getElementById("progress-circle");
  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  if (initialTimerValue > 0) {
    const progress = (initialTimerValue - timerValue) / initialTimerValue;
    const offset = circumference - progress * circumference;
    circle.style.strokeDashoffset = offset;
  }
}

function adjustVolume(value) {
  const volume = value / 100;
  audio2.volume = volume;
  if (audio) audio.volume = volume;
}

function showCompletionMessage() {
  const message = document.createElement("div");
  message.className = "completion-message";
  message.innerHTML =
    '<i class="fa fa-check-circle"></i><br>Session Complete!<br>Well done!';
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

function startTimerBreathing() {
  const progressRing = document.getElementById("progressRing");
  const breathingInstruction = document.getElementById("breathingInstruction");
  const breathingParticles = document.getElementById("breathingParticlesTimer");

  // Create particles for timer
  createTimerParticles();

  breathingPhase = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold
  const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
  const phaseClasses = ["inhale", "hold", "exhale", "hold"];
  const durations = [4000, 1000, 4000, 1000];

  function cycleTimerBreathing() {
    breathingInstruction.textContent = phases[breathingPhase];
    progressRing.className = `progress-ring ${phaseClasses[breathingPhase]}`;

    breathingTimer = setTimeout(() => {
      breathingPhase = (breathingPhase + 1) % 4;
      cycleTimerBreathing();
    }, durations[breathingPhase]);
  }

  cycleTimerBreathing();
}

function stopTimerBreathing() {
  if (breathingTimer) {
    clearTimeout(breathingTimer);
    breathingTimer = null;
  }

  const progressRing = document.getElementById("progressRing");
  const breathingInstruction = document.getElementById("breathingInstruction");

  progressRing.className = "progress-ring";
  breathingInstruction.textContent = "Ready";
}

function createTimerParticles() {
  const breathingParticles = document.getElementById("breathingParticlesTimer");
  breathingParticles.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.className = "timer-particle";

    // Position particles around the progress ring
    const angle = (i / 8) * 2 * Math.PI;
    const radius = 140;
    const x = Math.cos(angle) * radius + 150;
    const y = Math.sin(angle) * radius + 150;

    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.animationDelay = i * 0.2 + "s";
    particle.style.animation = "timerParticleFloat 3s ease-in-out infinite";

    breathingParticles.appendChild(particle);
  }
}

// End of timer logic
