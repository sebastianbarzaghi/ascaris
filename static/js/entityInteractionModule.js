const EntityInteractionModule = (function () {

    const entityPanel = document.querySelector(".tab-content");

    entityPanel.addEventListener("dragover", (event) => {
        event.preventDefault(); // Prevent the default behavior to allow dropping
    });

    entityPanel.addEventListener("drop", (event) => {
        console.log(event)
        event.preventDefault();
        
        const blockId = event.dataTransfer.getData("text/plain");
        const draggedBlock = document.getElementById(blockId);
        
        // Check if the dragged block and the target block are of the same type (e.g., "person")
        if (draggedBlock.classList.contains("panel-block") && entityPanel.contains(draggedBlock)) {
            // Find the target block where the dragged block is dropped
            const targetBlock = event.target.closest(".panel-block");
            
            if (targetBlock && targetBlock !== draggedBlock) {
            // Merge data attributes from the dragged block into the target block's entity span
            const draggedEntityLink = draggedBlock.getAttribute("data-link");
            const targetEntityLink = targetBlock.getAttribute("data-link");
            
            if (draggedEntityLink && targetEntityLink) {
                const draggedEntity = document.querySelector(`.entity[data-link="${draggedEntityLink}"]`);
                const targetEntity = document.querySelector(`.entity[data-link="${targetEntityLink}"]`);
                
                if (draggedEntity && targetEntity) {
                // Transfer data attributes from the dragged entity to the target entity
                const dataAttributes = ["data-name", 
                                        "data-sameAs", 
                                        "data-certainty",
                                        "data-evidence",
                                        "data-note",
                                        "data-when",
                                        "data-from",
                                        "data-to",
                                        "data-notbefore",
                                        "data-notafter"];
                dataAttributes.forEach((attribute) => {
                    const attributeValue = draggedEntity.getAttribute(attribute);
                    if (attributeValue) {
                    targetEntity.setAttribute(attribute, attributeValue);
                    }
                });
                
                // Update the counter by adding the dragged block's counter value to the target block
                const draggedCounter = parseInt(draggedBlock.querySelector(".counter").textContent, 10);
                const targetCounter = parseInt(targetBlock.querySelector(".counter").textContent, 10);
                targetBlock.querySelector(".counter").textContent = (targetCounter + draggedCounter).toString();
                
                // Remove the dragged block from the entity panel
                draggedBlock.remove();
                }
            }
            }
        }
    });

})();

export { EntityInteractionModule };