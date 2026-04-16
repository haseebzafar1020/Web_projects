/* ============================================================
   HM Collage — script.js
   Features:
   • Sticky header shadow on scroll
   • Active nav-link highlighting based on scroll position
   • Mobile hamburger menu (toggle + close on link click)
   • Smooth scrolling for all anchor links
   • Animated stat counters (triggers once on scroll into view)
   • Scroll-reveal animations for cards and sections
   • Current year in footer copyright
   ============================================================ */

/* ─── DOM References ──────────────────────────────────────── */
const header        = document.querySelector('header');
const navLinks      = document.querySelectorAll('.nav-links a');
const sections      = document.querySelectorAll('section[id], div[id]');
const hamburger     = document.getElementById('hamburger');
const navMenu       = document.querySelector('.nav-links');
const statsItems    = document.querySelectorAll('.stats-item h3');
const revealEls     = document.querySelectorAll(
  '.course-card, .feature-card, .stats-item, .About-content, .hero-content'
);
const yearEl        = document.getElementById('year');

/* ─── 1. Current Year in Footer ──────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── 2. Sticky Header Shadow on Scroll ──────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  highlightActiveLink();
});

/* ─── 3. Active Nav-Link Highlighting ────────────────────── */
function highlightActiveLink() {
  let currentSection = '';
  const scrollPos = window.scrollY + header.offsetHeight + 60;

  // Map section element IDs to nav href targets
  const sectionMap = {
    'home':     '#home',
    'about':    '#about',
    'courses':  '#courses',
    'contact':  '#contact',
  };

  document.querySelectorAll('section[id]').forEach(sec => {
    if (scrollPos >= sec.offsetTop) {
      currentSection = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const target = sectionMap[currentSection];
    if (target && link.getAttribute('href') === target) {
      link.classList.add('active');
    }
  });
}

/* ─── 4. Smooth Scrolling ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const offset = header.offsetHeight;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    // Close mobile menu when a link is clicked
    navMenu.classList.remove('open');
    hamburger && hamburger.classList.remove('active');
  });
});

/* ─── 5. Hamburger Mobile Menu ───────────────────────────── */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target) &&
      navMenu.classList.contains('open')
    ) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
}

/* ─── 6. Animated Counter ────────────────────────────────── */
function animateCounter(el) {
  const raw   = el.textContent.trim();           // e.g. "1M+", "500+", "50+"
  const suffix = raw.replace(/[\d.]/g, '');       // "M+", "+", "+"
  const target = parseFloat(raw.replace(/[^\d.]/g, ''));
  const duration = 1800;   // ms
  const step     = 16;     // ~60 fps

  let current = 0;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (Number.isInteger(target)
      ? Math.floor(current)
      : current.toFixed(1)) + suffix;
  }, step);
}

/* ─── 7. Intersection Observer — Counters & Reveal ──────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);   // only animate once
    }
  });
}, { threshold: 0.6 });

statsItems.forEach(el => counterObserver.observe(el));

/* Scroll-reveal: add .revealed class when element enters viewport */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => {
  el.classList.add('reveal-init');   // hide initially (CSS handles it)
  revealObserver.observe(el);
});

/* ─── 8. Course-Card "Enroll" Click Feedback ─────────────── */
document.querySelectorAll('.course-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const courseName = card.querySelector('h3')?.textContent || 'this course';
    showToast(`You clicked on "${courseName}" — enroll coming soon! 🎓`);
  });
});

/* ─── 10. Contact Form — Validation & Submit ────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const btn     = document.getElementById('contact-submit');

    // Basic validation
    if (!name) {
      showToast('⚠️ Please enter your full name.');
      document.getElementById('contact-name').focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('⚠️ Please enter a valid email address.');
      document.getElementById('contact-email').focus();
      return;
    }
    if (!message) {
      showToast('⚠️ Please write a message before sending.');
      document.getElementById('contact-message').focus();
      return;
    }

    // Simulate sending (loading state)
    btn.disabled = true;
    btn.innerHTML = 'Sending... <i class="ri-loader-4-line spin"></i>';

    setTimeout(() => {
      // Reset form
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = 'Send Message <i class="ri-send-plane-fill"></i>';
      showToast('✅ Message sent! We\'ll get back to you soon.');
    }, 1800);
  });
}
function showToast(message) {
  // Remove existing toast if present
  const existing = document.getElementById('hm-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'hm-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position:        'fixed',
    bottom:          '2rem',
    left:            '50%',
    transform:       'translateX(-50%) translateY(20px)',
    background:      '#1a73e8',
    color:           '#fff',
    padding:         '0.8rem 1.6rem',
    borderRadius:    '8px',
    fontFamily:      'Segoe UI, sans-serif',
    fontSize:        '0.95rem',
    fontWeight:      '600',
    boxShadow:       '0 4px 20px rgba(0,0,0,0.25)',
    zIndex:          '9999',
    opacity:         '0',
    transition:      'opacity 0.3s ease, transform 0.3s ease',
    whiteSpace:      'nowrap',
    maxWidth:        '90vw',
    textAlign:       'center',
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Animate out after 3 s
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}
