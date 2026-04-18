// ===== GLOBAL VARIABLES =====
let currentUser = null;
const ADMIN_EMAIL = 'abbosxojavaqqosov@gmail.com';
const ADMIN_PASS = 'Said20070211'; // ⚠️ PRODUCTIONDA BUNI SERVERDA SAQLANG!

// ===== DOM ELEMENTS =====
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const userInfo = document.getElementById('userInfo');
const authBtn = document.getElementById('authBtn');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadAdBanner();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      authForms.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tab + 'Form').classList.add('active');
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    
    // MLBB ID validation warning
    const serverInput = document.getElementById('serverId');
    if (serverInput) {
      serverInput.addEventListener('blur', validateMLBB);
    }
  }

  // Auth button visibility
  if (authBtn) {
    authBtn.addEventListener('click', (e) => {
      if (currentUser) {
        e.preventDefault();
        window.location.href = 'games.html';
      }
    });
  }
}

// ===== AUTH FUNCTIONS =====
function checkAuth() {
  const savedUser = localStorage.getItem('notragen_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUserUI();
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;

  // Admin login check
  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    currentUser = { 
      email: ADMIN_EMAIL, 
      isAdmin: true,
      diamonds: 99999 
    };
    localStorage.setItem('notragen_user', JSON.stringify(currentUser));
    window.location.href = 'admin.html';
    return;
  }

  // Regular user login (mock)
  const users = JSON.parse(localStorage.getItem('notragen_users') || '[]');
  const user = users.find(u => u.email === email && u.password === pass);
  
  if (user) {
    currentUser = { ...user, password: undefined }; // Don't store password
    localStorage.setItem('notragen_user', JSON.stringify(currentUser));
    updateUserUI();
    
    // Registration bonus already given, just show welcome
    showToast(`Xush kelibsiz, ${user.username}! 💎`, 'success');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } else {
    showToast('Email yoki parol noto\'g\'ri!', 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;
  const mlbbId = document.getElementById('mlbbId').value;
  const serverId = document.getElementById('serverId').value;

  // Validation
  if (!validateMLBBData(mlbbId, serverId)) {
    showToast('MLBB ID yoki Server ID noto\'g\'ri formatda!', 'error');
    return;
  }

  // Check if user exists
  const users = JSON.parse(localStorage.getItem('notragen_users') || '[]');
  if (users.some(u => u.email === email)) {
    showToast('Bu email allaqachon ro\'yxatdan o\'tgan!', 'error');
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    username,
    email,
    password: pass, // ⚠️ Hash this in production!
    mlbbId,
    serverId,
    diamonds: 5, // Registration bonus!
    referrals: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('notragen_users', JSON.stringify(users));
  
  // Auto login
  currentUser = { ...newUser, password: undefined };
  localStorage.setItem('notragen_user', JSON.stringify(currentUser));
  
  showToast(`Ro'yxatdan o'tdingiz! +5 💎 bonus hisobingizga qo'shildi!`, 'success');
  setTimeout(() => window.location.href = 'index.html', 2000);
}

function validateMLBBData(mlbbId, serverId) {
  // MLBB ID: 8-12 digits, Server ID: 4 digits (simplified validation)
  const mlbbValid = /^\d{8,12}$/.test(mlbbId);
  const serverValid = /^\d{3,5}$/.test(serverId);
  
  const warning = document.getElementById('mlbbWarning');
  if (warning) {
    warning.style.display = mlbbValid && serverValid ? 'none' : 'block';
  }
  
  return mlbbValid && serverValid;
}

function validateMLBB() {
  const mlbbId = document.getElementById('mlbbId')?.value;
  const serverId = document.getElementById('serverId')?.value;
  if (mlbbId && serverId) {
    validateMLBBData(mlbbId, serverId);
  }
}

// ===== GOOGLE AUTH (MOCK) =====
function googleLogin() {
  // In production: Use Firebase Auth
  showToast('Google autentifikatsiya demo rejimida', 'info');
  setTimeout(() => {
    // Mock successful login
    currentUser = {
      email: 'demo@gmail.com',
      username: 'DemoUser',
      mlbbId: '123456789',
      serverId: '1234',
      diamonds: 50,
      isAdmin: false
    };
    localStorage.setItem('notragen_user', JSON.stringify(currentUser));
    updateUserUI();
    window.location.href = 'index.html';
  }, 1000);
}

function googleRegister() {
  showToast('Google bilan ro\'yxatdan o\'tish demo rejimida', 'info');
  setTimeout(() => {
    // Switch to register tab and pre-fill
    document.querySelector('[data-tab="register"]').click();
    document.getElementById('regEmail').value = 'newuser@gmail.com';
    document.getElementById('regUsername').value = 'NewPlayer';
  }, 500);
}

// ===== UI UPDATES =====
function updateUserUI() {
  if (!userInfo || !authBtn) return;
  
  if (currentUser) {
    document.getElementById('userDiamonds').textContent = `💎 ${currentUser.diamonds || 0}`;
    authBtn.textContent = 'O\'yinlar';
    authBtn.href = 'games.html';
  } else {
    authBtn.textContent = 'Ro\'yxatdan o\'tish';
    authBtn.href = 'login.html#register';
  }
}

function logout() {
  localStorage.removeItem('notragen_user');
  currentUser = null;
  updateUserUI();
  showToast('Tizimdan chiqdingiz', 'info');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

// ===== AD BANNER =====
function loadAdBanner() {
  const adBanner = document.getElementById('ad-banner');
  const adImage = document.getElementById('ad-image');
  
  if (!adBanner || !adImage) return;
  
  const ads = JSON.parse(localStorage.getItem('notragen_ads') || '[]');
  const activeAd = ads.find(a => a.active);
  
  if (activeAd && activeAd.imageUrl) {
    adImage.src = activeAd.imageUrl;
    adImage.parentElement.href = activeAd.link || '#';
    adBanner.style.display = 'flex';
  } else {
    adBanner.style.display = 'none';
  }
}

function closeAd() {
  document.getElementById('ad-banner').style.display = 'none';
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    ${message}
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#00b894' : type === 'error' ? '#d63031' : '#74b9ff'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 2000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove
  setTimeout(() => toast.remove(), 3000);
}

// Add animation keyframes dynamically
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100%); }
    }
  `;
  document.head.appendChild(style);
}

// ===== MOBILE MENU =====
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('active');
}