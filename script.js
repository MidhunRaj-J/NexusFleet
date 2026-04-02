/* ================================================
   NEXUSFLEET - Interactive Product Demo Script
   Role-aware flows | Matching simulation | Rewards
   ================================================ */

const STORAGE_PREFIX = 'nexusfleet-';

function saveToStorage(key, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
}

function getFromStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Storage error:', error);
    return defaultValue;
  }
}

function appendToStorage(key, item) {
  const list = getFromStorage(key, []);
  list.push(item);
  saveToStorage(key, list);
}

function addAnimationClass(element, animationClass, duration = 450) {
  if (!element) return;
  element.style.animation = `${animationClass} ${duration}ms ease-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

function showAlert(type, message) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <strong>${type === 'success' ? 'Success' : 'Notice'}:</strong> ${message}
    <button class="alert-close" type="button">&times;</button>
  `;

  const mount = document.querySelector('.main-content') || document.body;
  mount.prepend(alert);
  addAnimationClass(alert, 'slideInRight', 300);

  alert.querySelector('.alert-close').addEventListener('click', () => {
    alert.remove();
  });

  setTimeout(() => {
    if (alert.isConnected) alert.remove();
  }, 3500);
}

function showSuccess(message) {
  showAlert('success', message);
}

function showError(message) {
  showAlert('danger', message);
}

function initAuthTabs() {
  const tabs = document.querySelectorAll('[data-auth-tab]');
  const panels = document.querySelectorAll('[data-auth-panel]');
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-auth-tab');

      tabs.forEach((item) => item.classList.remove('active'));
      panels.forEach((panel) => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      tab.classList.add('active');
      const panel = document.querySelector(`[data-auth-panel="${tabName}"]`);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
      }
    });
  });
}

function loginUser(role, email, password) {
  if (!email || !password) {
    showError('Please fill in all fields.');
    return;
  }

  const session = {
    role,
    email,
    loginTime: new Date().toISOString(),
  };

  saveToStorage('session', session);
  showSuccess(`Signed in as ${role}. Redirecting to dashboard.`);
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 700);
}

function logoutUser(event) {
  if (event) event.preventDefault();
  localStorage.removeItem(`${STORAGE_PREFIX}session`);
  showSuccess('Logged out successfully.');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

function initAuthForms() {
  const formConfigs = [
    { id: 'customerLoginForm', role: 'customer', email: 'customerEmail', password: 'customerPassword' },
    { id: 'partnerLoginForm', role: 'partner', email: 'partnerEmail', password: 'partnerPassword' },
    { id: 'adminLoginForm', role: 'admin', email: 'adminEmail', password: 'adminPassword' },
  ];

  formConfigs.forEach((config) => {
    const form = document.getElementById(config.id);
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById(config.email)?.value.trim();
      const password = document.getElementById(config.password)?.value;
      loginUser(config.role, email, password);
    });
  });
}

function computeMatchScore(weight, urgency) {
  const weightPenalty = Math.min(weight * 2, 20);
  const urgencyBoost = urgency === 'express' ? 18 : urgency === 'flexible' ? 6 : 12;
  return Math.max(58, 96 - weightPenalty + urgencyBoost);
}

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const pickup = document.getElementById('pickupLocation')?.value.trim();
    const drop = document.getElementById('deliveryLocation')?.value.trim();
    const weight = parseFloat(document.getElementById('weight')?.value || '0');
    const itemType = document.getElementById('itemType')?.value;
    const urgency = document.getElementById('urgency')?.value || 'standard';

    if (!pickup || !drop || !weight || !itemType) {
      showError('Please provide complete booking details.');
      return;
    }

    const score = computeMatchScore(weight, urgency);
    const booking = {
      id: `BK-${Date.now()}`,
      pickupLocation: pickup,
      deliveryLocation: drop,
      weight,
      itemType,
      urgency,
      aiMatchScore: score,
      status: 'Pending Confirmation',
      createdAt: new Date().toISOString(),
    };

    appendToStorage('bookings', booking);
    showSuccess(`Booking created. Match confidence: ${score}%`);
    form.reset();
    updateDashboard();
  });
}

function initPaymentForm() {
  const form = document.getElementById('paymentForm');
  if (!form) return;

  const weightInput = document.getElementById('weight');
  const distanceInput = document.getElementById('distance');
  const speedInput = document.getElementById('deliverySpeed');
  const totalPriceNode = document.getElementById('totalPrice');

  function calculatePrice() {
    const weight = parseFloat(weightInput?.value || '0');
    const distance = parseFloat(distanceInput?.value || '0');
    const speed = speedInput?.value || 'standard';

    let total = weight * 50 + distance * 2;
    if (speed === 'express') total *= 1.5;
    if (speed === 'scheduled') total *= 0.8;

    if (totalPriceNode) totalPriceNode.textContent = `₹${total.toFixed(2)}`;
    return total;
  }

  [weightInput, distanceInput, speedInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', calculatePrice);
    input.addEventListener('change', calculatePrice);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const price = calculatePrice();
    const speed = speedInput?.value || 'standard';

    const quote = {
      id: `QT-${Date.now()}`,
      weight: parseFloat(weightInput?.value || '0'),
      distance: parseFloat(distanceInput?.value || '0'),
      speed,
      price,
      escrowStatus: 'Locked',
      createdAt: new Date().toISOString(),
    };

    appendToStorage('quotes', quote);
    showSuccess('Quote saved and escrow simulated as locked.');
    form.reset();
    calculatePrice();
  });

  calculatePrice();
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function updateDashboard() {
  const session = getFromStorage('session', null);
  if (!session && window.location.pathname.toLowerCase().includes('dashboard')) {
    window.location.href = 'login_page.html';
    return;
  }

  const bookings = getFromStorage('bookings', []);
  const quotes = getFromStorage('quotes', []);

  setText('userEmail', session?.email || 'guest@nexusfleet.app');
  setText('userRole', (session?.role || 'customer').toUpperCase());
  setText('bookingCount', String(bookings.length));
  setText('quoteCount', String(quotes.length));
  setText('activeEscrowCount', String(quotes.filter((q) => q.escrowStatus === 'Locked').length));
  setText('rewardPoints', String(bookings.length * 40 + quotes.length * 15));
  setText('ratingValue', bookings.length ? '4.8 / 5' : 'No ratings yet');
  setText('fraudSignals', bookings.length > 12 ? '2 flagged' : '0 flagged');
  setText('disputeCount', bookings.length > 20 ? '1 open' : '0 open');

  const accountStatus = document.getElementById('accountStatus');
  if (accountStatus) {
    const roleText = session?.role === 'partner' ? 'Traveler Account' : session?.role === 'admin' ? 'Admin Console' : 'Customer Account';
    accountStatus.textContent = roleText;
  }

  const recentBookings = document.getElementById('recentBookings');
  if (recentBookings) {
    const recent = bookings.slice(-5).reverse();
    recentBookings.innerHTML = recent.length
      ? recent.map((booking) => `
          <tr>
            <td><strong>${booking.id}</strong></td>
            <td>${booking.pickupLocation}</td>
            <td>${booking.deliveryLocation}</td>
            <td>${booking.aiMatchScore || '-'}%</td>
            <td><span class="badge badge-info">${booking.status}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" class="text-center text-muted">No bookings yet. Create one to begin.</td></tr>';
  }

  const rolePanels = document.querySelectorAll('[data-role-panel]');
  if (rolePanels.length) {
    rolePanels.forEach((panel) => {
      panel.hidden = panel.getAttribute('data-role-panel') !== (session?.role || 'customer');
    });
  }
}

function initNavigation() {
  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      window.location.href = 'login_page.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }

  document.querySelectorAll('.sidebar-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav-item').forEach((link) => link.classList.remove('active'));
      item.classList.add('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const pageId = document.body.id;

  initNavigation();

  if (pageId === 'loginPage') {
    initAuthTabs();
    initAuthForms();
  }

  if (pageId === 'dashboardPage') {
    updateDashboard();
    initBookingForm();
  }

  if (pageId === 'bookingPage') {
    initBookingForm();
  }

  if (pageId === 'paymentsPage') {
    initPaymentForm();
  }
});
