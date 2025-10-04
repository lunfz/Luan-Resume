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

    // Render as a vertical list of progress bars to fill the blank area
    data.forEach((cert, index) => {
      const item = document.createElement('div');
      item.className = 'progress-item';

      const label = document.createElement('div');
      label.className = 'progress-label';
      label.textContent = cert.title || 'Sem título';

      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.setAttribute('role', 'progressbar');
      const percent = Math.max(0, Math.min(100, Number(cert.progress) || 0));
      bar.setAttribute('aria-valuenow', String(percent));
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');

      const inner = document.createElement('div');
      inner.className = 'progress-bar-inner';
      inner.style.width = '0%';
      // keep accessible text at the end of the bar
      const pctText = document.createElement('span');
      pctText.className = 'percent';
      pctText.textContent = percent + '%';

      // optional badge
      if (cert.badge) {
        const img = document.createElement('img');
        img.src = cert.badge;
        img.alt = (cert.title || 'Certificação') + ' badge';
        img.className = 'cert-badge';
        item.appendChild(img);
      }

      inner.appendChild(pctText);
      bar.appendChild(inner);
      item.appendChild(label);
      item.appendChild(bar);
      container.appendChild(item);

      // animate with index delay
      inner.style.transitionDelay = (index * 0.12) + 's';
      requestAnimationFrame(() => requestAnimationFrame(() => inner.style.width = percent + '%'));
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
