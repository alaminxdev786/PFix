/* ============================================
   PFix - Worker Dashboard JavaScript
   Handles worker login, job management, and
   work tracking for mobile-friendly dashboard.
   ============================================ */

// ---- Worker State ----
const WorkerApp = {
  currentWorker: null,
  assignedJobs: [],
  completedJobs: [],

  init() {
    this.checkLogin();
    this.setupLoginForm();
  },

  checkLogin() {
    const saved = localStorage.getItem('pfix_worker');
    if (saved) {
      try {
        this.currentWorker = JSON.parse(saved);
        this.showDashboard();
      } catch {
        this.showLogin();
      }
    } else {
      this.showLogin();
    }
  },

  setupLoginForm() {
    const form = document.getElementById('worker-login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('worker-phone').value.trim();
        const pin = document.getElementById('worker-pin').value.trim();
        this.login(phone, pin);
      });
    }
  },

  login(phone, pin) {
    const worker = PFIX_SERVICES.workers.find(w => w.phone === phone && w.pin === pin);
    if (worker) {
      this.currentWorker = worker;
      localStorage.setItem('pfix_worker', JSON.stringify(worker));
      this.showDashboard();
      showToast(`স্বাগতম, ${worker.name}!`, 'success');
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  },

  logout() {
    this.currentWorker = null;
    localStorage.removeItem('pfix_worker');
    this.showLogin();
  },

  showLogin() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
  },

  showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    this.renderDashboard();
  },

  renderDashboard() {
    const worker = this.currentWorker;
    if (!worker) return;

    // Update header
    document.getElementById('worker-name').textContent = worker.name;
    document.getElementById('worker-avatar').textContent = worker.name.charAt(0);
    document.getElementById('worker-category').textContent =
      PFIX_SERVICES.categories.find(c => c.id === worker.category)?.name || worker.category;

    // Real-time listener via PFixDB (Cloud Firestore or LocalStorage)
    if (window.PFixDB) {
      PFixDB.onBookingsChange((allBookings) => {
        this.processBookings(allBookings);
      });
    } else {
      this.loadJobs();
      this.renderStats();
      this.renderJobs();
    }
  },

  processBookings(allBookings) {
    if (!this.currentWorker) return;
    this.assignedJobs = (allBookings || []).filter(b =>
      b.category === this.currentWorker.category && b.status !== 'completed'
    );
    this.completedJobs = (allBookings || []).filter(b =>
      b.category === this.currentWorker.category && b.status === 'completed'
    );
    this.renderStats();
    this.renderJobs();
  },

  loadJobs() {
    const allBookings = window.PFixDB ? PFixDB.getLocalBookings() : JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
    this.processBookings(allBookings);
  },

  renderStats() {
    const stats = document.getElementById('worker-stats');
    if (!stats) return;

    const totalEarnings = this.completedJobs.reduce((sum, j) => sum + (j.price || 0), 0);

    stats.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #dbeafe, #93c5fd);">📋</div>
        <div class="stat-value">${this.assignedJobs.length}</div>
        <div class="stat-label">Pending Jobs</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #dcfce7, #86efac);">✅</div>
        <div class="stat-value">${this.completedJobs.length}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #fff7ed, #fed7aa);">⭐</div>
        <div class="stat-value">${this.currentWorker.rating}</div>
        <div class="stat-label">Rating</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f3e8ff, #c4b5fd);">💰</div>
        <div class="stat-value">৳${totalEarnings.toLocaleString()}</div>
        <div class="stat-label">Earnings</div>
      </div>
    `;
  },

  renderJobs() {
    const jobsList = document.getElementById('jobs-list');
    if (!jobsList) return;

    if (this.assignedJobs.length === 0 && this.completedJobs.length === 0) {
      jobsList.innerHTML = `
        <div style="text-align:center;padding:var(--space-3xl);color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:var(--space-md);">📭</div>
          <h3>No Jobs Yet</h3>
          <p>New bookings will appear here.</p>
        </div>
      `;
      return;
    }

    const allJobs = [...this.assignedJobs, ...this.completedJobs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    jobsList.innerHTML = allJobs.map(job => `
      <div class="job-card">
        <div class="job-header">
          <div>
            <h4 style="font-weight:700;color:var(--primary-dark);margin-bottom:4px;">
              ${job.serviceName || job.service}
            </h4>
            <span style="font-size:0.8rem;color:var(--text-muted);">${job.id}</span>
          </div>
          <span class="job-status ${job.status}">${job.status.replace('-', ' ')}</span>
        </div>
        <div class="job-details">
          <div class="job-detail-item">👤 ${job.name}</div>
          <div class="job-detail-item">📞 ${job.phone}</div>
          <div class="job-detail-item">📍 ${job.address || 'N/A'}</div>
          <div class="job-detail-item">📅 ${job.date || 'N/A'}</div>
          <div class="job-detail-item">⏰ ${job.time || 'N/A'}</div>
          <div class="job-detail-item">💰 ৳${job.price || 'TBD'}</div>
        </div>
        ${job.notes ? `<p style="margin-top:var(--space-sm);font-size:0.85rem;color:var(--text-secondary);font-style:italic;">📝 ${job.notes}</p>` : ''}
        ${job.status !== 'completed' ? `
          <div style="margin-top:var(--space-md);display:flex;gap:8px;flex-wrap:wrap;">
            ${job.status === 'pending' ? `
              <button class="btn btn-primary" style="font-size:0.85rem;padding:8px 16px;" onclick="WorkerApp.updateJobStatus('${job.id}', 'in-progress')">
                ▶ Start Job
              </button>
            ` : ''}
            ${job.status === 'in-progress' ? `
              <button class="btn btn-accent" style="font-size:0.85rem;padding:8px 16px;" onclick="WorkerApp.updateJobStatus('${job.id}', 'completed')">
                ✅ Mark Complete
              </button>
            ` : ''}
            <a href="tel:${job.phone}" class="btn btn-outline" style="font-size:0.85rem;padding:8px 16px;">
              📞 Call Customer
            </a>
          </div>
        ` : `
          <div style="margin-top:var(--space-sm);padding:8px 12px;background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.03));border-radius:var(--radius-sm);color:#059669;font-size:0.85rem;font-weight:600;">
            ✅ Completed
          </div>
        `}
      </div>
    `).join('');
  },

  updateJobStatus(jobId, newStatus) {
    const updates = {
      status: newStatus
    };
    if (newStatus === 'completed') {
      updates.completedAt = new Date().toISOString();
      updates.completedBy = this.currentWorker ? this.currentWorker.id : 'worker';
    }

    if (window.PFixDB) {
      PFixDB.updateBooking(jobId, updates);
    } else {
      const allBookings = JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
      const idx = allBookings.findIndex(b => b.id === jobId);
      if (idx !== -1) {
        allBookings[idx] = { ...allBookings[idx], ...updates };
        localStorage.setItem('pfix_bookings', JSON.stringify(allBookings));
      }
    }

    this.loadJobs();
    showToast(`Job ${newStatus === 'completed' ? 'completed' : 'started'}!`, 'success');
  }
};

// Toast function (if not loaded from main app.js)
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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  WorkerApp.init();
});
