/**
 * Função genérica para inicializar um modal.
 * @param {string} modalId - O ID do elemento do modal.
 * @param {string} openTriggerId - O ID do botão que abre o modal.
 */
function initializeModal(modalId, openTriggerId) {
  const modal = document.getElementById(modalId);
  const openTrigger = document.getElementById(openTriggerId);
  
  // Se o modal ou o botão de abrir não existirem, não faz nada.
  if (!modal || !openTrigger) {
    console.error(`Modal ou gatilho não encontrado para: ${modalId}, ${openTriggerId}`);
    return;
  }
  
  const closeTriggers = modal.querySelectorAll('[data-close]');
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('[data-close]').focus(); // Foca no primeiro elemento de fechar (botão X)
    document.addEventListener('keydown', onKeyDown);
    trapFocus(modal);
  }

  function closeModal() {
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

  openTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeTriggers.forEach(trigger => {
    trigger.addEventListener('click', closeModal);
  });
}

// Inicializa os dois modais quando o documento estiver pronto.
document.addEventListener('DOMContentLoaded', () => {
  initializeModal('cert-modal', 'cert-cta');
  initializeModal('projects-modal', 'projects-cta');
});
