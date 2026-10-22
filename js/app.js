/* ============================================
   PFix - Main Application JavaScript
   ============================================ */

// ---- App State ----
const APP = {
  currentPage: 'home',
  isLoggedIn: false,
  currentUser: null,
  bookings: [],
};

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  loadBookings();
  setupNavbar();
  setupScrollAnimations();
  renderServices();
  renderPricingTable();
  renderSteps();
  renderTestimonials();
  setupBookingForm();
  updateFooter();
  setupMobileNav();
}

// ---- Navbar ----
function setupNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

function setupMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('show');
    });
  });
}

// ---- Scroll Animations ----
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ---- Render Services ----
function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const data = PFIX_SERVICES.categories;

  grid.innerHTML = data.map((cat, idx) => `
    <div class="service-card reveal" style="animation-delay: ${idx * 0.1}s">
      <div class="service-icon ${cat.id}" style="background: ${cat.bgGradient}">
        ${cat.icon}
      </div>
      <h3>${cat.name}</h3>
      <div class="service-bn">${cat.nameBn}</div>
      <p>${cat.description}</p>
      <div class="service-price">
        <span class="price-label">Starting from</span>
        <span class="price-value">৳${Math.min(...cat.services.map(s => s.price))}</span>
      </div>
      <button class="book-btn" onclick="openBooking('${cat.id}')">
        Book Now →
      </button>
    </div>
  `).join('');

  // Re-observe new elements
  setupScrollAnimations();
}

// ---- Render Pricing Table ----
function renderPricingTable() {
  const container = document.getElementById('pricing-table-body');
  if (!container) return;

  let html = '';
  PFIX_SERVICES.categories.forEach(cat => {
    html += `<tr class="category-header"><td colspan="4">${cat.icon} ${cat.name} (${cat.nameBn})</td></tr>`;
    cat.services.forEach(service => {
      html += `
        <tr>
          <td>${service.name}</td>
          <td>${service.nameBn}</td>
          <td><span class="price-tag">৳${service.price}</span></td>
          <td>${service.unit}</td>
        </tr>
      `;
    });
  });

  container.innerHTML = html;
}

// ---- Render Steps ----
function renderSteps() {
  const grid = document.getElementById('steps-grid');
  if (!grid) return;

  const steps = [
    { num: 1, title: "Choose Service", titleBn: "সেবা নির্বাচন করুন", desc: "Browse our wide range of services and pick what you need" },
    { num: 2, title: "Book Online", titleBn: "অনলাইন বুকিং করুন", desc: "Fill in your details and schedule a convenient time" },
    { num: 3, title: "Expert Arrives", titleBn: "বিশেষজ্ঞ আসবে", desc: "A verified professional arrives at your doorstep" },
    { num: 4, title: "Job Done!", titleBn: "কাজ সম্পন্ন!", desc: "Quality work completed with full satisfaction guarantee" },
  ];

  grid.innerHTML = steps.map((step, idx) => `
    <div class="step-card reveal" style="animation-delay: ${idx * 0.15}s">
      <div class="step-number">${step.num}</div>
      <h3>${step.title}</h3>
      <p>${step.desc}</p>
    </div>
  `).join('');

  setupScrollAnimations();
}

// ---- Render Testimonials ----
function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  const testimonials = [
    {
      text: "PFix-এর প্লাম্বার খুব দক্ষ ছিল। বেসিন ফিটিং মাত্র ৩০ মিনিটে করে ফেলেছে। দাম যুক্তিসঙ্গত এবং কাজের মান অসাধারণ!",
      name: "Faruk Ahmed",
      location: "Mirpur, Dhaka",
      initials: "FA",
      stars: 5
    },
    {
      text: "আমার বাসার AC তে সমস্যা হচ্ছিল। PFix থেকে টেকনিশিয়ান এসে ঠিক করে দিল। খুবই সন্তুষ্ট। আবার সেবা নিব ইনশাআল্লাহ।",
      name: "Nasima Begum",
      location: "Uttara, Dhaka",
      initials: "NB",
      stars: 5
    },
    {
      text: "Office renovation-এর জন্য PFix-এর mason ও painter ব্যবহার করেছি। সময়মতো কাজ শেষ, দাম ফিক্সড, কোনো ঝামেলা নেই!",
      name: "Tanvir Rahman",
      location: "Gulshan, Dhaka",
      initials: "TR",
      stars: 4
    },
  ];

  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card reveal">
      <div class="quote-icon">❝</div>
      <div class="testimonial-stars">${'★'.repeat(t.stars)}${'☆'.repeat(5 - t.stars)}</div>
      <p>"${t.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.initials}</div>
        <div class="testimonial-author-info">
          <div class="name">${t.name}</div>
          <div class="location">${t.location}</div>
        </div>
      </div>
    </div>
  `).join('');

  setupScrollAnimations();
}

// ---- Booking System ----
function openBooking(categoryId) {
  const serviceSelect = document.getElementById('booking-service');
  if (serviceSelect) {
    // Set the category
    const categorySelect = document.getElementById('booking-category');
    if (categorySelect) {
      categorySelect.value = categoryId;
      updateServiceOptions(categoryId);
    }
  }

  // Scroll to booking section
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateServiceOptions(categoryId) {
  const serviceSelect = document.getElementById('booking-service');
  if (!serviceSelect) return;

  const cat = PFIX_SERVICES.categories.find(c => c.id === categoryId);
  if (!cat) {
    serviceSelect.innerHTML = '<option value="">-- Select Service --</option>';
    return;
  }

  serviceSelect.innerHTML = '<option value="">-- Select Service --</option>' +
    cat.services.map(s => `<option value="${s.id}" data-price="${s.price}">
      ${s.name} (${s.nameBn}) - ৳${s.price}/${s.unit}
    </option>`).join('');
}

function setupBookingForm() {
  const categorySelect = document.getElementById('booking-category');
  if (categorySelect) {
    // Populate categories
    categorySelect.innerHTML = '<option value="">-- Select Category --</option>' +
      PFIX_SERVICES.categories.map(c =>
        `<option value="${c.id}">${c.icon} ${c.name} (${c.nameBn})</option>`
      ).join('');

    categorySelect.addEventListener('change', (e) => {
      updateServiceOptions(e.target.value);
      updatePriceDisplay();
    });
  }

  const serviceSelect = document.getElementById('booking-service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', updatePriceDisplay);
  }

  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }
}

function updatePriceDisplay() {
  const serviceSelect = document.getElementById('booking-service');
  const priceDisplay = document.getElementById('estimated-price');
  if (!serviceSelect || !priceDisplay) return;

  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  if (selectedOption && selectedOption.dataset.price) {
    priceDisplay.textContent = `Estimated: ৳${selectedOption.dataset.price}`;
    priceDisplay.style.display = 'block';
  } else {
    priceDisplay.style.display = 'none';
  }
}

function handleBookingSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const booking = {
    id: 'BK' + Date.now(),
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    category: formData.get('category'),
    service: formData.get('service'),
    date: formData.get('date'),
    time: formData.get('time'),
    notes: formData.get('notes'),
    status: 'pending',
    createdAt: new Date().toISOString(),
    price: null,
  };

  // Get price
  const categoryData = PFIX_SERVICES.categories.find(c => c.id === booking.category);
  if (categoryData) {
    const serviceData = categoryData.services.find(s => s.id === booking.service);
    if (serviceData) {
      booking.price = serviceData.price;
      booking.serviceName = serviceData.name;
      booking.serviceNameBn = serviceData.nameBn;
      booking.categoryName = categoryData.name;
    }
  }

  // Save locally & to Firebase Cloud Firestore
  booking.timestamp = Date.now();
  if (window.PFixDB) {
    PFixDB.saveBooking(booking);
  } else {
    const bookings = getBookings();
    bookings.push(booking);
    saveBookings(bookings);
  }

  showToast(`Booking confirmed! ID: ${booking.id}. We'll contact you shortly.`, 'success');
  e.target.reset();
  updatePriceDisplay();

  // Show confirmation modal
  showBookingConfirmation(booking);
}

function showBookingConfirmation(booking) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  modal.innerHTML = `
    <div class="modal-header">
      <h3>✅ Booking Confirmed!</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" style="text-align: center;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#34d399);color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto var(--space-lg);">✓</div>
      <h3 style="margin-bottom:var(--space-md);color:var(--primary-dark);">Thank You!</h3>
      <p style="color:var(--text-secondary);margin-bottom:var(--space-xl);">Your booking has been received. Our team will contact you shortly.</p>
      <div style="background:var(--bg-primary);border-radius:var(--radius-md);padding:var(--space-lg);text-align:left;font-size:0.9rem;">
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Service:</strong> ${booking.serviceName || booking.service}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Estimated Price:</strong> ৳${booking.price || 'TBD'}</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" onclick="closeModal()">Done</button>
    </div>
  `;

  overlay.classList.add('show');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('show');
}

// ---- Local Storage ----
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem('pfix_bookings', JSON.stringify(bookings));
}

function loadBookings() {
  APP.bookings = getBookings();
}

// ---- Toast Notifications ----
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

// ---- Update Footer ----
function updateFooter() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ---- Smooth Scroll ----
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// ---- Counter Animation ----
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function update() {
    start += increment;
    if (start >= target) {
      el.textContent = target + '+';
      return;
    }
    el.textContent = Math.floor(start) + '+';
    requestAnimationFrame(update);
  }
  update();
}

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        if (target) animateCounter(counter, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObserver.observe(statsSection);
});
