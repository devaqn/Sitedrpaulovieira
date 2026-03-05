/**
 * main.js — Dr. Paulo Vieira | Site Profissional Premium
 * ─────────────────────────────────────────────
 *  1. Loader animado
 *  2. Navbar: scroll state + logo swap
 *  3. Menu mobile (drawer + overlay)
 *  4. Scroll suave para âncoras
 *  5. Highlight do link ativo no scroll
 *  6. Animações de entrada (IntersectionObserver)
 *  7. Contador animado de números
 *  8. Formulário → redirect WhatsApp
 *  9. Ano atual no footer
 * 10. Vídeo hero: autoplay mudo
 */

/* ═══════════════════════════════════════════════
   1. LOADER
═══════════════════════════════════════════════ */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const barFill = document.getElementById('loaderFill');   // ← id correto do HTML
  if (!loader) return;

  let value = 0;
  const tick = setInterval(() => {
    value += Math.random() * 18 + 5;
    if (value >= 100) {
      value = 100;
      clearInterval(tick);
      setTimeout(hideLoader, 300);
    }
    if (barFill) barFill.style.width = value + '%';
  }, 70);

  function hideLoader() {
    loader.classList.add('is-hidden');               // ← classe correta do CSS
    document.body.classList.remove('is-loading');    // ← remove overflow:hidden do body
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  // Segurança: remove após 4s de qualquer forma
  setTimeout(() => {
    if (!loader.parentNode) return;
    clearInterval(tick);
    hideLoader();
  }, 4000);
})();

/* ═══════════════════════════════════════════════
   2. NAVBAR: SCROLL STATE + LOGO SWAP
═══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const logoLight = document.getElementById('navLogoLight');
  const logoDark  = document.getElementById('navLogoDark');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60;

  function updateNavbar() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    navbar.classList.toggle('scrolled', scrolled);
    if (logoLight) logoLight.style.opacity = scrolled ? '1' : '0';
    if (logoDark)  logoDark.style.opacity  = scrolled ? '0' : '1';
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ═══════════════════════════════════════════════
   3. MENU MOBILE — DRAWER + OVERLAY
═══════════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');       // ← id correto do HTML
  const overlay   = document.getElementById('drawerOverlay');
  const closeBtn  = document.getElementById('drawerClose');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay?.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('active');                       // ← classe que o CSS usa
    document.body.classList.add('no-scroll');
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
})();

/* ═══════════════════════════════════════════════
   4. SCROLL SUAVE PARA ÂNCORAS
═══════════════════════════════════════════════ */
(function initSmoothScroll() {
  const navbar = document.getElementById('navbar');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════════════════════════════════
   5. LINK ATIVO NO SCROLL
═══════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .drawer-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const navbar = document.getElementById('navbar');
  const OFFSET = (navbar ? navbar.offsetHeight : 72) + 20;

  function highlightActive() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY + OFFSET >= section.offsetTop) current = section.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', highlightActive, { passive: true });
  highlightActive();
})();

/* ═══════════════════════════════════════════════
   6. ANIMAÇÕES DE ENTRADA (IntersectionObserver)
═══════════════════════════════════════════════ */
(function initAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseFloat(el.dataset.delay || 0); // ← valor direto em ms (sem ×1000)
      setTimeout(() => el.classList.add('is-visible'), delay);
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════
   7. CONTADOR ANIMADO (seção Números)
═══════════════════════════════════════════════ */
(function initCounters() {
  const counters    = document.querySelectorAll('[data-count]');
  const reducedMot  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!counters.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();
    if (reducedMot) { el.textContent = target.toLocaleString('pt-BR'); return; }

    function easeOut(t) { return 1 - Math.pow(2, -10 * t); }

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════
   8. FORMULÁRIO → REDIRECT WHATSAPP
═══════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contForm'); // ← id correto do HTML
  if (!form) return;

  // ✏️ EDITE: número real do WhatsApp (formato: 55DDD9XXXXXXXX)
  const WHATSAPP_NUMBER = '55XXXXXXXXXXX';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome     = (form.querySelector('#nome')?.value     || '').trim();
    const email    = (form.querySelector('#email')?.value    || '').trim();
    const servico  = (form.querySelector('#servico')?.value  || '').trim(); // ← id correto
    const mensagem = (form.querySelector('#mensagem')?.value || '').trim();

    if (!nome) { shakeField('#nome'); return; }
    if (!email) { shakeField('#email'); return; }

    const servicoLabels = {
      hipnoterapia: 'Hipnoterapia Avançada',
      psicanalise:  'Psicanálise',
      biofeedback:  'Neurociência com Biofeedback',
      avaliacao:    'Consulta de Avaliação',
    };

    const partes = [
      `*Contato via site — Dr. Paulo Vieira*`,
      ``,
      `👤 *Nome:* ${nome}`,
      email   ? `📧 *E-mail:* ${email}` : '',
      servico ? `📌 *Especialidade:* ${servicoLabels[servico] || servico}` : '',
      mensagem ? `\n💬 *Mensagem:*\n${mensagem}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(partes)}`;

    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      const orig  = btn.innerHTML;
      btn.innerHTML = '✅ Redirecionando…';
      btn.disabled  = true;
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3500);
    }

    setTimeout(() => window.open(url, '_blank'), 400);
    form.reset();
  });

  function shakeField(selector) {
    const el = form.querySelector(selector);
    if (!el) return;
    el.classList.add('field-error');
    el.addEventListener('animationend', () => el.classList.remove('field-error'), { once: true });
    el.focus();
  }
})();

/* ═══════════════════════════════════════════════
   9. ANO ATUAL NO FOOTER
═══════════════════════════════════════════════ */
(function initFooterYear() {
  const el = document.getElementById('anoAtual');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ═══════════════════════════════════════════════
  10. VÍDEO HERO — AUTOPLAY ROBUSTO
═══════════════════════════════════════════════ */
(function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  video.muted = true;
  video.playsInline = true;

  const play = () => video.play().catch(() => {
    video.style.display = 'none';
  });

  if (document.readyState === 'complete') {
    play();
  } else {
    window.addEventListener('load', play, { once: true });
  }
})();

/* ═══════════════════════════════════════════════
  11. BARRA DE PROGRESSO DO SCROLL
═══════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;

  function update() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ═══════════════════════════════════════════════
  12. CURSOR PERSONALIZADO
═══════════════════════════════════════════════ */
(function initCursor() {
  // Só em dispositivos com mouse
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    if (!rafId) {
      rafId = requestAnimationFrame(animateRing);
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }

  // Hover em elementos interativos
  const interactiveEls = 'a, button, .esp-card, .dep-card, .cont-card--link, input, select, textarea';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveEls)) {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveEls)) {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  });

  // Esconde ao sair da janela
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ═══════════════════════════════════════════════
  13. PARALLAX SUAVE NOS ORBS DO HERO
═══════════════════════════════════════════════ */
(function initParallax() {
  const hero  = document.querySelector('.hero');
  const orbs  = document.querySelectorAll('.hero-orb');
  if (!hero || !orbs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', e => {
    const rect  = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;  // -1 a 1
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
  });
})();
