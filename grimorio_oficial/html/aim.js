(() => {
  'use strict';
  const reticle = document.createElement('div');
  reticle.id = 'magic-aim';
  reticle.hidden = true;
  reticle.setAttribute('aria-hidden', 'true');
  const dot = document.createElement('span');
  dot.className = 'magic-aim-dot';
  const title = document.createElement('span');
  title.className = 'magic-aim-title';
  const hint = document.createElement('span');
  hint.className = 'magic-aim-hint';
  hint.textContent = 'Clique para conjurar · botão direito para cancelar';
  reticle.append(dot, title, hint);
  document.body.append(reticle);
  addEventListener('message', event => {
    const data = event.data;
    if (data?.action !== 'aim') return;
    reticle.hidden = data.visible !== true;
    title.textContent = typeof data.label === 'string' ? data.label : '';
    if (Array.isArray(data.color) && data.color.length === 3) {
      const rgb = data.color.map(v => Math.max(0, Math.min(255, Number(v) || 0)));
      reticle.style.setProperty('--magic-color', rgb.join(','));
    }
  });
})();
