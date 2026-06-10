/* ===================================================
   SARATHI U — Portfolio JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 1800);
  });

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark'
      ? '<i class="ri-sun-fill"></i>'
      : '<i class="ri-moon-fill"></i>';
  }

  // ===== CUSTOM CURSOR =====
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX - 4 + 'px';
    cursorDot.style.top = mouseY - 4 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .contact-item, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

  // ===== PARTICLE CANVAS =====
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 120;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      const theme = html.getAttribute('data-theme');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'dark' ? 'rgba(108,99,255,0.5)' : 'rgba(79,70,229,0.35)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    const theme = html.getAttribute('data-theme');
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = theme === 'dark'
            ? `rgba(108,99,255,${opacity})`
            : `rgba(79,70,229,${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== TYPING EFFECT =====
  const typedEl = document.getElementById('typed-text');
  const roles = [
    'Full Stack Developer',
    'Vibe Coder',
    'Problem Solver'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function typeRole() {
    const current = roles[roleIdx];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
      setTimeout(typeRole, 80);
    } else {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeRole, 400);
        return;
      }
      setTimeout(typeRole, 40);
    }
  }
  setTimeout(typeRole, 2200);

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ===== NAV DOTS ACTIVE TRACKING =====
  const sections = document.querySelectorAll('section');
  const navDots = document.querySelectorAll('.nav-dot');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navDots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.nav-dot[data-section="${entry.target.id}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionObserver.observe(s));

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.getAttribute('data-section');
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ===== ACHIEVEMENT COUNTER =====
  const counterEls = document.querySelectorAll('.achieve-num');
  let counterDone = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterDone) {
        counterDone = true;
        counterEls.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          const suffix = '+';
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 16);
        });
      }
    });
  }, { threshold: 0.3 });
  if (counterEls.length) counterObserver.observe(counterEls[0]);

  // ===== TIMELINE ANIMATION =====
  const timelineLine = document.getElementById('timelineLine');
  const timelineSection = document.getElementById('experience');
  if (timelineLine && timelineSection) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineLine.style.height = '100%';
          document.querySelectorAll('.timeline-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('active'), i * 400);
          });
        }
      });
    }, { threshold: 0.2 });
    tlObserver.observe(timelineSection);
  }

  // ===== COPY TO CLIPBOARD =====
  const toast = document.getElementById('toast');
  document.querySelectorAll('.contact-item[data-copy]').forEach(item => {
    item.addEventListener('click', () => {
      const text = item.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      });
    });
  });

  // ===== 3D TILT ON PROJECT CARDS =====
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

});
