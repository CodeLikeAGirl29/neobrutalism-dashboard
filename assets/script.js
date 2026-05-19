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
// 2. STYLED ANIMATING THEME CORE SWITCHER ENGINE
// --------------------------------------------------------
const menuBtn = document.getElementById('theme-menu-btn');
const menuPanel = document.getElementById('theme-menu-panel');
const activeThemeDisplay = document.getElementById('active-theme-display');
const themeItemsContainer = document.getElementById('theme-items-container');

const themesList = [
  { key: 'cyber-dark', label: 'Cyber Dark' },
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
    
    row.addEventListener('click', () => {
      setTheme(theme.key, theme.label);
    });
    themeItemsContainer.appendChild(row);
  });
}

function setTheme(themeKey, themeLabel) {
  document.documentElement.setAttribute('data-theme', themeKey);
  localStorage.setItem('dev_os_theme', themeKey);
  if (activeThemeDisplay) {
    activeThemeDisplay.innerText = themeLabel;
  }
}

const cachedThemeKey = localStorage.getItem('dev_os_theme') || 'cyber-dark';
const activeMatch = themesList.find(t => t.key === cachedThemeKey) || themesList[0];
setTheme(activeMatch.key, activeMatch.label);
buildThemeMenu();

// --------------------------------------------------------
// 3. POMODORO TIMER ENGINE
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
    } else {
      startBtn.innerText = "Pause";
      startBtn.classList.remove('orange');
      startBtn.classList.add('active-pause');
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            alert("Focus segment completed! Take a step away from the terminal.");
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
  });
}

// --------------------------------------------------------
// 4. PERSISTENT QUEST LOGIC
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
    });

    questContainer.appendChild(li);
  });
}

if (addQuestBtn) {
  addQuestBtn.addEventListener('click', () => {
    if (!questInput) return;
    const text = questInput.value.trim();
    if (!text) return;
    
    const newQuestObj = {
      id: Date.now(),
      text: text,
      completed: false,
      tag: "Task"
    };
    
    savedQuests.push(newQuestObj);
    saveQuestsToStorage();
    renderQuests();
    questInput.value = '';
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
// 5. PERSISTENT SCRATCH VAULT BUFFER
// --------------------------------------------------------
const vaultInput = document.getElementById('vault-input');
const saveVaultBtn = document.getElementById('btn-save-vault');

if (vaultInput) {
  vaultInput.value = localStorage.getItem('dev_os_vault_text') || '';
}

if (saveVaultBtn && vaultInput) {
  saveVaultBtn.addEventListener('click', () => {
    localStorage.setItem('dev_os_vault_text', vaultInput.value);
    
    const originalText = saveVaultBtn.innerText;
    saveVaultBtn.innerText = "CACHED SUCCESSFULLY!";
    saveVaultBtn.style.backgroundColor = "var(--clr-teal)";
    saveVaultBtn.style.color = "#000000";
    
    setTimeout(() => {
      saveVaultBtn.innerText = originalText;
      saveVaultBtn.style.backgroundColor = "var(--clr-purple)";
      saveVaultBtn.style.color = "";
    }, 1500);
  });
}

// --------------------------------------------------------
// 6. THEMED DATA METRICS GRAPH ENGINE
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
// 7. RESTORED: PERSISTENT MOOD TRACKER ENGINE
// --------------------------------------------------------
const moodStatusText = document.getElementById('mood-status-text');
const moodButtons = document.querySelectorAll('.mood-btn');

function initMoodTracker() {
  if (moodButtons.length === 0) return; // Safety check if card is absent

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
// SINGLE CENTRAL RUNTIME INITIALIZATION
// --------------------------------------------------------
renderQuests();
renderLanguageMetrics();
initMoodTracker();