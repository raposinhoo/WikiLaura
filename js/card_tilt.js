/* ══════════════════════════════════════════════════
   card_tilt.js — WikiLaura
   Efeito de inclinação 3D tipo carta Pokémon holográfica.
   Leve: só requestAnimationFrame + transform CSS.
   ══════════════════════════════════════════════════ */

(function () {
  const TILT_MAX   = 18;   // graus máximos de inclinação
  const SCALE_HVR  = 1.06; // scale no hover
  const LERP       = 0.12; // suavização (0 = instantâneo, 1 = nunca chega)

  const cards = document.querySelectorAll(
    '#artigo1-tag, #artigo2-tag, #artigo3-tag, #artigo4-tag'
  );

  cards.forEach(card => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let isHovered = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      currentX = lerp(currentX, targetX, LERP);
      currentY = lerp(currentY, targetY, LERP);

      const diffX = Math.abs(currentX - targetX);
      const diffY = Math.abs(currentY - targetY);

      card.style.transform = isHovered
        ? `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(${SCALE_HVR})`
        : `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(1)`;

      // Para o loop quando chega perto o suficiente
      if (diffX > 0.01 || diffY > 0.01) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    function startTick() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      // normaliza -1 a 1
      const nx = (e.clientX - cx) / (rect.width  / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);

      targetY =  nx * TILT_MAX;
      targetX = -ny * TILT_MAX;

      startTick();
    }, { passive: true });

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      startTick();
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      startTick();
    });
  });
})();