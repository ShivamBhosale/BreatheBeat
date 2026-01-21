let timer;
let seconds = 0;
let minutes = 0;
let hours = 0;
let startTime; // Track when the session started
let breathingTimeout; // Store the timeout ID to clear it later
let currentTechnique = 'relax'; // Default technique

// Breathing configurations (in ms)
const breathingTechniques = {
    'relax': { // 4-7-8
        phases: ["Inhale", "Hold", "Exhale", "Hold"],
        durations: [4000, 7000, 8000, 0] // 4-7-8 usually has no hold after exhale, but we keep structure
    },
    'box': { // 4-4-4-4
        phases: ["Inhale", "Hold", "Exhale", "Hold"],
        durations: [4000, 4000, 4000, 4000]
    },
    'focus': { // 4-2-4
        phases: ["Inhale", "Hold", "Exhale", "Hold"],
        durations: [4000, 2000, 4000, 0]
    }
};

// Get the audio element
const audio = document.getElementById("timerAudio");
const soundCueAudio = document.getElementById("soundCueAudio");

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
    // Prevent multiple intervals
    if (timer) clearInterval(timer);
    
    startTime = Date.now(); // Record start time for accurate tracking
    
    timer = setInterval(function () {
        updateStopwatch();
        document.body.classList.add("glow-animation");
        audio.play().catch(e => console.log("Audio play failed interaction required"));
    }, 1000);

    startBreathingGuide();
}

function changeTechnique() {
    const selector = document.getElementById('breathingTechnique');
    currentTechnique = selector.value;
    
    // If running, restart the guide to apply changes immediately
    const breathingGuide = document.getElementById("breathingGuide");
    if (breathingGuide.classList.contains('active')) {
        clearTimeout(breathingTimeout);
        startBreathingGuide();
    }
}

function startBreathingGuide() {
    const breathingGuide = document.getElementById("breathingGuide");
    const breathingText = document.getElementById("breathingText");
    const breathingParticles = document.getElementById("breathingParticles");
    
    breathingGuide.classList.add("active");
    
    let phase = 0;
    // Get current config
    const config = breathingTechniques[currentTechnique];
    // Filter out 0 duration phases (e.g. for 4-7-8 or 4-2-4 if we want no hold)
    // Actually simpler to just run the cycle and skip 0ms phases logic inside or just accept 0ms delay
    
    // Re-create particles
    breathingParticles.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        // Random position around the circle
        const angle = (i / 12) * 2 * Math.PI;
        const radius = 50; // percentage
        const x = Math.cos(angle) * radius + 50;
        const y = Math.sin(angle) * radius + 50;
        
        particle.style.left = x + "%";
        particle.style.top = y + "%";
        particle.style.animationDelay = i * 0.1 + "s";
        breathingParticles.appendChild(particle);
    }

    function cycleBreathing() {
        const currentDurations = breathingTechniques[currentTechnique].durations;
        const currentPhases = breathingTechniques[currentTechnique].phases;

        // Skip phases with 0 duration
        if (currentDurations[phase] <= 0) {
            phase = (phase + 1) % 4;
            cycleBreathing(); // Recursively call next phase immediately
            return;
        }

        breathingText.textContent = currentPhases[phase];
        
        // Voice & Sound Logic
        const voiceEnabled = document.getElementById('voiceToggle').checked;
        const soundEnabled = document.getElementById('soundCueToggle').checked;
        
        if (voiceEnabled) {
            speakText(currentPhases[phase]);
        }
        if (soundEnabled) {
            soundCueAudio.currentTime = 0;
            soundCueAudio.play().catch(() => {});
        }
        
        // Remove old phase classes
        breathingGuide.classList.remove('phase-0', 'phase-1', 'phase-2', 'phase-3');
        breathingGuide.classList.add(`phase-${phase}`);
        
        // Text styling per phase
        if (phase === 0) { // Inhale
            breathingText.style.opacity = "1";
            breathingText.style.letterSpacing = "2px";
        } else if (phase === 2) { // Exhale
            breathingText.style.opacity = "0.8";
            breathingText.style.letterSpacing = "1px";
        } else { // Hold
            breathingText.style.opacity = "0.9";
            breathingText.style.letterSpacing = "1px";
        }

        // Schedule next phase
        breathingTimeout = setTimeout(() => {
            phase = (phase + 1) % 4;
            cycleBreathing();
        }, currentDurations[phase]);
    }

    cycleBreathing();
}

function stopStopwatch() {
    clearInterval(timer);
    timer = null;

    document.body.classList.remove("glow-animation");
    audio.pause();

    // Log the session stats
    if (startTime) {
        const endTime = Date.now();
        const durationMinutes = (endTime - startTime) / 60000;
        logSession(durationMinutes);
        startTime = null; // Reset
    }

    // Stop and Reset Breathing Guide
    const breathingGuide = document.getElementById("breathingGuide");
    breathingGuide.classList.remove("active");
    clearTimeout(breathingTimeout); // Important: Stop the loop!
    
    document.getElementById("breathingText").innerText = "Ready";
}

function resetStopwatch() {
    stopStopwatch(); // Re-use stop logic
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById("stopwatch").innerText = "00:00:00";
    audio.currentTime = 0;
}

function adjustVolume(value) {
    const volume = value / 100;
    audio.volume = volume;
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop previous
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85; 
        utterance.pitch = 1; 
        utterance.volume = 0.6;
        window.speechSynthesis.speak(utterance);
    }
}
