// Progress UI removed — no dynamic progress rendering.


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
