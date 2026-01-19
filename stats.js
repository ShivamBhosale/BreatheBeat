
const STATS_KEY = 'breathebeat-stats';

const initialStats = {
    totalMinutes: 0,
    streak: 0,
    lastSessionDate: null,
    sessions: 0 // Total number of sessions completed
};

function getStats() {
    const stats = localStorage.getItem(STATS_KEY);
    return stats ? JSON.parse(stats) : initialStats;
}

function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    updateStatsDisplay();
}

function updateStreak(stats) {
    const today = new Date().toDateString();
    
    if (stats.lastSessionDate === today) {
        return; // Already meditated today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (stats.lastSessionDate === yesterday.toDateString()) {
        stats.streak += 1;
    } else {
        stats.streak = 1; // Reset streak or start new
    }
    
    stats.lastSessionDate = today;
}

function logSession(minutes) {
    if (minutes <= 0) return;

    const stats = getStats();
    
    stats.totalMinutes = Math.floor(stats.totalMinutes + minutes);
    stats.sessions += 1;
    
    updateStreak(stats);
    saveStats(stats);
}

function updateStatsDisplay() {
    const stats = getStats();
    const streakElement = document.getElementById('streakDisplay');
    const minutesElement = document.getElementById('minutesDisplay');

    if (streakElement) streakElement.innerText = `🔥 ${stats.streak} Day Streak`;
    if (minutesElement) minutesElement.innerText = `🧘 ${stats.totalMinutes} Mindful Mins`;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', updateStatsDisplay);
