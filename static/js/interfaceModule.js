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
                    clone.querySelector(`.metadata-${field}-${subfield}`).id = `${origId}-${currentCounter}`;
                    clone.querySelector(`.metadata-${field}-${subfield}`).name = origName
                })

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
                if (fieldCounters[field]) {
                    fieldCounters[field]--;
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

    function funzioneDellaVita(field, subfields, data) {
        console.log(data)
        const inputGroup = document.querySelector(`.${field}-input-group`);
        const additionalContainer = document.querySelector(`.additional-${field}`);

        if (!fieldCounters[field]) {
            fieldCounters[field] = 1;
        } else {
            fieldCounters[field]++;
        }
        
        const clone = inputGroup.cloneNode(true);
        const currentCounter = fieldCounters[field];
        let index = 0;
        subfields.forEach((subfield) => {
            const origId = inputGroup.querySelector(`.metadata-${field}-${subfield}`).id;
            const origName = inputGroup.querySelector(`.metadata-${field}-${subfield}`).name;
            clone.querySelector(`.metadata-${field}-${subfield}`).value = data[subfield] ;
            clone.querySelector(`.metadata-${field}-${subfield}`).id = `${origId}-${currentCounter}`;
            clone.querySelector(`.metadata-${field}-${subfield}`).name = origName
            index++;
        })

        const removeButton = document.createElement("span");
        removeButton.classList.add("button", "is-danger", "is-light", `remove-${field}-button`);
        const minusIcon = document.createElement("i");
        minusIcon.classList.add("fa-solid", "fa-minus");
        removeButton.appendChild(minusIcon);
        clone.appendChild(removeButton);
        additionalContainer.appendChild(clone);
        clone.querySelector(`.add-${field}-button`).remove();
    }

    function fetchExistingDataAndPopulate(documentId) {
        populateSKOSDropdown().then(() => {
            fetch(`/get_existing_data/${documentId}`)
            .then(response => response.json())
            .then(data => {
                // Populate main form fields with existing data
    
                const titles = data.title

                let index = 0
                titles.forEach((title) => {
                    //console.log(`Index: ${index}`);
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
                        funzioneDellaVita("title", ["text", "language"], title)
                    }
                    index++;
                })


                const respSurname = document.querySelector('#resp-surname');
                const respName = document.querySelector('#resp-name');
                const respAuthority = document.querySelector('#resp-authority');
                const respRole = document.querySelector('#resp-role');
                respSurname.value = data.resp[0].surname;
                respName.value = data.resp[0].name;
                respAuthority.value = data.resp[0].authority;
                for (const option of respRole.options) {
                    if (option.value === data.resp[0].role) {
                        option.selected = true;
                        break;
                    }
                };

                const pubAuthorityName = document.querySelector('#pubAuthority-name');
                const pubAuthorityAuthority = document.querySelector('#pubAuthority-authority');
                const pubAuthorityRole = document.querySelector('#pubAuthority-role');
                pubAuthorityName.value = data.pubAuthority[0].name;
                pubAuthorityAuthority.value = data.pubAuthority[0].authority;
                for (const option of pubAuthorityRole.options) {
                    if (option.value === data.pubAuthority[0].role) {
                        option.selected = true;
                        break;
                    }
                };

                const pubPlaceName = document.querySelector('#pubPlace-name');
                const pubPlaceAuthority = document.querySelector('#pubPlace-authority');
                pubPlaceName.value = data.pubPlace[0].name;
                pubPlaceAuthority.value = data.pubPlace[0].authority;

                const pubDateDate = document.querySelector('#pubDate-date');
                let parsedDate = new Date(data.pubDate[0].date);
                let formattedDate = parsedDate.getFullYear() + "-" + ((parsedDate.getMonth() + 1) < 10 ? '0' : '') + 
                    (parsedDate.getMonth() + 1) + "-" + (parsedDate.getDate() < 10 ? '0' : '') + parsedDate.getDate();
                pubDateDate.value = formattedDate;

                const identText = document.querySelector('#identifier-text');
                const identType = document.querySelector('#identifier-type');
                identText.value = data.ident[0].text;
                for (const option of identType.options) {
                    if (option.value === data.ident[0].type) {
                        option.selected = true;
                        break;
                    }
                };

                const availText = document.querySelector('#availability-text');
                const availLink = document.querySelector('#availability-link');
                const availStatus = document.querySelector('#availability-status');
                availText.value = data.availability[0].text;
                for (const option of availLink.options) {
                    if (option.value === data.availability[0].link) {
                        option.selected = true;
                        break;
                    }
                };
                for (const option of availStatus.options) {
                    if (option.value === data.availability[0].status) {
                        option.selected = true;
                        break;
                    }
                };

                const sourceText = document.querySelector('#source-text');
                sourceText.value = data.source[0].text;

                const noteText = document.querySelector('#note-text');
                noteText.value = data.note[0].text;

                const descText = document.querySelector('#description-text');
                descText.value = data.desc[0].text;

                const abstractText = document.querySelector('#abstract-text');
                abstractText.value = data.abstract[0].text;

                const creationPlaceName = document.querySelector('#creationPlace-name');
                const creationPlaceAuthority = document.querySelector('#creationPlace-authority');
                creationPlaceName.value = data.creationPlace[0].name;
                creationPlaceAuthority.value = data.creationPlace[0].authority;

                const creationDateDate = document.querySelector('#creationDate-date');
                let creationParsedDate = new Date(data.creationDate[0].date);
                let creationFormattedDate = creationParsedDate.getFullYear() + "-" + 
                    ((creationParsedDate.getMonth() + 1) < 10 ? '0' : '') + (creationParsedDate.getMonth() + 1) + "-" + 
                    (creationParsedDate.getDate() < 10 ? '0' : '') + creationParsedDate.getDate();
                    creationDateDate.value = creationFormattedDate;

                const languageText = document.querySelector('#language-text');
                const languageIdent = document.querySelector('#language-ident');
                const languageUsage = document.querySelector('#language-usage');
                languageText.value = data.lang[0].text;
                for (const option of languageIdent.options) {
                    if (option.value === data.lang[0].ident) {
                        option.selected = true;
                        break;
                    }
                };
                languageUsage.value = data.lang[0].usage;

                const category = document.querySelector('#category-type');
                for (const option of category.options) {
                    if (option.value === data.category[0].type) {
                        option.selected = true;
                        break;
                    }
                };
            });    
        })
    }
    
    
    function initializeAddButtons(field, subfield) {
        const addButtons = form.querySelectorAll(`.add-${field}-button`);
        addButtons.forEach(addButton => {
            addButton.addEventListener("click", handleAddButtonClick(field, subfield));
        });
    }

    function initializeRemoveButtons(field) {
        form.addEventListener("click", handleRemoveButtonClick(field));
    }


    initializeAddButtons("title", ["text", "language"]);
    initializeAddButtons("responsibility");
    initializeAddButtons("pubAuthority");
    initializeAddButtons("identifier");
    initializeAddButtons("source");
    initializeAddButtons("note");
    initializeAddButtons("language");
    initializeAddButtons("category");

    initializeRemoveButtons("title");
    initializeRemoveButtons("responsibility");
    initializeRemoveButtons("pubAuthority");
    initializeRemoveButtons("identifier");
    initializeRemoveButtons("source");
    initializeRemoveButtons("note");
    initializeRemoveButtons("language");
    initializeRemoveButtons("category");

    fetchExistingDataAndPopulate(documentId);

})();

export { InterfaceModule }
