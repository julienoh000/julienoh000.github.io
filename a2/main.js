const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const themeToggle = document.getElementById('themeToggle');

const fmt = (t) => {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
};

// Init
audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = fmt(audio.duration);
});

// Time update
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = fmt(audio.currentTime);
    progressBar.setAttribute('aria-valuenow', Math.round(pct));
  }
});

// Play/Pause toggle
playBtn.addEventListener('click', async () => {
  if (audio.paused) {
    await audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playBtn.setAttribute('aria-label','Pause');
  } else {
    audio.pause();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playBtn.setAttribute('aria-label','Play');
  }
});

audio.addEventListener('ended', () => {
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  playBtn.setAttribute('aria-label','Play');
});

// Seek
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// Volume
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;
  muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
});

muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
});

// Theme toggle
const applyTheme = (mode) => {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme','dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme','dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme','light');
  }
};

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light':'dark');
});

// Load saved theme
const saved = localStorage.getItem('theme');
if (saved) applyTheme(saved);
