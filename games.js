// ===== GAMES DATABASE =====
const allGames = [
  { id: 1, name: 'Tosh-Qaychi-Qog\'oz', icon: '✊', minReward: 1, maxReward: 3, type: 'rps' },
  { id: 2, name: 'Baraban Spin', icon: '🎰', minReward: 5, maxReward: 15, type: 'slot' },
  { id: 3, name: 'Karta O\'yini', icon: '🃏', minReward: 2, maxReward: 10, type: 'card' },
  { id: 4, name: 'Zar Tashlash', icon: '🎲', minReward: 1, maxReward: 8, type: 'dice' },
  { id: 5, name: 'Wheel of Fortune', icon: '🎡', minReward: 3, maxReward: 20, type: 'wheel' },
  { id: 6, name: 'Memory Match', icon: '🧠', minReward: 2, maxReward: 7, type: 'memory' },
  { id: 7, name: 'Speed Clicker', icon: '⚡', minReward: 1, maxReward: 5, type: 'clicker' },
  { id: 8, name: 'Lucky Slot', icon: '🎰', minReward: 5, maxReward: 25, type: 'slot' },
  { id: 9, name: 'Coin Flip', icon: '🪙', minReward: 1, maxReward: 4, type: 'coin' },
  { id: 10, name: 'Number Guess', icon: '🔢', minReward: 3, maxReward: 12, type: 'guess' },
  { id: 11, name: 'Color Match', icon: '🎨', minReward: 2, maxReward: 8, type: 'color' },
  { id: 12, name: 'Quick Math', icon: '🧮', minReward: 2, maxReward: 9, type: 'math' },
  { id: 13, name: 'Reaction Test', icon: '⏱️', minReward: 1, maxReward: 6, type: 'reaction' },
  { id: 14, name: 'Lucky 7', icon: '7️⃣', minReward: 4, maxReward: 18, type: 'lucky7' },
  { id: 15, name: 'Spin & Win', icon: '🌀', minReward: 3, maxReward: 15, type: 'spin' },
  { id: 16, name: 'Dice Duel', icon: '⚔️', minReward: 2, maxReward: 10, type: 'dice' },
  { id: 17, name: 'Card Flip', icon: '🔄', minReward: 1, maxReward: 5, type: 'flip' },
  { id: 18, name: 'Treasure Hunt', icon: '🗝️', minReward: 5, maxReward: 22, type: 'hunt' },
  { id: 19, name: 'Puzzle Master', icon: '🧩', minReward: 3, maxReward: 14, type: 'puzzle' },
  { id: 20, name: 'Jackpot Spin', icon: '💰', minReward: 10, maxReward: 50, type: 'jackpot' },
];

// ===== RENDER GAMES =====
document.addEventListener('DOMContentLoaded', () => {
  renderAllGames();
  
  // Check URL for direct game play
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('game');
  if (gameId) {
    openGame(parseInt(gameId));
  }
});

function renderAllGames() {
  const container = document.getElementById('gamesGrid');
  if (!container) return;
  
  container.innerHTML = allGames.map(game => `
    <div class="game-full-card" onclick="openGame(${game.id})">
      <i class="fas fa-dice-d6">${game.icon}</i>
      <h3>${game.name}</h3>
      <span class="reward">${game.minReward}-${game.maxReward} 💎</span>
      <p style="color:#b2bec3;font-size:0.9rem;margin:10px 0">Qiziqarli 3D o'yin</p>
      <button class="play-btn">O'ynash</button>
    </div>
  `).join('');
}

// ===== GAME MODAL =====
function openGame(gameId) {
  if (!currentUser) {
    showToast('O\'yin o\'ynash uchun avval ro\'yxatdan o\'ting!', 'error');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }
  
  const game = allGames.find(g => g.id === gameId);
  if (!game) return;
  
  const modal = document.getElementById('gameModal');
  const canvas = document.getElementById('gameCanvas');
  
  modal.classList.add('active');
  
  // Render game based on type
  canvas.innerHTML = `
    <h3>${game.icon} ${game.name}</h3>
    <div class="game-result" id="gameResult">O\'yinni boshlash uchun tugmani bosing!</div>
    <div class="game-controls" id="gameControls">
      <!-- Controls will be added by game type -->
    </div>
    <button class="btn btn-primary" onclick="playRound(${game.id})">
      <i class="fas fa-play"></i> O\'ynash
    </button>
    <p style="margin-top:15px;color:#b2bec3;font-size:0.9rem">
      G\'alaba qozonsangiz: ${game.minReward}-${game.maxReward} 💎
    </p>
  `;
  
  // Add specific controls based on game type
  addGameControls(game.type);
}

function closeGame() {
  document.getElementById('gameModal').classList.remove('active');
}

// ===== GAME CONTROLS BY TYPE =====
function addGameControls(type) {
  const controls = document.getElementById('gameControls');
  if (!controls) return;
  
  switch(type) {
    case 'rps':
      controls.innerHTML = `
        <button class="btn" onclick="setChoice('rock')">✊ Tosh</button>
        <button class="btn" onclick="setChoice('paper')">✋ Qog'oz</button>
        <button class="btn" onclick="setChoice('scissors')">✌️ Qaychi</button>
      `;
      window.gameChoice = null;
      break;
      
    case 'slot':
    case 'jackpot':
      controls.innerHTML = `<button class="btn" onclick="spinReels()">🎰 Aylantirish</button>`;
      break;
      
    case 'dice':
      controls.innerHTML = `<button class="btn" onclick="rollDice()">🎲 Tashlash</button>`;
      break;
      
    case 'coin':
      controls.innerHTML = `<button class="btn" onclick="flipCoin()">🪙 Tashlash</button>`;
      break;
      
    case 'wheel':
      controls.innerHTML = `<button class="btn" onclick="spinWheel()">🎡 Aylantirish</button>`;
      break;
      
    default:
      controls.innerHTML = `<button class="btn" onclick="playSimple()">🎮 Boshlash</button>`;
  }
}

// ===== GAME LOGIC EXAMPLES =====
let gameChoice = null;

function setChoice(choice) {
  gameChoice = choice;
  document.querySelectorAll('#gameControls .btn').forEach(btn => {
    btn.style.background = 'rgba(0,0,0,0.3)';
  });
  event.currentTarget.style.background = 'var(--gradient)';
}

function playRound(gameId) {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return;
  
  let reward = 0;
  let message = '';
  
  // Simple random win logic (demo)
  const winChance = Math.random();
  
  switch(game.type) {
    case 'rps':
      if (!gameChoice) {
        document.getElementById('gameResult').textContent = 'Avval tanlov qiling!';
        return;
      }
      const choices = ['rock', 'paper', 'scissors'];
      const computer = choices[Math.floor(Math.random() * 3)];
      message = `Siz: ${getEmoji(gameChoice)} | Kompyuter: ${getEmoji(computer)} | `;
      
      if (gameChoice === computer) {
        message += 'Durang! 😐';
      } else if (
        (gameChoice === 'rock' && computer === 'scissors') ||
        (gameChoice === 'paper' && computer === 'rock') ||
        (gameChoice === 'scissors' && computer === 'paper')
      ) {
        reward = Math.floor(Math.random() * (game.maxReward - game.minReward + 1)) + game.minReward;
        message += `G\'alaba! 🎉 +${reward} 💎`;
      } else {
        message += 'Yutqazdingiz 😔';
      }
      break;
      
    case 'slot':
    case 'jackpot':
      if (winChance > 0.6) {
        reward = Math.floor(Math.random() * (game.maxReward - game.minReward + 1)) + game.minReward;
        message = `🎰 Jackpot! +${reward} 💎`;
      } else {
        message = '🎰 Yutqazdingiz, yana urinib ko\'ring!';
      }
      break;
      
    case 'dice':
      const roll = Math.floor(Math.random() * 6) + 1;
      if (roll >= 4) {
        reward = roll;
        message = `🎲 ${roll} tushdi! +${reward} 💎`;
      } else {
        message = `🎲 ${roll} tushdi, yana urinib ko'ring!`;
      }
      break;
      
    default:
      // Simple random reward
      if (winChance > 0.5) {
        reward = Math.floor(Math.random() * (game.maxReward - game.minReward + 1)) + game.minReward;
        message = `🎉 Tabriklaymiz! +${reward} 💎`;
      } else {
        message = '😔 Yutqazdingiz, omadingiz keyingi safar!';
      }
  }
  
  // Update result
  document.getElementById('gameResult').textContent = message;
  
  // Add reward if won
  if (reward > 0 && currentUser) {
    currentUser.diamonds = (currentUser.diamonds || 0) + reward;
    localStorage.setItem('notragen_user', JSON.stringify(currentUser));
    
    // Update global diamond display
    if (window.updateDiamondDisplay) {
      window.updateDiamondDisplay();
    }
    
    // Show celebration animation
    celebrateWin(reward);
  }
}

function getEmoji(choice) {
  const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
  return emojis[choice] || choice;
}

// Placeholder functions for other game types
function spinReels() { playRound(2); }
function rollDice() { playRound(4); }
function flipCoin() { playRound(9); }
function spinWheel() { playRound(5); }
function playSimple() { playRound(event.currentTarget.closest('.game-full-card')?.dataset.id || 1); }

function celebrateWin(amount) {
  // Simple confetti effect
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${['#6c5ce7', '#a29bfe', '#fdcb6e', '#00b894'][Math.floor(Math.random()*4)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 3000;
      animation: fall ${Math.random()*2+1}s linear forwards;
    `;
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
  
  // Add animation keyframes if not exists
  if (!document.getElementById('confetti-anim')) {
    const style = document.createElement('style');
    style.id = 'confetti-anim';
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Close modal on outside click
document.getElementById('gameModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'gameModal') closeGame();
});