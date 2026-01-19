
const themes = {
    midnight: "Midnight",
    ocean: "Ocean Calm",
    forest: "Forest Zen",
    sunset: "Sunset Bliss"
};

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('breathebeat-theme', theme);
    
    // Update selector if it exists specific execution context
    const selector = document.getElementById('themeSelect');
    if (selector) {
        selector.value = theme;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('breathebeat-theme') || 'midnight';
    setTheme(savedTheme);
    
    // Listen for changes if the selector exists immediately
    const selector = document.getElementById('themeSelect');
    if (selector) {
        selector.value = savedTheme;
        selector.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
    }
}

// Run immediately to prevent flash
const savedTheme = localStorage.getItem('breathebeat-theme') || 'midnight';
document.documentElement.setAttribute('data-theme', savedTheme);

// Init UI when DOM is ready
document.addEventListener('DOMContentLoaded', initTheme);
