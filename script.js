/* ============================================================
   LANDING PAGE — script.js
   ============================================================ */

/* ─── PROYECTOS ──────────────────────────────────────────────
   featured: true  → tarjeta grande (solo el primero)
   featured: false → tarjeta normal en la grilla
   ─────────────────────────────────────────────────────────── */
const projects = [
  {
    name:        "Expenzo",
    description: "Plataforma de herramientas digitales útiles y accesibles. Diseñada para simplificar procesos, ahorrar tiempo y generar valor real a quienes la usan.",
    link:        "https://expensio-phi.vercel.app/login",
    tag:         "Plataforma",
    featured:    true
  }
];

/* ═══════════════════════════════════════════════════════════
   CURSOR PERSONALIZADO
   Punto instantáneo + anillo con lerp (efecto arrastre)
═══════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');

  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  (function moveRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(moveRing);
  })();

  const hoverTargets = 'a, button, .project-card, .project-card-featured, .service-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}

/* ═══════════════════════════════════════════════════════════
   SPOTLIGHT QUE SIGUE EL MOUSE
═══════════════════════════════════════════════════════════ */
function initSpotlight() {
  const light = document.getElementById('spotlight');
  if (!light || window.matchMedia('(hover: none)').matches) return;

  let lx = 0, ly = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });

  (function move() {
    lx += (tx - lx) * 0.07;
    ly += (ty - ly) * 0.07;
    light.style.left = lx + 'px';
    light.style.top  = ly + 'px';
    requestAnimationFrame(move);
  })();
}

/* ═══════════════════════════════════════════════════════════
   NAVEGACIÓN — scroll + menú móvil
═══════════════════════════════════════════════════════════ */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      links.classList.toggle('open', open);
    });

    links.querySelectorAll('.nav-link').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   PARALLAX DEL HERO (mouse)
═══════════════════════════════════════════════════════════ */
function initParallax() {
  const layers = document.querySelectorAll('[data-depth]');
  if (!layers.length) return;

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 100;
    ty = (e.clientY / window.innerHeight - 0.5) * 100;
  }, { passive: true });

  window.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

  (function animate() {
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;

    layers.forEach(layer => {
      const d = parseFloat(layer.dataset.depth) || 0;
      layer.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
    });

    requestAnimationFrame(animate);
  })();
}

/* ═══════════════════════════════════════════════════════════
   CANVAS DE PARTÍCULAS — HERO (constelación neon)
═══════════════════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles;

  const COLORS = [
    'rgba(14, 165, 233,',
    'rgba(139, 92, 246,',
    'rgba(6,  182, 212,',
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawnParticles();
  }

  function spawnParticles() {
    const count = Math.min(55, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x:     Math.random() * w,
      y:     Math.random() * h,
      vx:    (Math.random() - 0.5) * 0.26,
      vy:    (Math.random() - 0.5) * 0.26,
      r:     Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.45 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    });

    const MAX_DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(14,165,233,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle  = `${p.color}${p.alpha})`;
      ctx.shadowColor = `${p.color}0.8)`;
      ctx.shadowBlur  = 8;
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
}

/* ═══════════════════════════════════════════════════════════
   CANVAS DE PARTÍCULAS — CONTACTO (ambiente suave)
═══════════════════════════════════════════════════════════ */
function initContactCanvas() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawnParticles();
  }

  function spawnParticles() {
    const count = Math.min(30, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x:     Math.random() * w,
      y:     Math.random() * h,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    (Math.random() - 0.5) * 0.18,
      r:     Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.35 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    });

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle  = `rgba(14,165,233,${p.alpha})`;
      ctx.shadowColor = 'rgba(14,165,233,0.6)';
      ctx.shadowBlur  = 6;
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   RIPPLE EN BOTONES
═══════════════════════════════════════════════════════════ */
function initRipples() {
  document.querySelectorAll('.btn, .btn-wa').forEach(btn => {
    btn.addEventListener('click', e => {
      const r    = btn.getBoundingClientRect();
      const span = document.createElement('span');
      const size = Math.max(r.width, r.height) * 2;
      span.className = 'btn-ripple';
      span.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - r.left - size / 2}px;
        top:${e.clientY - r.top  - size / 2}px;
      `;
      btn.appendChild(span);
      span.addEventListener('animationend', () => span.remove(), { once: true });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   RENDER DE PROYECTOS
═══════════════════════════════════════════════════════════ */
const ARROW = `
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2.5"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>`;

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const featured = projects.find(p => p.featured);
  const rest     = projects.filter(p => !p.featured);

  if (featured) {
    const a = document.createElement('a');
    a.href      = featured.link;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';
    a.className = 'project-card-featured reveal';

    a.innerHTML = `
      <div class="card-body">
        <span class="card-tag">${escHtml(featured.tag)}</span>
        <h3 class="card-name">${escHtml(featured.name)}</h3>
        <p class="card-desc">${escHtml(featured.description)}</p>
        <span class="card-link">Ver proyecto ${ARROW}</span>
      </div>
      <div class="card-badge-featured" aria-hidden="true">
        <svg viewBox="0 0 60 60" fill="none" width="60" height="60">
          <circle cx="30" cy="30" r="28" stroke="rgba(14,165,233,0.25)" stroke-width="1.5" stroke-dasharray="4 4"/>
          <circle cx="30" cy="30" r="18" stroke="rgba(139,92,246,0.30)" stroke-width="1.5"/>
          <circle cx="30" cy="30" r="8"  fill="rgba(14,165,233,0.20)" stroke="rgba(14,165,233,0.6)" stroke-width="1.5"/>
        </svg>
      </div>
    `;
    grid.appendChild(a);
  }

  if (rest.length) {
    const subGrid = document.createElement('div');
    subGrid.className = 'projects-sub-grid';

    rest.forEach((p, i) => {
      const a = document.createElement('a');
      a.href      = p.link;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.className = 'project-card reveal';
      a.style.transitionDelay = `${i * 0.08}s`;

      a.innerHTML = `
        <span class="card-tag">${escHtml(p.tag)}</span>
        <h3 class="card-name">${escHtml(p.name)}</h3>
        <p class="card-desc">${escHtml(p.description)}</p>
        <span class="card-link">Ver proyecto ${ARROW}</span>
      `;
      subGrid.appendChild(a);
    });

    grid.appendChild(subGrid);
  }
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════════════
   GLOW EN TARJETAS (luz que sigue el mouse dentro)
═══════════════════════════════════════════════════════════ */
function initCardGlow() {
  const cards = document.querySelectorAll(
    '.project-card, .project-card-featured, .service-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--gx', `${x}px`);
      card.style.setProperty('--gy', `${y}px`);
      card.style.backgroundImage = `
        radial-gradient(circle 200px at var(--gx) var(--gy),
          rgba(14,165,233,0.06) 0%, transparent 70%),
        ${getComputedStyle(card).backgroundImage.split(',').slice(1).join(',')}
      `.replace(/,\s*,/g, ',');
    });

    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   DATOS: PÁGINAS DE MUESTRA POR TIPO DE NEGOCIO
═══════════════════════════════════════════════════════════ */
const demosData = [
  {
    emoji: '🧑‍🔧',
    name: 'Servicios personales',
    items: [
      { name: 'Barberías',                            slug: 'barberia' },
      { name: 'Peluquerías / salones de belleza',     slug: 'peluqueria' },
      { name: 'Centros de estética',                  slug: 'estetica' },
      { name: 'Spa y masajes',                        slug: 'spa' },
      { name: 'Gimnasios y entrenadores personales',  slug: 'gimnasio' },
    ]
  },
  {
    emoji: '☕',
    name: 'Gastronomía',
    items: [
      { name: 'Cafeterías',               slug: 'cafeteria' },
      { name: 'Restaurantes',             slug: 'restaurante' },
      { name: 'Pastelerías y panaderías', slug: 'pasteleria' },
      { name: 'Food trucks',              slug: 'food-truck' },
      { name: 'Servicios de catering',    slug: 'catering' },
    ]
  },
  {
    emoji: '🛍️',
    name: 'Comercio / tiendas',
    items: [
      { name: 'Tiendas de ropa',                slug: 'tienda-ropa' },
      { name: 'Tiendas de tecnología',           slug: 'tienda-tech' },
      { name: 'Librerías',                       slug: 'libreria' },
      { name: 'Tiendas de productos naturales',  slug: 'productos-naturales' },
      { name: 'Tiendas de mascotas',             slug: 'mascotas' },
    ]
  },
  {
    emoji: '🏠',
    name: 'Hogar y construcción',
    items: [
      { name: 'Empresas de construcción',  slug: 'construccion' },
      { name: 'Servicios de gasfitería',   slug: 'gasfiteria' },
      { name: 'Electricistas',             slug: 'electricista' },
      { name: 'Decoración de interiores',  slug: 'decoracion' },
      { name: 'Venta de muebles',          slug: 'muebles' },
    ]
  },
  {
    emoji: '🚗',
    name: 'Automotriz',
    items: [
      { name: 'Talleres mecánicos',     slug: 'taller' },
      { name: 'Lavado de autos',        slug: 'lavado-autos' },
      { name: 'Venta de repuestos',     slug: 'repuestos' },
      { name: 'Compra/venta de autos',  slug: 'compraventa-autos' },
    ]
  },
  {
    emoji: '🏢',
    name: 'Profesionales y empresas',
    items: [
      { name: 'Abogados',                               slug: 'abogado' },
      { name: 'Contadores',                             slug: 'contador' },
      { name: 'Consultores',                            slug: 'consultor' },
      { name: 'Agencias de marketing',                  slug: 'agencia-marketing' },
      { name: 'Diseñadores gráficos / freelancers',     slug: 'disenador' },
    ]
  },
  {
    emoji: '🏥',
    name: 'Salud',
    items: [
      { name: 'Clínicas',        slug: 'clinica' },
      { name: 'Dentistas',       slug: 'dentista' },
      { name: 'Psicólogos',      slug: 'psicologo' },
      { name: 'Nutricionistas',  slug: 'nutricionista' },
      { name: 'Centros médicos', slug: 'centro-medico' },
    ]
  },
  {
    emoji: '🧑‍🏫',
    name: 'Educación',
    items: [
      { name: 'Institutos',             slug: 'instituto' },
      { name: 'Academias de idiomas',   slug: 'academia-idiomas' },
      { name: 'Clases particulares',    slug: 'clases-particulares' },
      { name: 'Cursos online',          slug: 'cursos-online' },
    ]
  },
  {
    emoji: '🏨',
    name: 'Turismo y alojamiento',
    items: [
      { name: 'Hoteles',            slug: 'hotel' },
      { name: 'Hostales',           slug: 'hostal' },
      { name: 'Cabañas',            slug: 'cabanas' },
      { name: 'Agencias de viajes', slug: 'agencia-viajes' },
      { name: 'Tours',              slug: 'tours' },
    ]
  },
  {
    emoji: '📦',
    name: 'Otros',
    items: [
      { name: 'Delivery de comida o productos',             slug: 'delivery' },
      { name: 'Emprendimientos (productos artesanales)',    slug: 'emprendimiento' },
      { name: 'Negocios con reservas (canchas, eventos)',   slug: 'reservas' },
    ]
  },
];

/* ═══════════════════════════════════════════════════════════
   MODAL: PÁGINAS DE MUESTRA
═══════════════════════════════════════════════════════════ */
function initDemos() {
  const openBtn   = document.getElementById('open-demos');
  const overlay   = document.getElementById('demos-overlay');
  const closeBtn  = document.getElementById('demos-close');
  const backdrop  = document.getElementById('demos-backdrop');
  const searchEl  = document.getElementById('demos-search');
  const clearBtn  = document.getElementById('demos-search-clear');
  const catList   = document.getElementById('demos-categories');
  const noResults = document.getElementById('demos-no-results');
  const noQuery   = document.getElementById('demos-no-query');

  if (!openBtn || !overlay || !catList) return;

  const ARROW_EXT = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>`;

  /* ── Render categories ── */
  demosData.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'demos-category';
    section.dataset.catName = cat.name.toLowerCase();

    const itemsHTML = cat.items.map(item => `
      <a
        href="demos/${item.slug}.html"
        target="_blank"
        rel="noopener noreferrer"
        class="demos-item"
        data-name="${item.name.toLowerCase()}"
      >${escHtml(item.name)}${ARROW_EXT}</a>
    `).join('');

    section.innerHTML = `
      <div class="demos-category-header">
        <span class="demos-category-emoji" aria-hidden="true">${cat.emoji}</span>
        <span class="demos-category-name">${escHtml(cat.name)}</span>
      </div>
      <div class="demos-items-grid">${itemsHTML}</div>
    `;

    catList.appendChild(section);
  });

  /* ── Add cursor hover for dynamic elements ── */
  const ring = document.getElementById('c-ring');
  if (ring) {
    catList.querySelectorAll('.demos-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
    [closeBtn, clearBtn].forEach(el => {
      if (!el) return;
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ── Open / close ── */
  function openModal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchEl && searchEl.focus(), 300);
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (searchEl) {
      searchEl.value = '';
      clearBtn.style.display = 'none';
    }
    filterItems('');
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* ── Search / filter ── */
  function filterItems(q) {
    const query = q.toLowerCase().trim();
    let anyVisible = false;

    catList.querySelectorAll('.demos-category').forEach(catEl => {
      let catHasVisible = false;
      const catName = catEl.dataset.catName || '';

      catEl.querySelectorAll('.demos-item').forEach(item => {
        const match = !query
          || item.dataset.name.includes(query)
          || catName.includes(query);
        item.classList.toggle('hidden', !match);
        if (match) catHasVisible = true;
      });

      catEl.classList.toggle('all-hidden', !catHasVisible);
      if (catHasVisible) anyVisible = true;
    });

    if (noResults) {
      noResults.classList.toggle('visible', !anyVisible);
      if (noQuery) noQuery.textContent = query;
    }
  }

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      const q = searchEl.value;
      clearBtn.style.display = q ? 'flex' : 'none';
      filterItems(q);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchEl.value = '';
      clearBtn.style.display = 'none';
      filterItems('');
      searchEl.focus();
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
function init() {
  renderProjects();
  initDemos();

  initCursor();
  initSpotlight();
  initNav();
  initParallax();
  initHeroCanvas();
  initContactCanvas();
  initRipples();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initScrollReveal();
      initCardGlow();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
