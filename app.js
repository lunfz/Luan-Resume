// Busca os dados do JSON e gera as barras de progresso com rótulos e animação
fetch('data/progress.json')
  .then(response => {
    if (!response.ok) throw new Error('Resposta não ok: ' + response.status);
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('progress-container');
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p class="muted">Nenhuma certificação encontrada.</p>';
      return;
    }

    data.forEach((cert, index) => {
      const card = document.createElement('article');
      card.className = 'cert-card';

      // topo com badge + título
      const top = document.createElement('div');
      top.className = 'card-top';

      if (cert.badge) {
        const img = document.createElement('img');
        img.src = cert.badge;
        img.alt = (cert.title || 'Certificação') + ' badge';
        img.className = 'cert-badge';
        top.appendChild(img);
      }

      const title = document.createElement('div');
      title.className = 'cert-title';
      title.textContent = cert.title || 'Sem título';
      top.appendChild(title);

      // percent text
      const percent = Math.max(0, Math.min(100, Number(cert.progress) || 0));
      const percentEl = document.createElement('div');
      percentEl.className = 'percent';
      percentEl.textContent = percent + '%';

      // mini bar
      const miniBar = document.createElement('div');
      miniBar.className = 'cert-mini-bar';
      const miniInner = document.createElement('div');
      miniInner.className = 'cert-mini-bar-inner';
      miniBar.appendChild(miniInner);

      card.appendChild(top);
      card.appendChild(percentEl);
      card.appendChild(miniBar);

      container.appendChild(card);

      // animação com delay por índice
      miniInner.style.transitionDelay = (index * 0.18) + 's';
      requestAnimationFrame(() => requestAnimationFrame(() => miniInner.style.width = percent + '%'));
    });
  })
  .catch(err => {
    console.error('Erro ao carregar progress.json:', err);
    const container = document.getElementById('progress-container');
    if (container) container.innerHTML = '<p class="muted">Erro ao carregar dados.</p>';
  });

// Modal: abrir/fechar com foco e Escape
(() => {
  const modal = document.getElementById('cert-modal');
  const modalOverlay = modal && modal.querySelector('.modal-overlay');
  const closeButtons = modal && modal.querySelectorAll('[data-close]');
  const cta = document.querySelector('.cta');
  let lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    // focus no botão de fechar
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeyDown);
    trapFocus(modal);
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocus) lastFocus.focus();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  function trapFocus(dialog) {
    const focusable = dialog.querySelectorAll('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) return;
    function handle(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    dialog.addEventListener('keydown', handle);
  }

  if (cta) {
    cta.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  }

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (closeButtons) closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
})();
