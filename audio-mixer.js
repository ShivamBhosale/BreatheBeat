
class AudioMixer {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.5; // Default master volume

        this.sources = {
            music: {
                element: document.getElementById('timerAudio'),
                node: null,
                gain: this.ctx.createGain(),
                active: false
            },
            white: { type: 'noise', color: 'white', node: null, gain: this.ctx.createGain(), active: false },
            pink: { type: 'noise', color: 'pink', node: null, gain: this.ctx.createGain(), active: false },
            brown: { type: 'noise', color: 'brown', node: null, gain: this.ctx.createGain(), active: false }
        };

        // Initialize volumes
        this.sources.music.gain.value = 0.5;
        this.sources.white.gain.value = 0;
        this.sources.pink.gain.value = 0;
        this.sources.brown.gain.value = 0;

        // Connect everything
        this.setupMusicNode();
        Object.values(this.sources).forEach(source => {
           source.gain.connect(this.masterGain);
        });
        
        this.isPlaying = false;
    }

    setupMusicNode() {
        if (!this.sources.music.element) return;
        // User interaction requirement workaround might be needed for AudioContext
        // We defer creation until play() is called if context is suspended
    }

    createNoiseBuffer(type) {
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // compensate for gain
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // compensate for gain
            }
        }
        return buffer;
    }

    startNoise(type) {
        const source = this.sources[type];
        if (source.node) return; // Already playing

        const buffer = this.createNoiseBuffer(source.color);
        source.node = this.ctx.createBufferSource();
        source.node.buffer = buffer;
        source.node.loop = true;
        source.node.connect(source.gain);
        source.node.start();
    }

    stopNoise(type) {
        const source = this.sources[type];
        if (source.node) {
            source.node.stop();
            source.node.disconnect();
            source.node = null;
        }
    }

    play() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        // Play Music
        if (this.sources.music.element) {
            // Check if we need to hook up the element to web audio (once)
            if (!this.sources.music.node) {
                 try {
                    this.sources.music.node = this.ctx.createMediaElementSource(this.sources.music.element);
                    this.sources.music.node.connect(this.sources.music.gain);
                 } catch(e) {
                     // Already connected or error
                     console.log("Media Source connection info:", e);
                 }
            }
            this.sources.music.element.play().catch(e => console.error(e));
        }

        // Start Noises
        ['white', 'pink', 'brown'].forEach(type => {
            if (this.sources[type].gain.gain.value > 0) {
                 this.startNoise(type);
            }
        });

        this.isPlaying = true;
    }

    pause() {
        // Pause Music
        if (this.sources.music.element) {
            this.sources.music.element.pause();
        }

        // Stop Noises (Save CPU)
        ['white', 'pink', 'brown'].forEach(type => {
            this.stopNoise(type);
        });

        this.isPlaying = false;
    }

    setVolume(type, value) {
        // Value 0 to 1
        const gainNode = this.sources[type].gain;
        // smooth transition
        gainNode.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);

        // Optimization: start/stop noise if volume goes from/to 0 while playing
        if (type !== 'music' && this.isPlaying) {
             if (value > 0 && !this.sources[type].node) {
                 this.startNoise(type);
             } else if (value <= 0.001 && this.sources[type].node) {
                 this.stopNoise(type);
             }
        }
    }
}

// Global instance
let audioMixer;
document.addEventListener('DOMContentLoaded', () => {
    try {
        audioMixer = new AudioMixer();
    } catch(e) {
        console.error("Web Audio API not supported", e);
    }
});

function toggleMixerPanel() {
    const panel = document.getElementById('mixerPanel');
    panel.classList.toggle('active');
}
