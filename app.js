// Progress UI removed — no dynamic progress rendering.


// Modal: abrir/fechar com foco e Escape
(() => {
  // Get the modal element by its ID
  const modal = document.getElementById('cert-modal');
  // Get the modal overlay element
  const modalOverlay = modal && modal.querySelector('.modal-overlay');
  // Get all elements inside the modal that have the 'data-close' attribute
  const closeButtons = modal && modal.querySelectorAll('[data-close]');
  // Get the call-to-action element
  const cta = document.querySelector('.cta');
  // Store the last focused element before the modal was opened
  let lastFocus = null;

  // Function to open the modal
  function openModal() {
    // If the modal element doesn't exist, exit the function
    if (!modal) return;
    // Store the currently focused element
    lastFocus = document.activeElement;
    // Set the 'aria-hidden' attribute of the modal to 'false', making it visible
    modal.setAttribute('aria-hidden', 'false');
    // Focus on the close button
    const closeBtn = modal.querySelector('.modal-close');
    // If the close button exists, focus on it
    if (closeBtn) closeBtn.focus();
    // Add a keydown event listener to the document
    document.addEventListener('keydown', onKeyDown);
    // Trap the focus within the modal
    trapFocus(modal);
  }

  // Function to close the modal
  function closeModal() {
    // If the modal element doesn't exist, exit the function
    if (!modal) return;
    // Set the 'aria-hidden' attribute of the modal to 'true', hiding it
    modal.setAttribute('aria-hidden', 'true');
    // Remove the keydown event listener from the document
    document.removeEventListener('keydown', onKeyDown);
    // If there was a last focused element, focus on it
    if (lastFocus) lastFocus.focus();
  }

  // Function to handle keydown events
  function onKeyDown(e) {
    // If the pressed key is 'Escape', close the modal
    if (e.key === 'Escape') closeModal();
  }

  // Function to trap focus within a given dialog element
  function trapFocus(dialog) {
    // Find all focusable elements within the dialog
    const focusable = dialog.querySelectorAll('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])');
    // Get the first focusable element
    const first = focusable[0];
    // Get the last focusable element
    const last = focusable[focusable.length - 1];
    // If there are no focusable elements, exit the function
    if (!first) return;
    function handle(e) {
    // If the key pressed is not 'Tab', exit the function
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    // Add a keydown event listener to the dialog
    dialog.addEventListener('keydown', handle);
  }

  // If the call-to-action element exists
  if (cta) {
    // Add a click event listener to the call-to-action element
    cta.addEventListener('click', function (e) {
      // Prevent the default action
      e.preventDefault();
      // Open the modal
      openModal();
    });
  }

  // If the modal overlay element exists, add a click event listener to close the modal
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  // For each close button, add a click event listener to close the modal
  if (closeButtons) closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
})();
