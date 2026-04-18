// ===== ADMIN INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadPricePackages();
  loadWithdrawals();
  loadCurrentAd();
});

// ===== SECTION NAVIGATION =====
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  // Show selected
  document.getElementById(sectionId).classList.add('active');
  
  // Update menu active state
  document.querySelectorAll('.admin-menu button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
}

// ===== PRICE MANAGEMENT =====
function loadPricePackages() {
  const container = document.getElementById('pricePackages');
  if (!container) return;
  
  // Default packages
  const defaultPackages = [
    { id: 1, amount: 50, price: '$0.99' },
    { id: 2, amount: 120, price: '$2.49' },
    { id: 3, amount: 250, price: '$4.99' },
    { id: 4, amount: 500, price: '$9.99' },
    { id: 5, amount: 1000, price: '$19.99' },
    { id: 6, amount: 2500, price: '$49.99' }
  ];
  
  let packages = JSON.parse(localStorage.getItem('notragen_packages') || 'null');
  if (!packages) {
    packages = defaultPackages;
    localStorage.setItem('notragen_packages', JSON.stringify(packages));
  }
  
  container.innerHTML = packages.map(pkg => `
    <div class="price-item">
      <label>${pkg.amount} 💎</label>
      <input type="text" value="${pkg.price}" data-id="${pkg.id}" placeholder="Narx"/>
    </div>
  `).join('');
}

function savePrices() {
  const inputs = document.querySelectorAll('#pricePackages input');
  const packages = JSON.parse(localStorage.getItem('notragen_packages') || '[]');
  
  inputs.forEach(input => {
    const pkg = packages.find(p => p.id == input.dataset.id);
    if (pkg) {
      pkg.price = input.value;
    }
  });
  
  localStorage.setItem('notragen_packages', JSON.stringify(packages));
  showToast('Narxlar muvaffaqiyatli saqlandi! ✅', 'success');
}

// ===== WITHDRAWALS MANAGEMENT =====
function loadWithdrawals() {
  const tbody = document.getElementById('withdrawalsList');
  if (!tbody) return;
  
  const withdrawals = JSON.parse(localStorage.getItem('notragen_withdrawals') || '[]');
  
  if (withdrawals.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">Hozircha so\'rovlar yo\'q</td></tr>';
    return;
  }
  
  tbody.innerHTML = withdrawals.map(w => `
    <tr>
      <td>${w.username}</td>
      <td>${w.mlbbId}</td>
      <td>${w.serverId}</td>
      <td class="diamond-text">${w.amount} 💎</td>
      <td>${new Date(w.date).toLocaleDateString('uz-UZ')}</td>
      <td><span class="status-badge status-${w.status}">${w.status === 'approved' ? 'Tasdiqlandi' : w.status === 'rejected' ? 'Rad etildi' : 'Kutilmoqda'}</span></td>
      <td>
        ${w.status === 'pending' ? `
          <button class="action-btn btn-approve" onclick="processWithdrawal(${w.id}, 'approved')">✓</button>
          <button class="action-btn btn-reject" onclick="processWithdrawal(${w.id}, 'rejected')">✗</button>
        ` : '-'}
      </td>
    </tr>
  `).join('');
}

function processWithdrawal(id, status) {
  const withdrawals = JSON.parse(localStorage.getItem('notragen_withdrawals') || '[]');
  const index = withdrawals.findIndex(w => w.id === id);
  
  if (index !== -1) {
    withdrawals[index].status = status;
    localStorage.setItem('notragen_withdrawals', JSON.stringify(withdrawals));
    
    // If approved, deduct diamonds from user
    if (status === 'approved') {
      const users = JSON.parse(localStorage.getItem('notragen_users') || '[]');
      const userIndex = users.findIndex(u => u.id === withdrawals[index].userId);
      if (userIndex !== -1) {
        users[userIndex].diamonds = Math.max(0, (users[userIndex].diamonds || 0) - withdrawals[index].amount);
        localStorage.setItem('notragen_users', JSON.stringify(users));
        
        // Update current user if it's them
        if (currentUser && currentUser.id === withdrawals[index].userId) {
          currentUser.diamonds = users[userIndex].diamonds;
          localStorage.setItem('notragen_user', JSON.stringify(currentUser));
        }
      }
    }
    
    showToast(`So'rov ${status === 'approved' ? 'tasdiqlandi' : 'rad etildi'}!`, 'success');
    loadWithdrawals();
  }
}

// ===== AD MANAGEMENT =====
function previewAd(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('adPreview');
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function loadCurrentAd() {
  const ads = JSON.parse(localStorage.getItem('notragen_ads') || '[]');
  const activeAd = ads.find(a => a.active) || {};
  
  if (activeAd.imageUrl) {
    document.getElementById('adPreview').src = activeAd.imageUrl;
    document.getElementById('adPreview').style.display = 'block';
  }
  if (activeAd.link) {
    document.getElementById('adLink').value = activeAd.link;
  }
  document.getElementById('adActive').checked = activeAd.active !== false;
}

function saveAd() {
  const preview = document.getElementById('adPreview');
  const link = document.getElementById('adLink').value;
  const active = document.getElementById('adActive').checked;
  
  const adData = {
    imageUrl: preview.src || '',
    link: link,
    active: active,
    updatedAt: new Date().toISOString()
  };
  
  // Remove old active ads, add new one
  let ads = JSON.parse(localStorage.getItem('notragen_ads') || '[]');
  ads = ads.filter(a => !a.active);
  ads.push(adData);
  
  localStorage.setItem('notragen_ads', JSON.stringify(ads));
  showToast('Reklama muvaffaqiyatli saqlandi! ✅', 'success');
}

// ===== LOGOUT =====
function logoutAdmin() {
  localStorage.removeItem('notragen_user');
  window.location.href = 'login.html';
}

// ===== TOAST (reuse from auth.js logic) =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#00b894' : type === 'error' ? '#d63031' : '#74b9ff'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 3000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
  `;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}