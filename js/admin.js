/* ============================================
   PFix - Admin Panel JavaScript
   Manage bookings, workers, services, and
   pricing from a single dashboard.
   ============================================ */

const AdminApp = {
  isLoggedIn: false,
  currentTab: 'bookings',

  init() {
    this.checkLogin();
    this.setupLoginForm();
  },

  checkLogin() {
    const session = localStorage.getItem('pfix_admin_session');
    if (session) {
      this.isLoggedIn = true;
      this.showDashboard();
    } else {
      this.showLogin();
    }
  },

  setupLoginForm() {
    const form = document.getElementById('admin-login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-user').value.trim();
        const pass = document.getElementById('admin-pass').value.trim();
        this.login(user, pass);
      });
    }
  },

  login(username, password) {
    if (username === PFIX_SERVICES.admin.username && password === PFIX_SERVICES.admin.password) {
      this.isLoggedIn = true;
      localStorage.setItem('pfix_admin_session', 'true');
      this.showDashboard();
      showToast('Admin login successful!', 'success');
    } else {
      showToast('Invalid admin credentials!', 'error');
    }
  },

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('pfix_admin_session');
    this.showLogin();
  },

  showLogin() {
    document.getElementById('admin-login-section').style.display = 'flex';
    document.getElementById('admin-dashboard-section').style.display = 'none';
  },

  showDashboard() {
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('admin-dashboard-section').style.display = 'flex';

    if (window.PFixDB) {
      PFixDB.onBookingsChange(() => {
        if (this.currentTab === 'bookings') {
          const content = document.getElementById('admin-content');
          if (content) this.renderBookings(content);
        } else if (this.currentTab === 'stats') {
          const content = document.getElementById('admin-content');
          if (content) this.renderAdminStats(content);
        }
      });
    }

    this.switchTab('bookings');
  },

  switchTab(tab) {
    this.currentTab = tab;

    // Update sidebar links
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.tab === tab) a.classList.add('active');
    });

    // Render tab content
    const content = document.getElementById('admin-content');
    switch (tab) {
      case 'bookings': this.renderBookings(content); break;
      case 'workers': this.renderWorkers(content); break;
      case 'services': this.renderServices(content); break;
      case 'stats': this.renderAdminStats(content); break;
    }
  },

  renderBookings(container) {
    const bookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const isCloudActive = window.PFixDB && window.PFixDB.isConfigured;

    container.innerHTML = `
      <div class="admin-header">
        <div>
          <h1>📋 Bookings</h1>
          <div style="font-size:0.85rem;margin-top:4px;">
            ${isCloudActive
              ? `<span style="background:#dcfce7;color:#166534;padding:3px 10px;border-radius:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px;">🟢 Cloud Firebase Active</span>`
              : `<span style="background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px;">⚙️ LocalStorage Mode — <span style="font-weight:normal;opacity:0.9;">Firebase চালু করতে <code>js/firebase-config.js</code> ফাইলটি দেখুন</span></span>`
            }
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn btn-outline" style="font-size:0.85rem;" onclick="AdminApp.exportBookings()">📥 Export</button>
          <button class="btn btn-primary" style="font-size:0.85rem;" onclick="AdminApp.clearCompleted()">🗑 Clear Completed</button>
        </div>
      </div>

      ${bookings.length === 0 ? `
        <div style="text-align:center;padding:var(--space-4xl);color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:var(--space-md);">📭</div>
          <h3>No bookings yet</h3>
        </div>
      ` : `
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr>
                  <td><strong>${b.id}</strong></td>
                  <td>${b.name}</td>
                  <td><a href="tel:${b.phone}" style="color:var(--primary);">${b.phone}</a></td>
                  <td>${b.serviceName || b.service}</td>
                  <td>${b.date || 'N/A'}</td>
                  <td><span class="price-tag">৳${b.price || 'TBD'}</span></td>
                  <td><span class="job-status ${b.status}">${b.status}</span></td>
                  <td>
                    <select onchange="AdminApp.updateBookingStatus('${b.id}', this.value)"
                            style="padding:6px 10px;border:1px solid var(--border-color);border-radius:var(--radius-sm);font-size:0.8rem;">
                      <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                      <option value="in-progress" ${b.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                      <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button onclick="AdminApp.deleteBooking('${b.id}')"
                            style="padding:6px 10px;background:var(--danger);color:white;border-radius:var(--radius-sm);font-size:0.8rem;margin-left:4px;">
                      ✕
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  },

  renderWorkers(container) {
    const workers = PFIX_SERVICES.workers;
    container.innerHTML = `
      <div class="admin-header">
        <h1>👷 Workers</h1>
        <button class="btn btn-primary" style="font-size:0.85rem;" onclick="AdminApp.showAddWorkerForm()">+ Add Worker</button>
      </div>

      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Jobs Done</th>
              <th>PIN</th>
            </tr>
          </thead>
          <tbody>
            ${workers.map(w => {
              const cat = PFIX_SERVICES.categories.find(c => c.id === w.category);
              return `
                <tr>
                  <td><strong>${w.id}</strong></td>
                  <td>${w.name}</td>
                  <td>${w.phone}</td>
                  <td>${cat ? cat.icon + ' ' + cat.name : w.category}</td>
                  <td>⭐ ${w.rating}</td>
                  <td>${w.jobs}</td>
                  <td><code>${w.pin}</code></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top:var(--space-xl);padding:var(--space-lg);background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.15);border-radius:var(--radius-md);">
        <strong>💡 Note:</strong> To add or edit workers permanently, update the <code>data/services.js</code> file and redeploy.
        Workers can log in at <a href="worker.html" style="color:var(--primary);font-weight:600;">worker.html</a> using their phone number and PIN.
      </div>
    `;
  },

  renderServices(container) {
    container.innerHTML = `
      <div class="admin-header">
        <h1>🛠 Services & Pricing</h1>
      </div>

      ${PFIX_SERVICES.categories.map(cat => `
        <div style="margin-bottom:var(--space-2xl);">
          <h3 style="margin-bottom:var(--space-md);color:var(--primary-dark);">
            ${cat.icon} ${cat.name} (${cat.nameBn})
          </h3>
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>বাংলা নাম</th>
                  <th>Price (৳)</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                ${cat.services.map(s => `
                  <tr>
                    <td>${s.name}</td>
                    <td>${s.nameBn}</td>
                    <td><span class="price-tag">৳${s.price}</span></td>
                    <td>${s.unit}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}

      <div style="padding:var(--space-lg);background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.15);border-radius:var(--radius-md);">
        <strong>⚙️ To Update Prices:</strong><br>
        Edit the <code>data/services.js</code> file → Update the price values → Commit & push to Vercel.<br>
        This ensures all prices are always up to date across the website.
      </div>
    `;
  },

  renderAdminStats(container) {
    const bookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
    const pending = bookings.filter(b => b.status === 'pending').length;
    const inProgress = bookings.filter(b => b.status === 'in-progress').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const revenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);

    container.innerHTML = `
      <div class="admin-header">
        <h1>📊 Statistics</h1>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fef3c7, #fde68a);">📋</div>
          <div class="stat-value">${bookings.length}</div>
          <div class="stat-label">Total Bookings</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fed7aa, #fdba74);">⏳</div>
          <div class="stat-value">${pending}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #dbeafe, #93c5fd);">🔄</div>
          <div class="stat-value">${inProgress}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #dcfce7, #86efac);">✅</div>
          <div class="stat-value">${completed}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>

      <div style="margin-top:var(--space-2xl);background:white;border-radius:var(--radius-lg);padding:var(--space-2xl);box-shadow:var(--shadow-sm);">
        <h3 style="margin-bottom:var(--space-lg);color:var(--primary-dark);">💰 Revenue Overview</h3>
        <div style="font-size:2.5rem;font-weight:800;color:var(--success);margin-bottom:var(--space-sm);">৳${revenue.toLocaleString()}</div>
        <p style="color:var(--text-muted);">Total earnings from completed jobs</p>
      </div>

      <div style="margin-top:var(--space-2xl);background:white;border-radius:var(--radius-lg);padding:var(--space-2xl);box-shadow:var(--shadow-sm);">
        <h3 style="margin-bottom:var(--space-lg);color:var(--primary-dark);">📈 Bookings by Category</h3>
        ${PFIX_SERVICES.categories.map(cat => {
          const catBookings = bookings.filter(b => b.category === cat.id).length;
          const pct = bookings.length > 0 ? (catBookings / bookings.length * 100) : 0;
          return `
            <div style="margin-bottom:var(--space-md);">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:0.9rem;font-weight:600;">${cat.icon} ${cat.name}</span>
                <span style="font-size:0.85rem;color:var(--text-muted);">${catBookings} bookings</span>
              </div>
              <div style="height:8px;background:var(--bg-primary);border-radius:4px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:linear-gradient(135deg,var(--primary),var(--accent));border-radius:4px;transition:width 0.5s ease;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  updateBookingStatus(bookingId, status) {
    const updates = { status };
    if (status === 'completed') updates.completedAt = new Date().toISOString();

    if (window.PFixDB) {
      PFixDB.updateBooking(bookingId, updates);
    } else {
      const bookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
      const idx = bookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
        bookings[idx] = { ...bookings[idx], ...updates };
        localStorage.setItem('pfix_bookings', JSON.stringify(bookings));
      }
    }
    showToast(`Booking ${bookingId} updated to ${status}`, 'success');
  },

  deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    const bookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
    const filtered = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('pfix_bookings', JSON.stringify(filtered));
    this.renderBookings(document.getElementById('admin-content'));
    showToast('Booking deleted', 'success');
  },

  clearCompleted() {
    if (!confirm('Remove all completed bookings?')) return;
    const bookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
    const filtered = bookings.filter(b => b.status !== 'completed');
    localStorage.setItem('pfix_bookings', JSON.stringify(filtered));
    this.renderBookings(document.getElementById('admin-content'));
    showToast('Completed bookings cleared', 'success');
  },

  exportBookings() {
    const bookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
    const csv = [
      ['ID', 'Customer', 'Phone', 'Service', 'Category', 'Date', 'Time', 'Price', 'Status', 'Created At'].join(','),
      ...bookings.map(b => [
        b.id, b.name, b.phone, b.serviceName || b.service, b.categoryName || b.category,
        b.date, b.time, b.price, b.status, b.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pfix-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Bookings exported!', 'success');
  },

  showAddWorkerForm() {
    showToast('To add workers permanently, edit data/services.js and redeploy.', 'warning');
  }
};

// Toast
if (typeof showToast !== 'function') {
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
