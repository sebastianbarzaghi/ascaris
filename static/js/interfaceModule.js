const InterfaceModule = (function () {

    // Metadata functionalities
    const form = document.querySelector(".metadata-form");
    const accordionHeaders = document.querySelectorAll(".metadata-accordion-header");

    const addTitleButton = form.querySelector(".add-title-button");
    const addResponsibilityButton = form.querySelector(".add-responsibility-button");
    const addPubAuthorityButton = form.querySelector(".add-publication-authority-button");
    const addIdentifierButton = form.querySelector(".add-identifier-button");

    const titleInputGroup = form.querySelector(".title-input-group");
    const responsibilitiesInputGroup = form.querySelector(".responsibility-input-group");
    const pubAuthoritiesInputGroup = form.querySelector(".publication-authority-input-group");
    const identifierInputGroup = form.querySelector(".identifier-input-group");

    const additionalTitlesContainer = form.querySelector(".additional-titles");
    const additionalResponsibilitiesContainer = form.querySelector(".additional-responsibilities");
    const additionalPubAuthoritiesContainer = form.querySelector(".additional-publication-authorities");
    const additionalIdentifierContainer = form.querySelector(".additional-identifiers");

    accordionHeaders.forEach(accordionHeader => {
        accordionHeader.addEventListener("click", function () {
            const accordionContent = this.nextElementSibling;
            accordionContent.classList.toggle("is-hidden");
        });
    });

    addTitleButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-title-button")) {
            const clone = titleInputGroup.cloneNode(true);
            clone.querySelector(".metadata-title").value = "";
            const removeButton = document.createElement("button");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-title-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalTitlesContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-title-button").remove();
        }
    });

    addResponsibilityButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-responsibility-button")) {
            const clone = responsibilitiesInputGroup.cloneNode(true);
            clone.querySelector(".metadata-full-name").value = "";
            const removeButton = document.createElement("button");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-responsibility-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalResponsibilitiesContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-responsibility-button").remove();
        }
    });

    addPubAuthorityButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-publication-authority-button")) {
            const clone = pubAuthoritiesInputGroup.cloneNode(true);
            clone.querySelector(".metadata-publication-authority").value = "";
            const removeButton = document.createElement("button");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-publication-authority-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalPubAuthoritiesContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-publication-authority-button").remove();
        }
    });

    addIdentifierButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-identifier-button")) {
            const clone = identifierInputGroup.cloneNode(true);
            clone.querySelector(".metadata-identifier").value = "";
            const removeButton = document.createElement("button");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-identifier-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalIdentifierContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-identifier-button").remove();
        }
    });

    // Handle remove button click
    form.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-title-button")) {
            event.target.closest(".title-input-group").remove();
        }
        else if (event.target.classList.contains("remove-responsibility-button")) {
            event.target.closest(".responsibility-input-group").remove();
        }
        else if (event.target.classList.contains("remove-publication-authority-button")) {
            event.target.closest(".publication-authority-input-group").remove();
        }
        else if (event.target.classList.contains("remove-identifier-button")) {
            event.target.closest(".identifier-input-group").remove();
        }
    });

})();

export { InterfaceModule }
