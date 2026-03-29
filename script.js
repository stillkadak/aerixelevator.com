// =============================
// AERIX ELEVATORS — script.js
// =============================

// ── LOADER ──────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loaderWrapper');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 1200);
});

// ── HAMBURGER MENU ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── NAVBAR SCROLL EFFECT ─────────────────────────────────
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  navbar?.classList.toggle('scrolled', scrolled);
  backToTop?.classList.toggle('show', scrolled);
});

// ── BACK TO TOP ──────────────────────────────────────────
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const hash = this.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── FADE-UP SCROLL ANIMATIONS ────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid children
      const delay = (i % 4) * 80;
      setTimeout(() => entry.target.classList.add('appear'), delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) counterObserver.observe(statsSection);

// ── WHATSAPP POPUP ────────────────────────────────────────
const waPopup = document.getElementById('waPopup');
if (waPopup) {
  // Show popup after 6 seconds
  setTimeout(() => waPopup.classList.add('show'), 6000);
  // Auto hide after 18 seconds
  setTimeout(() => waPopup.style.display = 'none', 18000);
}

// ── CONTACT FORM ──────────────────────────────────────────
const form = document.getElementById('quoteForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('nameInput')?.value.trim();
    const phone   = document.getElementById('phoneInput')?.value.trim();
    const email   = document.getElementById('emailInput')?.value.trim() || 'Not provided';
    const liftEl  = document.getElementById('liftType');
    const liftType = liftEl?.options[liftEl.selectedIndex]?.text || '';
    const floorsEl = document.getElementById('floors');
    const floors   = floorsEl?.options[floorsEl.selectedIndex]?.text || '';
    const msg      = document.getElementById('msgInput')?.value.trim() || 'No message';

    if (!name) { showAlert('Please enter your full name.'); return; }
    if (!phone) { showAlert('Please enter your phone number so we can call you.'); return; }

    // Try WhatsApp first (more reliable on mobile)
    const waText = encodeURIComponent(
      `Hello Aerix Elevators!\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nLift Type: ${liftType}\nFloors: ${floors}\nMessage: ${msg}\n\nPlease send me the best price.`
    );
    const waUrl = `https://wa.me/919627739413?text=${waText}`;

    // Also prepare mailto as fallback
    const mailUrl = `mailto:aerixelevator@gmail.com?subject=Best Price Quote - ${liftType}&body=Name: ${name}%0APhone: ${phone}%0AEmail: ${email}%0ALift Type: ${liftType}%0AFloors: ${floors}%0AMessage: ${msg}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    showAlert('✅ Thank you, ' + name + '! Redirecting to WhatsApp. Our team will respond within 30 minutes.', 'success');
    form.reset();
  });
}

function showAlert(msg, type = 'error') {
  // Remove old alert
  document.querySelectorAll('.custom-alert').forEach(a => a.remove());

  const alert = document.createElement('div');
  alert.className = 'custom-alert';
  alert.textContent = msg;
  alert.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? 'linear-gradient(135deg,#064e3b,#065f46)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)'};
    color: white; padding: 16px 28px; border-radius: 16px;
    font-size: 0.95rem; font-weight: 600; z-index: 9999;
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    border: 1px solid ${type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'};
    max-width: 90vw; text-align: center;
    animation: slideUp 0.4s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
  document.head.appendChild(style);

  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 5000);
}

// ── ACTIVE NAV LINK on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
  });
}, { passive: true });
