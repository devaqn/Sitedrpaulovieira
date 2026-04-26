/* ─────────────────────────────────────────────────────────────
   main.js — Dr. Paulo Vieira | Site Profissional
   ───────────────────────────────────────────────────────────── */

/* ══ 1. LOADER ══════════════════════════════════════════════ */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const barFill = document.getElementById('loaderFill');
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
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  setTimeout(() => {
    if (!loader.parentNode) return;
    clearInterval(tick);
    hideLoader();
  }, 4000);
})();

/* ══ 2. NAVBAR: SCROLL STATE ════════════════════════════════
   Logo swap é feito pelo CSS via .scrolled — nada extra necessário
═══════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ══ 3. MENU MOBILE (Drawer + Focus trap) ═══════════════════ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('drawerOverlay');
  const closeBtn  = document.getElementById('drawerClose');
  if (!hamburger || !drawer) return;

  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay?.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('active');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => {
      const first = drawer.querySelector(FOCUSABLE);
      first?.focus();
    });
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    document.body.classList.remove('no-scroll');
    hamburger.focus();
  }

  // Focus trap acessível
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll(FOCUSABLE)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('.drawer-link').forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
})();

/* ══ 4. SCROLL SUAVE PARA ÂNCORAS ══════════════════════════ */
(function initSmoothScroll() {
  const navbar        = document.getElementById('navbar');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
})();

/* ══ 5. LINK ATIVO NO SCROLL ════════════════════════════════ */
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

/* ══ 6. ANIMAÇÕES DE ENTRADA (IntersectionObserver) ════════ */
(function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();

/* ══ 7. CONTADOR ANIMADO (seção Números) ═══════════════════ */
(function initCounters() {
  const counters   = document.querySelectorAll('[data-count]');
  const reducedMot = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(2, -10 * t); }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMot) { el.textContent = target.toLocaleString('pt-BR'); return; }
    const duration = 1800;
    const start    = performance.now();

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

/* ══ 8. FORMULÁRIO → WHATSAPP ══════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '5581991495849';
  const EMAIL_REGEX     = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const ERROS = {
    nome:  'Por favor, informe seu nome completo.',
    email: 'Informe um endereço de e-mail válido.',
  };

  function showError(fieldId, msg) {
    const input = form.querySelector(`#${fieldId}`);
    const erro  = input?.closest('.campo')?.querySelector('.campo-erro');
    if (input) { input.classList.add('field-error'); input.setAttribute('aria-invalid', 'true'); }
    if (erro)  { erro.textContent = msg; }
    input?.focus();
  }

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach(el => {
      el.classList.remove('field-error');
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.campo-erro').forEach(el => { el.textContent = ''; });
  }

  // Limpa erro individual ao digitar
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('field-error');
      input.removeAttribute('aria-invalid');
      const erro = input.closest('.campo')?.querySelector('.campo-erro');
      if (erro) erro.textContent = '';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const nome     = (form.querySelector('#nome')?.value     || '').trim();
    const email    = (form.querySelector('#email')?.value    || '').trim();
    const servico  = (form.querySelector('#servico')?.value  || '').trim();
    const mensagem = (form.querySelector('#mensagem')?.value || '').trim();

    if (!nome)                          { showError('nome',  ERROS.nome);  return; }
    if (!email || !EMAIL_REGEX.test(email)) { showError('email', ERROS.email); return; }

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
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> Enviando…';
      btn.disabled  = true;
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3500);
    }

    setTimeout(() => window.open(url, '_blank'), 400);
    form.reset();
  });
})();

/* ══ 9. ANO ATUAL NO FOOTER ═════════════════════════════════ */
(function initFooterYear() {
  const el = document.getElementById('anoAtual');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ══ 10. VÍDEO HERO — AUTOPLAY ROBUSTO ══════════════════════ */
(function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  video.muted      = true;
  video.playsInline = true;

  const play = () => video.play().catch(() => { video.style.display = 'none'; });

  if (document.readyState === 'complete') { play(); }
  else { window.addEventListener('load', play, { once: true }); }
})();

/* ══ 11. BARRA DE PROGRESSO DO SCROLL ═══════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;

  function update() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ══ 12. CURSOR PERSONALIZADO (otimizado) ═══════════════════
   O RAF é cancelado quando o anel alcança o cursor, evitando
   loop infinito a 60fps desnecessário.
═══════════════════════════════════════════════════════════════ */
(function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // Para o loop quando o anel está próximo o suficiente do cursor
    if (Math.abs(mouseX - ringX) > 0.3 || Math.abs(mouseY - ringY) > 0.3) {
      rafId = requestAnimationFrame(animateRing);
    } else {
      rafId = null;
    }
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    if (!rafId) rafId = requestAnimationFrame(animateRing);
  });

  const INTERACTIVE = 'a, button, .esp-card, .dep-card, .cont-card--link, input, select, textarea';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(INTERACTIVE)) {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(INTERACTIVE)) {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ══ 13. PARALLAX SUAVE NOS ORBS DO HERO ═══════════════════ */
(function initParallax() {
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.hero-orb');
  if (!hero || !orbs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
  });
})();
