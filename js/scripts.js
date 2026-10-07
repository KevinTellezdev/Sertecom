/* ═══════════════════════════════════════════════
   SERTECOM — scripts.js
   Transiciones, animaciones e interactividad
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────
  // 1. CURSOR PERSONALIZADO
  // ─────────────────────────────────────
  const cursor     = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursor.className     = 'cursor';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursor, cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Ring sigue al cursor con inercia
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover en elementos clicables
  document.querySelectorAll('a, button, .servicio-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorRing.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorRing.classList.remove('hover');
    });
  });


  // ─────────────────────────────────────
  // 2. NAVBAR — SCROLL Y SHRINK
  // ─────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  // ─────────────────────────────────────
  // 3. MENÚ HAMBURGER (MOBILE)
  // ─────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });


  // ─────────────────────────────────────
  // 4. SCROLL SUAVE
  // ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ─────────────────────────────────────
  // 5. INTERSECTION OBSERVER — ANIMACIONES DE ENTRADA
  // ─────────────────────────────────────
  const animItems = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  animItems.forEach(el => observer.observe(el));


  // ─────────────────────────────────────
  // 6. CONTADORES ANIMADOS EN HERO STATS
  // ─────────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800; // ms
      const start    = performance.now();

      function easeOut(t) {
        return 1 - Math.pow(1 - t, 3); // cúbico
      }

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value    = Math.round(easeOut(progress) * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  // ─────────────────────────────────────
  // 7. PARTÍCULAS EN HERO
  // ─────────────────────────────────────
  const container = document.getElementById('particles');
  const TOTAL = 30;

  for (let i = 0; i < TOTAL; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size    = Math.random() * 3 + 2;
    const left    = Math.random() * 100;
    const delay   = Math.random() * 10;
    const dur     = Math.random() * 8 + 6;
    const bottom  = Math.random() * 40;

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      bottom:${bottom}%;
      animation-delay:${delay}s;
      animation-duration:${dur}s;
      opacity:0;
    `;
    container.appendChild(p);
  }


  // ─────────────────────────────────────
  // 8. EFECTO MAGNÉTICO EN CARDS DE SERVICIOS
  // ─────────────────────────────────────
  document.querySelectorAll('.servicio-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });


  // ─────────────────────────────────────
  // 9. PARALLAX SUAVE EN HERO GRID
  // ─────────────────────────────────────
  const heroGrid = document.querySelector('.hero-grid');
  const heroBg   = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroGrid) heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
    if (heroBg)   heroBg.style.transform   = `translateY(${scrollY * 0.15}px)`;
  }, { passive: true });


  // ─────────────────────────────────────
  // 10. GLITCH EFFECT EN EL LOGO (HOVER)
  // ─────────────────────────────────────
  const logo = document.querySelector('.logo');

  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.style.animation = 'glitch 0.4s steps(2, end) 2';
    });
    logo.addEventListener('animationend', () => {
      logo.style.animation = '';
    });
  }

  // Agregar keyframes de glitch dinámicamente
  const glitchCSS = `
    @keyframes glitch {
      0%   { clip-path: inset(0 0 90% 0); transform: translateX(-2px); }
      20%  { clip-path: inset(30% 0 50% 0); transform: translateX(2px); }
      40%  { clip-path: inset(60% 0 20% 0); transform: translateX(-1px); color: #7DC31F; }
      60%  { clip-path: inset(10% 0 80% 0); transform: translateX(3px); }
      80%  { clip-path: inset(70% 0 10% 0); transform: translateX(-2px); }
      100% { clip-path: none; transform: translateX(0); }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = glitchCSS;
  document.head.appendChild(styleEl);


  // ─────────────────────────────────────
  // 11. BOTÓN WHATSAPP — ENVÍO CON VALIDACIÓN
  // ─────────────────────────────────────
  const btnSubmit = document.getElementById('btnSubmit');

  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const nombre   = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const servicio = document.getElementById('servicio').value;
      const mensaje  = document.getElementById('mensaje').value.trim();

      // Validación mínima
      if (!nombre) {
        shakeCampo('nombre');
        return;
      }

      // Animación de éxito en botón
      const btnText = btnSubmit.querySelector('.btn-text');
      btnText.textContent = 'Abriendo WhatsApp...';
      btnSubmit.style.background = '#5a9015';

      setTimeout(() => {
        btnText.textContent = 'Enviar por WhatsApp';
        btnSubmit.style.background = '';
      }, 3000);

      // Armar mensaje
      let texto = `¡Hola Sertecom! Soy *${nombre || 'Cliente'}*`;
      if (telefono) texto += ` | Tel: ${telefono}`;
      if (servicio) texto += `\n📌 Servicio: *${servicio}*`;
      if (mensaje)  texto += `\n💬 ${mensaje}`;
      texto += `\n\n_Mensaje enviado desde la web_`;

      window.open('https://wa.me/573144226388?text=' + encodeURIComponent(texto), '_blank');
    });
  }

  // Shake en campo inválido
  function shakeCampo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#e74c3c';
    el.style.animation   = 'shake 0.4s ease';

    const shakeCSS = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
      }
    `;
    if (!document.getElementById('shakeStyle')) {
      const s = document.createElement('style');
      s.id = 'shakeStyle';
      s.textContent = shakeCSS;
      document.head.appendChild(s);
    }

    setTimeout(() => {
      el.style.borderColor = '';
      el.style.animation   = '';
    }, 600);

    el.focus();
  }


  // ─────────────────────────────────────
  // 12. TYPING EFFECT EN EL SLOGAN
  // ─────────────────────────────────────
  const slogan = document.querySelector('.slogan');

  if (slogan) {
    const texto    = slogan.textContent;
    slogan.textContent = '';
    slogan.style.borderLeft = '3px solid #7DC31F';
    let i = 0;

    function typeSlogan() {
      if (i < texto.length) {
        slogan.textContent += texto[i];
        i++;
        setTimeout(typeSlogan, 40 + Math.random() * 20);
      } else {
        // cursor parpadeante al final
        slogan.innerHTML += '<span class="blink">|</span>';
        const blinkCSS = `
          .blink { animation: blink 1s step-end infinite; color: #7DC31F; }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `;
        const s = document.createElement('style');
        s.textContent = blinkCSS;
        document.head.appendChild(s);
      }
    }

    // Iniciar después de 800ms para que aparezca el hero primero
    setTimeout(typeSlogan, 800);
  }


  // ─────────────────────────────────────
  // 13. HIGHLIGHT ACTIVO EN NAV AL SCROLL
  // ─────────────────────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--verde)' : '';
      });
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

}); // fin DOMContentLoaded
