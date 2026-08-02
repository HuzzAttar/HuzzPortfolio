/* =========================================================
   Huzefa Attar — PORTFOLIO
   Main JavaScript — All Interactions & Animations
   ========================================================= */

'use strict';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ LOADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1500);
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ THEME TOGGLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Load saved preference
const savedTheme = localStorage.getItem('hg-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('hg-theme', next);
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ NAVBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('nav-hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const navLinks    = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

// Scroll â†’ glass effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

// Hamburger toggle
hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.contains('open');
  hamburger.classList.toggle('open', !isOpen);
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu?.classList.toggle('open', !isOpen);
  mobileMenu?.setAttribute('aria-hidden', String(isOpen));
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');

const updateActiveLink = () => {
  let currentId = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 100) {
      currentId = section.id;
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SCROLL REVEAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve grids (stagger needs the class)
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// Also observe grid containers for stagger effect
const staggerContainers = [
  '#features-grid', '#services-grid', '#portfolio-grid',
  '#why-me-grid', '#process-timeline', '#why-grid', '#faq-list'
];
staggerContainers.forEach(sel => {
  const el = document.querySelector(sel);
  if (el) revealObserver.observe(el);
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ ANIMATED COUNTERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const animateCounter = (el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;

  const duration  = 1800;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const heroStats  = document.getElementById('hero-stats');
const aboutStats = document.querySelector('.about-stats-mini');
if (heroStats)  counterObserver.observe(heroStats);
if (aboutStats) counterObserver.observe(aboutStats);

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ TESTIMONIALS CAROUSEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const track    = document.getElementById('testimonials-track');
const prevBtn  = document.getElementById('test-prev');
const nextBtn  = document.getElementById('test-next');
const dotsWrap = document.getElementById('test-dots');

if (track) {
  const cards = Array.from(track.children);
  let current = 0;
  let autoInterval;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'test-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  const dots = () => dotsWrap?.querySelectorAll('.test-dot');

  const goTo = (index) => {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots()?.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });

  const startAuto = () => { autoInterval = setInterval(next, 5000); };
  const resetAuto = () => { clearInterval(autoInterval); startAuto(); };

  startAuto();

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  }, { passive: true });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FAQ ACCORDION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });

    // Open clicked
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CONTACT FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

const showError = (id, msg) => {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
};
const clearErrors = () => {
  document.querySelectorAll('.form-error').forEach(e => (e.textContent = ''));
  document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
};

const validateForm = (data) => {
  let valid = true;
  clearErrors();

  if (!data.get('name')?.trim()) {
    showError('err-name', 'Please enter your name.');
    document.getElementById('contact-name')?.classList.add('error');
    valid = false;
  }
  if (!data.get('phone')?.trim()) {
    showError('err-phone', 'Please enter your phone number.');
    document.getElementById('contact-phone')?.classList.add('error');
    valid = false;
  }
  const email = data.get('email')?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('err-email', 'Please enter a valid email address.');
    document.getElementById('contact-email')?.classList.add('error');
    valid = false;
  }
  if (!data.get('message')?.trim()) {
    showError('err-message', 'Please tell me about your project.');
    document.getElementById('contact-message')?.classList.add('error');
    valid = false;
  }
  return valid;
};

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  if (!validateForm(data)) return;

  const submitBtn = document.getElementById('btn-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending...
    `;
  }

  // Simulate submission (replace with EmailJS/Formspree later)
  setTimeout(() => {
    contactForm.reset();
    clearErrors();
    if (formSuccess) formSuccess.classList.add('show');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send My Inquiry
      `;
    }
    setTimeout(() => formSuccess?.classList.remove('show'), 6000);
  }, 1400);
});

// Live validation on blur
document.querySelectorAll('.form-input[required]').forEach(input => {
  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  input.addEventListener('input', () => {
    if (input.value.trim()) input.classList.remove('error');
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SPIN KEYFRAME (submit loading) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ MOBILE STICKY CTA SHOW/HIDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const stickyCta = document.getElementById('mobile-sticky-cta');
const heroSection = document.getElementById('home');

if (stickyCta && heroSection) {
  const stickyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      stickyCta.style.opacity = entry.isIntersecting ? '0' : '1';
      stickyCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.1 });
  stickyObserver.observe(heroSection);
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FEATURE CARD HOVER TILT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.querySelectorAll('.feature-card, .service-card, .why-me-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ PROCESS STEP HOVER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.querySelectorAll('.process-step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 0.04}s`;
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ PORTFOLIO OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const link = card.querySelector('.project-actions .btn-primary');
      link?.click();
    }
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ PRICING CARD HIGHLIGHT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.querySelectorAll('.pricing-card .btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const card = btn.closest('.pricing-card');
    if (!card?.classList.contains('pricing-featured')) {
      card.style.borderColor = 'rgba(26,86,219,0.3)';
    }
  });
  btn.addEventListener('mouseleave', () => {
    const card = btn.closest('.pricing-card');
    if (!card?.classList.contains('pricing-featured')) {
      card.style.borderColor = '';
    }
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SCROLL PROGRESS INDICATOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed; top:0; left:0; height:2px; z-index:9999;
  background:linear-gradient(90deg,#1a56db,#7c3aed);
  transition:width 0.1s linear;
  pointer-events:none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}, { passive: true });

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ BACK TO TOP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// Clicking the logo scrolls to top
document.getElementById('nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ KEYBOARD ACCESSIBILITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// Close mobile menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('.faq-item.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
  }
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SECTION LABEL ANIMATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// Animate section labels when they appear
document.querySelectorAll('.section-label').forEach(label => {
  const labelObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'labelSlideIn 0.5s ease forwards';
        labelObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  labelObs.observe(label);
});

const labelKeyframe = document.createElement('style');
labelKeyframe.textContent = `
  @keyframes labelSlideIn {
    from { opacity:0; transform:translateX(-10px); }
    to   { opacity:1; transform:translateX(0); }
  }
`;
document.head.appendChild(labelKeyframe);

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ INITIAL STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// Ensure loader shown and everything initialized
document.addEventListener('DOMContentLoaded', () => {
  // Force scrolled state if page loaded mid-scroll (refresh)
  if (window.scrollY > 20) navbar?.classList.add('scrolled');
  updateActiveLink();
});

console.log('%c Huzefa Attar Portfolio ', 'background:#1a56db;color:white;font-size:14px;padding:8px 16px;border-radius:4px;font-weight:700;');
console.log('%c Full-Stack Web Developer Â· Ujjain, India ', 'background:#059669;color:white;font-size:12px;padding:4px 16px;border-radius:4px;');

