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

// Format time helper
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

// Handle loading errors
audio.addEventListener("error", (e) => {
  console.error("Audio loading error:", e);
  currentTimeEl.textContent = "Error";
  totalTimeEl.textContent = "Error";
});

// Time update
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
      pauseIcon.style.display = "block";
      playBtn.setAttribute("aria-label", "Pause");
    } else {
      audio.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      playBtn.setAttribute("aria-label", "Play");
    }
  } catch (error) {
    console.error("Playback error:", error);
    // Reset to play state on error
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
    playBtn.setAttribute("aria-label", "Play");
  }
});

// Handle audio ended
audio.addEventListener("ended", () => {
  playIcon.style.display = "block";
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

// Keyboard support for progress bar
progressBar.addEventListener("keydown", (e) => {
  if (!audio.duration) return;

  const step = audio.duration * 0.05; // 5% steps
  let newTime = audio.currentTime;

  switch (e.key) {
    case "ArrowLeft":
      newTime = Math.max(0, audio.currentTime - step);
      break;
    case "ArrowRight":
      newTime = Math.min(audio.duration, audio.currentTime + step);
      break;
    case "Home":
      newTime = 0;
      break;
    case "End":
      newTime = audio.duration;
      break;
    default:
      return; // Don't prevent default for other keys
  }

  e.preventDefault();
  audio.currentTime = newTime;
});

// Volume control
volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value / 100;
  audio.volume = volume;
  updateVolumeIcon(volume);
});

// Mute functionality
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  updateVolumeIcon(audio.muted ? 0 : audio.volume);
  muteBtn.setAttribute("aria-pressed", audio.muted.toString());
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

// Theme functionality
const applyTheme = (mode) => {
  if (mode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
    themeToggle.setAttribute("aria-pressed", "true");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
    themeToggle.setAttribute("aria-pressed", "false");
    localStorage.setItem("theme", "light");
  }
};

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  applyTheme(isDark ? "light" : "dark");
});

// Initialize theme from localStorage or system preference
const initTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    applyTheme(saved);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
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
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
