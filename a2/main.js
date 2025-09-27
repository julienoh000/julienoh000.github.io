const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const themeToggle = document.getElementById("themeToggle");

// Time format
const fmt = (t) => {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

// Initialize audio
audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = fmt(audio.duration);
});

// Loading errors
audio.addEventListener("error", (e) => {
  console.error("Audio loading error:", e);
  currentTimeEl.textContent = "Error";
  totalTimeEl.textContent = "Error";
});

// Update time
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + "%";
    currentTimeEl.textContent = fmt(audio.currentTime);
    progressBar.setAttribute("aria-valuenow", Math.round(pct));
  }
});

// Play/Pause toggle with error handling
playBtn.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      await audio.play();
      playIcon.style.display = "none";
      pauseIcon.style.display = "inline";
      playBtn.setAttribute("aria-label", "Pause");
    } else {
      audio.pause();
      playIcon.style.display = "inline";
      pauseIcon.style.display = "none";
      playBtn.setAttribute("aria-label", "Play");
    }
  } catch (error) {
    console.error("Playback error:", error);
    // Reset to play state on error
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";
    playBtn.setAttribute("aria-label", "Play");
  }
});

// Audio ended
audio.addEventListener("ended", () => {
  playIcon.style.display = "inline";
  pauseIcon.style.display = "none";
  playBtn.setAttribute("aria-label", "Play");
});

// Seek functionality with validation
progressBar.addEventListener("click", (e) => {
  if (audio.duration) {
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  }
});

// Control Volume
volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value / 100;
  audio.volume = volume;
  updateVolumeIcon(volume);
  volumeSlider.style.setProperty("--volume-percent", volumeSlider.value + "%");
});
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  updateVolumeIcon(audio.muted ? 0 : audio.volume);
});

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
  if (audio.muted || volume === 0) {
    muteBtn.textContent = "🔇";
  } else if (volume < 0.5) {
    muteBtn.textContent = "🔉";
  } else {
    muteBtn.textContent = "🔊";
  }
}

// Apply theme
const applyTheme = (mode) => {
  if (mode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "🔆";
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "🌃";
    themeToggle.setAttribute("aria-pressed", "false");
  }
};

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  applyTheme(isDark ? "light" : "dark");
});

// Initialize theme from localStorage or system preference
const initTheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
};

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateVolumeIcon(audio.volume);
});

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    applyTheme(e.matches ? "dark" : "light");
  });
