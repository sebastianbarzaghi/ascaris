const ModalModule = (function () {
  // Functions to open and close a modal

  function closeModal(el) {
    el.classList.remove('is-active');
  }

  function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      closeModal(modal);
    });
  }

  /*
  // Add a click event on buttons to open a specific modal
  const referenceButtons = document.querySelectorAll('.reference');
  referenceButtons.forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', () => {
      openModal(target);
    });
  });
  */

  // Add a click event on various child elements to close the parent modal
  const closeElements = document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete');
  closeElements.forEach((close) => {
    const target = close.closest('.modal');

    close.addEventListener('click', () => {
      closeModal(target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      closeAllModals();
    }
  });

  // Additional click event listener for modal close buttons
  const modalCloseButtons = document.querySelectorAll(".modal-close");
  modalCloseButtons.forEach(function (closeButton) {
    closeButton.addEventListener("click", function () {
      closeAllModals();
    });
  });


  const annotationHeaders = document.querySelectorAll('.annotation-header');

  // Initial state: content is hidden, and the icon is "fa-angle-down"
  let isContentVisible = false;

  annotationHeaders.forEach((annotationHeader) => {
    annotationHeader.addEventListener('click', () => {
      const annotationContent = annotationHeader.nextElementSibling;
      const iconToggle = annotationHeader.querySelector('.annotation-icon');
      // Toggle the visibility of the content
      isContentVisible = !isContentVisible;
      
      if (isContentVisible) {
        annotationContent.style.display = 'block';
        // Change the icon to "fa-angle-up"
        iconToggle.classList.remove('fa-angle-down');
        iconToggle.classList.add('fa-angle-up');
      } else {
        annotationContent.style.display = 'none';
        // Change the icon back to "fa-angle-down"
        iconToggle.classList.remove('fa-angle-up');
        iconToggle.classList.add('fa-angle-down');
      }
    });
  })


})();

export { ModalModule };
