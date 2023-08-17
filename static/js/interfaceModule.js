const InterfaceModule = (function () {

    // Metadata functionalities
    const form = document.querySelector(".metadata-form");
    const accordionHeaders = document.querySelectorAll(".metadata-accordion-header");
    
    accordionHeaders.forEach(accordionHeader => {
        accordionHeader.addEventListener("click", function () {
            const accordionContent = this.nextElementSibling;
            accordionContent.classList.toggle("is-hidden");
        });
    });

    function handleAddButtonClick(field) {
        return function (event) {
            const inputGroup = document.querySelector(`.${field}-input-group`);
            const additionalContainer = document.querySelector(`.additional-${field}`);

            if (event.target.classList.contains(`add-${field}-button`)) {
                const clone = inputGroup.cloneNode(true);
                clone.querySelector(`.metadata-${field}`).value = "";
                const removeButton = document.createElement("span");
                removeButton.classList.add("button", "is-danger", "is-light", `remove-${field}-button`);
                const minusIcon = document.createElement("i");
                minusIcon.classList.add("fa-solid", "fa-minus");
                removeButton.appendChild(minusIcon);
                clone.appendChild(removeButton);
                additionalContainer.appendChild(clone);
                clone.querySelector(`.add-${field}-button`).remove();
            }
        };
    }

    function handleRemoveButtonClick(field) {
        return function (event) {
            const removeButton = event.target;
            if (removeButton.classList.contains(`remove-${field}-button`)) {
                const inputGroup = removeButton.closest(`.${field}-input-group`);
                inputGroup.remove();
            }
        };
    }

    function initializeAddButtons(field) {
        const addButtons = form.querySelectorAll(`.add-${field}-button`);
        addButtons.forEach(addButton => {
            addButton.addEventListener("click", handleAddButtonClick(field));
        });
    }

    function initializeRemoveButtons(field) {
        form.addEventListener("click", handleRemoveButtonClick(field));
    }

    initializeAddButtons("title");
    initializeAddButtons("responsibility");
    initializeAddButtons("pubAuthority");
    initializeAddButtons("identifier");
    initializeAddButtons("source");
    initializeAddButtons("language");
    initializeAddButtons("category");

    initializeRemoveButtons("title");
    initializeRemoveButtons("responsibility");
    initializeRemoveButtons("pubAuthority");
    initializeRemoveButtons("identifier");
    initializeRemoveButtons("source");
    initializeRemoveButtons("language");
    initializeRemoveButtons("category");

})();

export { InterfaceModule }
