/* ══════════════════════════════════════════════════
   lightbox.js — WikiLaura
   clique em imagens da galeria para focar no centro
   ══════════════════════════════════════════════════ */

(function () {
  // ── Injetar CSS do lightbox ───────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #lb-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    #lb-overlay.active {
      opacity: 1;
      pointer-events: all;
    }

    #lb-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 90vw;
      max-height: 90vh;
    }

    #lb-img {
      display: block;
      max-width: 88vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 2px;
      box-shadow: 0 8px 60px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.5);
      transform: scale(0.92);
      transition: transform 0.25s cubic-bezier(0.23, 1, 0.32, 1);
      cursor: default;
    }

    #lb-overlay.active #lb-img {
      transform: scale(1);
    }

    #lb-close {
      position: absolute;
      top: -14px;
      right: -14px;
      width: 30px;
      height: 30px;
      background: var(--accent2, #ff4cf7);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      color: #000;
      font-weight: 700;
      line-height: 1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: transform 0.15s ease, background 0.15s ease;
      z-index: 2;
    }

    #lb-close:hover {
      transform: scale(1.15) rotate(90deg);
      background: #fff;
    }

    #lb-prev,
    #lb-next {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      font-family: 'Space Mono', monospace;
      font-size: 1.1rem;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, border-color 0.15s;
      z-index: 100000;
    }

    #lb-prev { left: 20px; }
    #lb-next { right: 20px; }

    #lb-prev:hover,
    #lb-next:hover {
      background: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.35);
    }

    #lb-prev.hidden,
    #lb-next.hidden {
      opacity: 0;
      pointer-events: none;
    }

    #lb-counter {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Space Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.4);
    }
  `;
  document.head.appendChild(style);

  // ── Criar elementos do lightbox ───────────────────
  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';

  const wrap = document.createElement('div');
  wrap.id = 'lb-wrap';

  const img = document.createElement('img');
  img.id = 'lb-img';
  img.alt = '';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'lb-close';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Fechar');

  const prevBtn = document.createElement('button');
  prevBtn.id = 'lb-prev';
  prevBtn.innerHTML = '‹';
  prevBtn.setAttribute('aria-label', 'Anterior');

  const nextBtn = document.createElement('button');
  nextBtn.id = 'lb-next';
  nextBtn.innerHTML = '›';
  nextBtn.setAttribute('aria-label', 'Próxima');

  const counter = document.createElement('div');
  counter.id = 'lb-counter';

  wrap.appendChild(closeBtn);
  wrap.appendChild(img);
  overlay.appendChild(wrap);
  overlay.appendChild(prevBtn);
  overlay.appendChild(nextBtn);
  overlay.appendChild(counter);
  document.body.appendChild(overlay);

  // ── Estado ────────────────────────────────────────
  let images = [];
  let current = 0;

  function getGalleryImages() {
    const galeria = document.getElementById('galeria');
    if (!galeria) return [];
    return Array.from(galeria.querySelectorAll('img'));
  }

  function open(index) {
    images = getGalleryImages();
    if (!images.length) return;

    current = Math.max(0, Math.min(index, images.length - 1));
    show();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function show() {
    img.style.transform = 'scale(0.92)';
    img.src = images[current].src;
    img.alt = images[current].alt || '';

    requestAnimationFrame(() => {
      img.style.transition = 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)';
      img.style.transform = 'scale(1)';
    });

    counter.textContent = `${current + 1} / ${images.length}`;
    prevBtn.classList.toggle('hidden', current === 0);
    nextBtn.classList.toggle('hidden', current === images.length - 1);
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { img.src = ''; }, 200);
  }

  function prev() {
    if (current > 0) { current--; show(); }
  }

  function next() {
    if (current < images.length - 1) { current++; show(); }
  }

  // ── Eventos ───────────────────────────────────────
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // clica fora da imagem para fechar
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // teclado
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // ── Inicializar cliques nas imagens da galeria ────
  function initGallery() {
    const imgs = getGalleryImages();
    imgs.forEach((el, i) => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => open(i));
    });
  }

  // Roda após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();