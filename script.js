/* ═══════════════════════════════════════════════════════════
   PRIYANKA CHANDRAMOHAN — PORTFOLIO SCRIPTS
   Canvas hero · Count-up · Filter · Cursor · Scroll
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     SCROLL PROGRESS BAR
  ──────────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ────────────────────────────────────────
     NAV: Blur on scroll
  ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ────────────────────────────────────────
     NAV: Hamburger
  ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });


  /* ────────────────────────────────────────
     FADE-UP: Intersection Observer
  ──────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeIO  = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeIO.unobserve(e.target); }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );
  fadeEls.forEach(el => fadeIO.observe(el));

  // Immediately reveal elements already in view
  requestAnimationFrame(() => {
    document.querySelectorAll('#hero .fade-up, #numbers .fade-up').forEach(el => {
      el.classList.add('visible');
    });
  });


  /* ────────────────────────────────────────
     COUNT-UP: Stats
  ──────────────────────────────────────── */
  const statEls = document.querySelectorAll('.stat-num');
  const countIO = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      animateCount(e.target);
    }),
    { threshold: 0.6 }
  );
  statEls.forEach(el => countIO.observe(el));

  function animateCount(el) {
    const target   = parseFloat(el.dataset.target);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTs  = performance.now();
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function step(now) {
      const progress = Math.min((now - startTs) / duration, 1);
      el.textContent = prefix + Math.round(easeOut(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  /* ────────────────────────────────────────
     PROJECT FILTER
  ──────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach((card, i) => {
        const cats    = (card.dataset.category || '').split(' ');
        const matches = filter === 'all' || cats.includes(filter);
        if (matches) {
          card.classList.remove('hidden');
          card.classList.remove('visible');
          card.style.setProperty('--delay', `${i * 0.05}s`);
          void card.offsetWidth; // reflow
          card.classList.add('visible');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ────────────────────────────────────────
     CUSTOM CURSOR
  ──────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  // Don't run cursor on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let curX   = -100, curY   = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

  // Hoverable elements trigger expanded cursor
  const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .project-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Smooth follow with slight lag
  const LERP = 1;
  function followCursor() {
    curX += (mouseX - curX) * LERP;
    curY += (mouseY - curY) * LERP;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(followCursor);
  }
  requestAnimationFrame(followCursor);


  /* ────────────────────────────────────────
     NAV: Active section highlight
  ──────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionIO  = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAnchors.forEach(a =>
          a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id)
        );
      }
    }),
    { threshold: 0.35, rootMargin: '-60px 0px -35% 0px' }
  );
  sections.forEach(s => sectionIO.observe(s));

});
