// ===== POPULAR GAMES DATA =====
const popularGames = [
  { id: 1, name: 'Tosh-Qaychi-Qog\'oz', icon: '✊', reward: '1-3 💎' },
  { id: 2, name: 'Baraban Spin', icon: '🎰', reward: '5-15 💎' },
  { id: 3, name: 'Karta O\'yini', icon: '🃏', reward: '2-10 💎' },
  { id: 4, name: 'Zar Tashlash', icon: '🎲', reward: '1-8 💎' },
  { id: 5, name: 'Wheel of Fortune', icon: '🎡', reward: '3-20 💎' },
  { id: 6, name: 'Memory Match', icon: '🧠', reward: '2-7 💎' },
  { id: 7, name: 'Speed Clicker', icon: '⚡', reward: '1-5 💎' },
  { id: 8, name: 'Lucky Slot', icon: '🎰', reward: '5-25 💎' },
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderPopularGames();
  updateDiamondDisplay();
  checkWithdrawalEligibility();
});

// ===== RENDER GAMES =====
function renderPopularGames() {
  const container = document.getElementById('popularGames');
  if (!container) return;
  
  container.innerHTML = popularGames.slice(0, 8).map(game => `
    <div class="game-card" onclick="playGame(${game.id})">
      <i class="fas fa-dice-d6">${game.icon}</i>
      <h4>${game.name}</h4>
      <span class="reward">${game.reward}</span>
    </div>
  `).join('');
}

// ===== PLAY GAME =====
function playGame(gameId) {
  if (!currentUser) {
    showToast('O\'yin o\'ynash uchun avval ro\'yxatdan o\'ting!', 'error');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }
  
  // Redirect to games page with selected game
  window.location.href = `games.html?game=${gameId}`;
}

// ===== DIAMOND DISPLAY =====
function updateDiamondDisplay() {
  const display = document.getElementById('userDiamonds');
  if (display && currentUser) {
    display.textContent = `💎 ${currentUser.diamonds || 0}`;
  }
}

// ===== WITHDRAWAL CHECK =====
function checkWithdrawalEligibility() {
  const withdrawBtn = document.getElementById('withdrawBtn');
  if (withdrawBtn && currentUser) {
    if ((currentUser.diamonds || 0) >= 172) {
      withdrawBtn.disabled = false;
      withdrawBtn.textContent = 'Yechib Olish (+172 💎)';
    } else {
      withdrawBtn.disabled = true;
      withdrawBtn.textContent = `Yechib olish uchun ${172 - (currentUser.diamonds || 0)} 💎 yetarli emas`;
    }
  }
}

// ===== REFERRAL SYSTEM =====
function generateReferralLink() {
  if (!currentUser) return '';
  const baseUrl = window.location.origin;
  return `${baseUrl}/login.html?ref=${currentUser.id}`;
}

function copyReferralLink() {
  const link = generateReferralLink();
  navigator.clipboard.writeText(link).then(() => {
    showToast('Taklif havolasi nusxalandi! 📋', 'success');
  });
}

// ===== SHOP FUNCTIONS =====
function buyDiamonds(packageId) {
  if (!currentUser) {
    showToast('Sotib olish uchun kiring!', 'error');
    return;
  }
  
  const packages = JSON.parse(localStorage.getItem('notragen_packages') || '[]');
  const pkg = packages.find(p => p.id == packageId);
  
  if (!pkg) return;
  
  // Mock purchase (in production: integrate payment gateway)
  showToast(`${pkg.amount} 💎 sotib olindi! (Demo)`, 'success');
  
  // Add diamonds (for casino use only)
  currentUser.diamonds = (currentUser.diamonds || 0) + pkg.amount;
  localStorage.setItem('notragen_user', JSON.stringify(currentUser));
  updateDiamondDisplay();
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
  // Reuse auth.js toast or implement here
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Export for other pages
window.playGame = playGame;
window.copyReferralLink = copyReferralLink;
window.buyDiamonds = buyDiamonds;
window.updateDiamondDisplay = updateDiamondDisplay;