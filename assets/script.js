// --------------------------------------------------------
// 1. SYSTEM CLOCK ENGINE
// --------------------------------------------------------
function updateClock() {
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
  }
}
setInterval(updateClock, 1000);
updateClock();

// --------------------------------------------------------
// 2. SYSTEM TERMINAL LOG
// --------------------------------------------------------
function logToTerminal(message) {
  const stream = document.getElementById('terminal-stream');
  if (!stream) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const logRow = document.createElement('div');
  logRow.className = 'terminal-row';
  logRow.innerText = `[${timestamp}] ${message}`;
  
  stream.appendChild(logRow);
  stream.scrollTop = stream.scrollHeight; 
}

// --------------------------------------------------------
// 3. STYLED ANIMATING THEME CORE SWITCHER ENGINE
// --------------------------------------------------------
const menuBtn = document.getElementById('theme-menu-btn');
const menuPanel = document.getElementById('theme-menu-panel');
const activeThemeDisplay = document.getElementById('active-theme-display');
const themeItemsContainer = document.getElementById('theme-items-container');

const themesList = [
  { key: 'cyber-dark', label: 'Cyber Dark' },
  { key: 'space-grey', label: 'Space Grey' },
  { key: 'bubblegum-pop', label: 'Bubblegum Pop' },
  { key: 'deep-sea', label: 'Deep Sea' },
  { key: 'retro-arcade', label: 'Retro Arcade' },
  { key: 'titanium-tide', label: 'Titanium Tide' },
  { key: 'neo-classic', label: 'Neo Classic' },
  { key: 'matrix-glitch', label: 'Matrix Glitch' },
  { key: 'toxic-sunset', label: 'Toxic Sunset' },
  { key: 'classic-sunset', label: 'Classic Sunset' },
  { key: 'more-than-important', label: 'More Important' },
  { key: 'graphite', label: 'Graphite' }
];

if (menuBtn) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.body.classList.toggle('expanded');
  });
}

document.addEventListener('click', () => {
  document.body.classList.remove('expanded');
});

function buildThemeMenu() {
  if (!themeItemsContainer) return;
  themeItemsContainer.innerHTML = '';
  themesList.forEach(theme => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerText = theme.label;
    row.addEventListener('click', () => setTheme(theme.key, theme.label));
    themeItemsContainer.appendChild(row);
  });
}

function setTheme(themeKey, themeLabel) {
  // Safety check to ensure overrides object is initialized before clearing it
  if (typeof overrides !== 'undefined') {
    Object.values(overrides).forEach(item => {
      document.documentElement.style.removeProperty(item.var);
    });
  }
  
  document.documentElement.setAttribute('data-theme', themeKey);
  localStorage.setItem('dev_os_theme', themeKey);
  if (activeThemeDisplay) {
    activeThemeDisplay.innerText = themeLabel;
  }
  logToTerminal(`Theme transitioned to: ${themeLabel}`);
}

// --------------------------------------------------------
// 4. POMODORO TIMER ENGINE
// --------------------------------------------------------
let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('btn-start');
const resetBtn = document.getElementById('btn-reset');

function updateTimerUI() {
  if (!timerDisplay) return;
  let m = minutes < 10 ? '0' + minutes : minutes;
  let s = seconds < 10 ? '0' + seconds : seconds;
  timerDisplay.innerText = `${m}:${s}`;
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timer);
      startBtn.innerText = "Start";
      startBtn.classList.remove('active-pause');
      startBtn.classList.add('orange');
      logToTerminal("Focus Engine paused.");
    } else {
      startBtn.innerText = "Pause";
      startBtn.classList.remove('orange');
      startBtn.classList.add('active-pause');
      logToTerminal("Focus Engine activated.");
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            alert("Focus segment completed! Take a step away from the terminal.");
            logToTerminal("Focus block finalized successfully.");
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        updateTimerUI();
      }, 1000);
    }
    isRunning = !isRunning;
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    if (startBtn) {
      startBtn.innerText = "Start";
      startBtn.className = "neo-btn orange";
    }
    updateTimerUI();
    logToTerminal("Focus Engine reset to zero.");
  });
}

// --------------------------------------------------------
// 5. PERSISTENT QUEST LOGIC
// --------------------------------------------------------
const questInput = document.getElementById('new-quest');
const questContainer = document.getElementById('quest-container');
const addQuestBtn = document.getElementById('btn-add-quest');

let savedQuests = JSON.parse(localStorage.getItem('dev_os_quests')) || [
  { id: 1, text: "Refactor legacy portfolio stylesheets", completed: false, tag: "Core" }
];

function saveQuestsToStorage() {
  localStorage.setItem('dev_os_quests', JSON.stringify(savedQuests));
}

function renderQuests() {
  if (!questContainer) return;
  questContainer.innerHTML = '';
  savedQuests.forEach(quest => {
    const li = document.createElement('li');
    li.className = `quest-item ${quest.completed ? 'completed' : ''}`;
    const badgeClass = quest.tag === 'Core' ? 'badge-yellow' : 'badge-teal';
    
    li.innerHTML = `
      <div>
        <span class="badge ${badgeClass}">${quest.tag}</span>
        <span class="quest-text">${quest.text}</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="neo-btn action-btn status-btn">${quest.completed ? 'Undo' : 'Done'}</button>
        <button class="neo-btn action-btn delete-btn" style="background-color: var(--clr-crimson); color: #ffffff; border: 2px solid #000;">X</button>
      </div>
    `;

    li.querySelector('.status-btn').addEventListener('click', () => {
      quest.completed = !quest.completed;
      saveQuestsToStorage();
      renderQuests();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      savedQuests = savedQuests.filter(q => q.id !== quest.id);
      saveQuestsToStorage();
      renderQuests();
      logToTerminal("Micro-quest deleted from log.");
    });

    questContainer.appendChild(li);
  });
}

if (addQuestBtn) {
  addQuestBtn.addEventListener('click', () => {
    if (!questInput) return;
    const text = questInput.value.trim();
    if (!text) return;
    
    savedQuests.push({ id: Date.now(), text: text, completed: false, tag: "Task" });
    saveQuestsToStorage();
    renderQuests();
    questInput.value = '';
    logToTerminal(`New Quest Added: ${text}`);
  });
}

if (questInput) {
  questInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && addQuestBtn) {
      addQuestBtn.click();
    }
  });
}

// --------------------------------------------------------
// 6. DEADLINE TRACKER ENGINE
// --------------------------------------------------------
const deadlineInput = document.getElementById('deadline-setter');
const setDeadlineBtn = document.getElementById('btn-set-deadline');
const countdownDisplay = document.getElementById('countdown-display');
let countdownInterval;

function updateCountdown(targetTime) {
  const now = new Date().getTime();
  const difference = targetTime - now;

  if (difference <= 0) {
    clearInterval(countdownInterval);
    if (countdownDisplay) countdownDisplay.innerText = "00d : 00h : 00m : 00s // DEADLINE PASSED";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const d = days < 10 ? '0' + days : days;
  const h = hours < 10 ? '0' + hours : hours;
  const m = minutes < 10 ? '0' + minutes : minutes;
  const s = seconds < 10 ? '0' + seconds : seconds;

  if (countdownDisplay) {
    countdownDisplay.innerText = `${d}d : ${h}h : ${m}m : ${s}s`;
  }
}

if (setDeadlineBtn && deadlineInput) {
  setDeadlineBtn.addEventListener('click', () => {
    const targetValue = deadlineInput.value;
    if (!targetValue) return;

    const targetTime = new Date(targetValue).getTime();
    localStorage.setItem('dev_os_deadline', targetTime);

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => updateCountdown(targetTime), 1000);
    updateCountdown(targetTime);
    logToTerminal(`System Deadline Configured: ${targetValue}`);
  });
}

const savedDeadline = localStorage.getItem('dev_os_deadline');
if (savedDeadline) {
  const targetTime = parseInt(savedDeadline, 10);
  if (deadlineInput) {
    const dateObj = new Date(targetTime);
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
    deadlineInput.value = dateObj.toISOString().slice(0, 16);
  }
  countdownInterval = setInterval(() => updateCountdown(targetTime), 1000);
  updateCountdown(targetTime);
}

// --------------------------------------------------------
// 7. DATA METRICS GRAPH ENGINE
// --------------------------------------------------------
function renderLanguageMetrics() {
  const chartContainer = document.getElementById('languages-chart-v1');
  if (!chartContainer) return;

  const languageData = [
    { name: 'JavaScript', percent: 45, colorVar: 'var(--clr-teal)' },
    { name: 'HTML5', percent: 25, colorVar: 'var(--clr-purple)' },
    { name: 'CSS3', percent: 20, colorVar: 'var(--clr-yellow)' },
    { name: 'Python', percent: 10, colorVar: 'var(--clr-crimson)' }
  ];

  chartContainer.innerHTML = '';

  languageData.forEach(item => {
    const row = document.createElement('div');
    row.className = 'chart-metric-row';
    row.innerHTML = `
      <div class="metric-label-group">
        <span class="metric-name">${item.name}</span>
        <span class="metric-percentage">${item.percent}%</span>
      </div>
      <div class="metric-bar-track">
        <div class="metric-bar-fill" style="width: ${item.percent}%; background-color: ${item.colorVar};"></div>
      </div>
    `;
    chartContainer.appendChild(row);
  });
}

// --------------------------------------------------------
// 8. PERSISTENT MOOD TRACKER ENGINE
// --------------------------------------------------------
const moodStatusText = document.getElementById('mood-status-text');
const moodButtons = document.querySelectorAll('.mood-btn');

function initMoodTracker() {
  if (moodButtons.length === 0) return;

  const savedMood = localStorage.getItem('dev_os_mood');
  if (savedMood && moodStatusText) {
    moodStatusText.innerText = `SYSTEM_VIBE: ${savedMood.toUpperCase()}`;
    highlightActiveMoodButton(savedMood);
  }

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedMood = btn.getAttribute('data-mood');
      localStorage.setItem('dev_os_mood', selectedMood);
      if (moodStatusText) {
        moodStatusText.innerText = `SYSTEM_VIBE: ${selectedMood.toUpperCase()}`;
      }
      highlightActiveMoodButton(selectedMood);
      logToTerminal(`Core Vibe updated to: ${selectedMood.toUpperCase()}`);
    });
  });
}

function highlightActiveMoodButton(moodKey) {
  moodButtons.forEach(btn => {
    if (btn.getAttribute('data-mood') === moodKey) {
      btn.style.backgroundColor = "var(--clr-purple)";
      btn.style.transform = "translate(2px, 2px)";
      btn.style.boxShadow = "none";
    } else {
      btn.style.backgroundColor = "";
      btn.style.transform = "";
      btn.style.boxShadow = "";
    }
  });
}

// --------------------------------------------------------
// 9. PALETTE OVERRIDER 
// --------------------------------------------------------
const overrides = {
  purple: { picker: document.getElementById('picker-purple'), var: '--clr-purple' },
  teal: { picker: document.getElementById('picker-teal'), var: '--clr-teal' },
  cardBg: { picker: document.getElementById('picker-card-bg'), var: '--clr-card-bg' },
  inputBg: { picker: document.getElementById('picker-input-bg'), var: '--clr-input-bg' },
  bg: { picker: document.getElementById('picker-bg'), var: '--clr-body-bg' }
};

Object.values(overrides).forEach(item => {
  item.picker?.addEventListener('input', (e) => {
    document.documentElement.style.setProperty(item.var, e.target.value);
  });
});

document.getElementById('btn-save-custom')?.addEventListener('click', () => {
  const customPalette = {};
  Object.entries(overrides).forEach(([key, item]) => {
    if (item.picker) customPalette[key] = item.picker.value;
  });
  
  localStorage.setItem('dev_os_custom_palette', JSON.stringify(customPalette));
  localStorage.setItem('dev_os_theme', 'custom'); 
  
  if (activeThemeDisplay) activeThemeDisplay.innerText = "Custom Look";
  logToTerminal("Custom theme configuration cached to storage.");
});

document.getElementById('btn-reset-custom')?.addEventListener('click', () => {
  localStorage.removeItem('dev_os_custom_palette');
  Object.values(overrides).forEach(item => {
    document.documentElement.style.removeProperty(item.var);
  });
  
  setTheme('cyber-dark', 'Cyber Dark');
  logToTerminal("Palette overrides purged. Restored system base theme.");
});

function loadCustomPaletteOnBoot() {
  const savedPalette = JSON.parse(localStorage.getItem('dev_os_custom_palette'));
  const savedTheme = localStorage.getItem('dev_os_theme');
  
  if (savedPalette && savedTheme === 'custom') {
    Object.entries(savedPalette).forEach(([key, value]) => {
      if (overrides[key]) {
        document.documentElement.style.setProperty(overrides[key].var, value);
        if (overrides[key].picker) overrides[key].picker.value = value;
      }
    });
    if (activeThemeDisplay) activeThemeDisplay.innerText = "Custom Look";
  }
}

// --------------------------------------------------------
// 10. README COMPILER ENGINE (Powered by Marked.js)
// --------------------------------------------------------
const vaultInput = document.getElementById('vault-input');
const saveVaultBtn = document.getElementById('btn-save-vault');
const copyVaultBtn = document.getElementById('btn-copy-vault');
const previewContainer = document.getElementById('readme-preview');

function handleVaultRender() {
  if (!vaultInput || !previewContainer) return;
  const rawContent = vaultInput.value;
  localStorage.setItem('dev_os_vault_text', rawContent);
      
  if (!rawContent.trim()) {
    previewContainer.innerHTML = '<p style="opacity: 0.5; font-style: italic;">Your compiled markdown preview will render out raw structure lines here in real-time...</p>';
    return;
  }

  // Parses raw text to HTML safely via the external CDN library
  previewContainer.innerHTML = marked.parse(rawContent);
}

vaultInput?.addEventListener('input', handleVaultRender);

saveVaultBtn?.addEventListener('click', () => {
  if (!vaultInput) return;
  localStorage.setItem('dev_os_vault_text', vaultInput.value);
  
  const originalText = saveVaultBtn.innerText;
  saveVaultBtn.innerText = "CACHED SUCCESSFULLY!";
  saveVaultBtn.style.backgroundColor = "var(--clr-teal)";
  saveVaultBtn.style.color = "#000000";
  
  logToTerminal("Markdown compiler buffer saved to localStorage cache.");
  
  setTimeout(() => {
    saveVaultBtn.innerText = originalText;
    saveVaultBtn.style.backgroundColor = "";
    saveVaultBtn.style.color = "";
  }, 1500);
});

copyVaultBtn?.addEventListener('click', () => {
  if (!vaultInput) return;
  
  navigator.clipboard.writeText(vaultInput.value).then(() => {
    const originalText = copyVaultBtn.innerText;
    copyVaultBtn.innerText = "COPIED TO CLIPBOARD!";
    copyVaultBtn.style.backgroundColor = "var(--clr-yellow)";
    copyVaultBtn.style.color = "#000000";
    
    logToTerminal("System clipboard sync complete: Markdown raw string copied.");
    
    setTimeout(() => {
      copyVaultBtn.innerText = originalText;
      copyVaultBtn.style.backgroundColor = "";
      copyVaultBtn.style.color = "";
    }, 1500);
  }).catch(err => {
    console.error('Could not copy system buffer text: ', err);
  });
});

const templates = {
  install: "## 🚀 Getting Started\n\n### Prerequisites\n- Node.js (v18+)\n\n### Installation\n```bash\nnpm install\nnpm run dev\n```",
  features: "## ✨ Key Features\n\n- ⚡ **Feature One:** Short descriptive text here.\n- 🔒 **Feature Two:** Privacy-first architecture design.\n- 🎨 **Feature Three:** Customizable UI component configurations.",
  license: "## 📝 License\n\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details."
};

function injectTemplate(text, btnElement) {
  if (!vaultInput) return;
  const currentContent = vaultInput.value;
  
  // 1. Prevent duplicate injections by checking if the text already exists
  if (currentContent.includes(text.trim())) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "ALREADY ADDED";
    btnElement.style.backgroundColor = "var(--clr-crimson)";
    btnElement.style.color = "#fff";
    
    if (typeof logToTerminal === "function") {
      logToTerminal("Injection rejected: Template already exists in buffer.");
    }
    
    setTimeout(() => {
      btnElement.innerText = originalText;
      btnElement.style.backgroundColor = "";
      btnElement.style.color = "";
    }, 1500);
    return;
  }

  // 2. Append text if it is not a duplicate
  vaultInput.value = currentContent ? `${currentContent}\n\n${text}` : text;
  handleVaultRender();
  
  // 3. Tactile Success Feedback
  const originalText = btnElement.innerText;
  btnElement.innerText = "INJECTED!";
  btnElement.style.backgroundColor = "var(--clr-teal)";
  btnElement.style.color = "#000";
  
  if (typeof logToTerminal === "function") {
    logToTerminal("Markdown snippet appended to Buffer Vault.");
  }
  
  setTimeout(() => {
    btnElement.innerText = originalText;
    btnElement.style.backgroundColor = "";
    btnElement.style.color = "";
  }, 1500);
}

// Pass the event target (the button itself) into the function so it can change colors!
document.getElementById('pre-badges')?.addEventListener('click', (e) => injectTemplate(templates.badges, e.target));
document.getElementById('pre-install')?.addEventListener('click', (e) => injectTemplate(templates.install, e.target));
document.getElementById('pre-tech')?.addEventListener('click', (e) => injectTemplate(templates.tech, e.target));
document.getElementById('pre-usage')?.addEventListener('click', (e) => injectTemplate(templates.usage, e.target));
document.getElementById('pre-features')?.addEventListener('click', (e) => injectTemplate(templates.features, e.target));
document.getElementById('pre-contrib')?.addEventListener('click', (e) => injectTemplate(templates.contrib, e.target));
document.getElementById('pre-license')?.addEventListener('click', (e) => injectTemplate(templates.license, e.target));

// Restore vault text on boot
if (vaultInput) {
  vaultInput.value = localStorage.getItem('dev_os_vault_text') || '';
  handleVaultRender();
}

// --------------------------------------------------------
// 11. CENTRAL BOOT QUEUE
// --------------------------------------------------------
const cachedThemeKey = localStorage.getItem('dev_os_theme') || 'cyber-dark';
const activeMatch = themesList.find(t => t.key === cachedThemeKey) || themesList[0];
setTheme(activeMatch.key, activeMatch.label);
buildThemeMenu();

renderQuests();
renderLanguageMetrics();
initMoodTracker();
loadCustomPaletteOnBoot();