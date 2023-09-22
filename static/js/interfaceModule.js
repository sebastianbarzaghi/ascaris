const InterfaceModule = (function () {

    // Metadata functionalities
    const content = document.querySelector(".content");
    const documentId = content.getAttribute("data-documentId");
    const form = document.querySelector(".metadata-form");
    const accordionHeaders = document.querySelectorAll(".metadata-accordion-header");
    const fieldCounters = {};
    
    accordionHeaders.forEach(accordionHeader => {
        accordionHeader.addEventListener("click", function () {
            const accordionContent = this.nextElementSibling;
            accordionContent.classList.toggle("is-hidden");
        });
    });


    function handleAddButtonClick(field, subfields) {
        return function (event) {
            const inputGroup = document.querySelector(`.${field}-input-group`);
            const additionalContainer = document.querySelector(`.additional-${field}`);

            if (!fieldCounters[field]) {
                fieldCounters[field] = 1;
            } else {
                fieldCounters[field]++;
            }

            if (event.target.classList.contains(`add-${field}-button`)) {
                const clone = inputGroup.cloneNode(true);
                const currentCounter = fieldCounters[field];
                subfields.forEach((subfield) => {
                    const origId = inputGroup.querySelector(`.metadata-${field}-${subfield}`).id;
                    const origName = inputGroup.querySelector(`.metadata-${field}-${subfield}`).name;
                    clone.querySelector(`.metadata-${field}-${subfield}`).value = "";
                    clone.querySelector(`.metadata-${field}-${subfield}`).id = `${origId}-${currentCounter + 1}`;
                    clone.querySelector(`.metadata-${field}-${subfield}`).name = origName
                })

                const removeButton = document.createElement("span");
                removeButton.classList.add("button", "is-danger", "is-light", `remove-${field}-button`);
                const minusIcon = document.createElement("i");
                minusIcon.classList.add("fa-solid", "fa-minus");
                removeButton.appendChild(minusIcon);
                const row = clone.querySelector('.row');
                row.appendChild(removeButton);
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
                const fieldId = inputGroup.getAttribute('data-field-group-id');
                // Check if the field has an associated database record before attempting to delete
                if (!fieldId) {
                    // If there's no database record, simply remove the field from the front-end
                    inputGroup.remove();
                    if (fieldCounters[field]) {
                        fieldCounters[field]--;
                    }
                } else {
                    // If a database record exists, send a delete request to delete it
                    fetch(`/delete/${field.charAt(0).toUpperCase() + field.slice(1)}/${fieldId}`, {
                        method: 'DELETE',
                    })
                    .then((response) => {
                        if (response.ok) {
                            // If the deletion was successful, remove the field from the front-end
                            inputGroup.remove();
                            if (fieldCounters[field]) {
                                fieldCounters[field]--;
                            }
                        } else {
                            // Handle errors or display a message if deletion fails
                            console.error('Deletion failed');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                }
            }
        };
    }

    function populateSKOSDropdown() {
        const skosSelect = document.getElementById("category-type");
        const store = new window.$rdf.IndexedFormula();
        const fetcher = new window.$rdf.Fetcher(store);
        const skosPath = 'http://127.0.0.1:5000/docta';
        return new Promise((resolve, reject) => {
            fetcher.load(skosPath).then(() => {
                store.each(undefined, undefined, window.$rdf.sym("http://www.w3.org/2004/02/skos/core#Concept")).forEach(concept => {
                    const conceptLabel = store.any(concept, window.$rdf.sym("http://www.w3.org/2004/02/skos/core#prefLabel")).value;
                    //const conceptValue = store.any(concept, window.$rdf.sym("http://www.w3.org/2000/01/rdf-schema#label")).value;
                    const conceptValue = concept.value;
                    const option = document.createElement("option");
                    option.value = conceptValue;
                    option.textContent = conceptLabel;
                    skosSelect.appendChild(option);
                });
                resolve();
            });
        });
    };


    function cloneMetadataField(field, subfields, data) {

        const inputGroup = document.querySelector(`.${field}-input-group`);
        const additionalContainer = document.querySelector(`.additional-${field}`);

        if (!fieldCounters[field]) {
            fieldCounters[field] = 1;
        } else {
            fieldCounters[field]++;
        }
        
        const clone = inputGroup.cloneNode(true);
        const currentCounter = fieldCounters[field];
        clone.setAttribute("data-field-group-id", `${currentCounter + 1}`)

        let index = 0;
        subfields.forEach((subfield) => {
            const origId = inputGroup.querySelector(`.metadata-${field}-${subfield}`).id;
            const origName = inputGroup.querySelector(`.metadata-${field}-${subfield}`).name;
            clone.querySelector(`.metadata-${field}-${subfield}`).value = data[subfield] ;
            clone.querySelector(`.metadata-${field}-${subfield}`).id = `${origId}-${currentCounter + 1}`;
            clone.querySelector(`.metadata-${field}-${subfield}`).name = origName
            index++;
        })

        const removeButton = document.createElement("span");
        removeButton.classList.add("button", "is-danger", "is-light", `remove-${field}-button`);
        const minusIcon = document.createElement("i");
        minusIcon.classList.add("fa-solid", "fa-minus");
        removeButton.appendChild(minusIcon);
        const row = clone.querySelector('.row');
        row.appendChild(removeButton);
        additionalContainer.appendChild(clone);
        clone.querySelector(`.add-${field}-button`).remove();
    }

    
    
    function fetchExistingDataAndPopulate(documentId) {
        populateSKOSDropdown().then(() => {
            fetch(`/get_existing_data/${documentId}`)
            .then(response => response.json())
            .then(data => {
                // Populate main form fields with existing data
    
                const titles = data.title;
                let index = 0;
                titles.forEach((title) => {
                    if (index === 0) {
                        const titleInput = document.querySelector('.metadata-title-text');
                        const titleLang = document.querySelector('.metadata-title-language');
                        titleInput.value = title.text;
                        for (const option of titleLang.options) {
                            if (option.value === title.language) {
                                option.selected = true;
                                break;
                            }
                        };
                    }
                    else {
                        cloneMetadataField("title", ["text", "language"], title);
                    }
                    index++;
                })

                const responsibilities = data.responsibility;
                let index2 = 0;
                responsibilities.forEach((responsibility) => {
                    if (index2 === 0) {
                        const respSurname = document.querySelector('.metadata-responsibility-surname');
                        const respName = document.querySelector('.metadata-responsibility-name');
                        const respAuthority = document.querySelector('.metadata-responsibility-authority');
                        const respRole = document.querySelector('.metadata-responsibility-role');
                        respSurname.value = responsibility.surname;
                        respName.value = responsibility.name;
                        respAuthority.value = responsibility.authority;
                        for (const option of respRole.options) {
                            if (option.value === responsibility.role) {
                                option.selected = true;
                                break;
                            }
                        };
                    }
                    else {
                        cloneMetadataField("responsibility", ["surname", "name", "authority", "role"], responsibility);
                    }
                    index2++;
                })

                const pubAuthorities = data.pubAuthority;
                let index3 = 0;
                pubAuthorities.forEach((pubAuthority) => {
                    if (index3 === 0) {
                        const pubAuthorityName = document.querySelector('.metadata-pubAuthority-name');
                        const pubAuthorityAuthority = document.querySelector('.metadata-pubAuthority-authority');
                        const pubAuthorityRole = document.querySelector('.metadata-pubAuthority-role');
                        pubAuthorityName.value = pubAuthority.name;
                        pubAuthorityAuthority.value = pubAuthority.authority;
                        for (const option of pubAuthorityRole.options) {
                            if (option.value === pubAuthority.role) {
                                option.selected = true;
                                break;
                            }
                        };
                    }
                    else {
                        cloneMetadataField("pubAuthority", ["name", "authority", "role"], pubAuthority);
                    }
                    index3++;
                })

                const identifiers = data.identifier;
                let index4 = 0;
                identifiers.forEach((identifier) => {
                    if (index4 === 0) {
                        const identText = document.querySelector('.metadata-identifier-text');
                        const identType = document.querySelector('.metadata-identifier-type');
                        identText.value = identifier.text;
                        for (const option of identType.options) {
                            if (option.value === identifier.type) {
                                option.selected = true;
                                break;
                            }
                        };
                    }
                    else {
                        cloneMetadataField("identifier", ["text", "type"], identifier);
                    }
                    index4++;
                })

                const notes = data.note;
                let index5 = 0;
                notes.forEach((note) => {
                    if (index5 === 0) {
                        const noteText = document.querySelector('.metadata-note-text');
                        noteText.value = note.text;
                    }
                    else {
                        cloneMetadataField('note', ['text'], note);
                    }
                    index5++;
                })
                
                const categories = data.category;
                let index6 = 0;
                categories.forEach((category) => {
                    if (index6 === 0) {
                        const categoryType = document.querySelector('.metadata-category-type');    
                        for (const option of categoryType.options) {
                            if (option.value === category.type) {
                                option.selected = true;
                                break;
                            }
                        };
                    }
                    else {
                        cloneMetadataField('category', ['type'], category);
                    }
                    index6++;
                })
                

                const sources = data.source;
                let index7 = 0;
                sources.forEach((source) => {
                    if (index7 === 0) {
                        const sourceText = document.querySelector('.metadata-source-text');
                        sourceText.value = source.text;
                    }
                    else {
                        cloneMetadataField('source', ['text'], source);
                    }
                    index7++;
                })

                const pubPlaceName = document.querySelector('#pubPlace-name');
                const pubPlaceAuthority = document.querySelector('#pubPlace-authority');
                pubPlaceName.value = data.pubPlace.name;
                pubPlaceAuthority.value = data.pubPlace.authority;

                const pubDateDate = document.querySelector('#pubDate-date');
                let parsedDate = new Date(data.pubDate.date);
                let formattedDate = parsedDate.getFullYear() + "-" + ((parsedDate.getMonth() + 1) < 10 ? '0' : '') + 
                    (parsedDate.getMonth() + 1) + "-" + (parsedDate.getDate() < 10 ? '0' : '') + parsedDate.getDate();
                pubDateDate.value = formattedDate;

                const availText = document.querySelector('#license-text');
                const availLink = document.querySelector('#license-link');
                availText.value = data.license.text;
                for (const option of availLink.options) {
                    if (option.value === data.license.link) {
                        option.selected = true;
                        break;
                    }
                };                
                
                const abstractText = document.querySelector('#abstract-text');
                abstractText.value = data.abstract.text;

                const creationDateDate = document.querySelector('#creationDate-date');
                let creationParsedDate = new Date(data.creationDate.date);
                let creationFormattedDate = creationParsedDate.getFullYear() + "-" + 
                    ((creationParsedDate.getMonth() + 1) < 10 ? '0' : '') + (creationParsedDate.getMonth() + 1) + "-" + 
                    (creationParsedDate.getDate() < 10 ? '0' : '') + creationParsedDate.getDate();
                    creationDateDate.value = creationFormattedDate;

                
            });    
        })
    }
    
    
    function initializeAddButtons(field, subfields) {
        const addButtons = form.querySelectorAll(`.add-${field}-button`);
        addButtons.forEach(addButton => {
            addButton.addEventListener("click", handleAddButtonClick(field, subfields));
        });
    }


    function initializeRemoveButtons(field) {
        form.addEventListener("click", handleRemoveButtonClick(field));
    }


    initializeAddButtons("title", ["text", "language"]);
    initializeAddButtons("responsibility", ["surname", "name", "authority", "role"]);
    initializeAddButtons("pubAuthority", ["name", "authority", "role"]);
    initializeAddButtons("identifier", ["text", "type"]);
    initializeAddButtons("source", ['text']);
    initializeAddButtons("note", ['text']);
    initializeAddButtons("category", ["type"]);

    initializeRemoveButtons("title");
    initializeRemoveButtons("responsibility");
    initializeRemoveButtons("pubAuthority");
    initializeRemoveButtons("identifier");
    initializeRemoveButtons("source");
    initializeRemoveButtons("note");
    initializeRemoveButtons("category");

    fetchExistingDataAndPopulate(documentId);

})();

export { InterfaceModule }
