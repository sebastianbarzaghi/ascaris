const EntityInteractionModule = (function () {
    const entityPanel = document.querySelector(".tab-content");
    let draggedBlock; // Define draggedBlock outside of event listeners

    entityPanel.addEventListener("dragstart", (event) => {
    draggedBlock = event.target;
    if (draggedBlock.classList.contains("panel-block")) {
        draggedBlock.classList.add("dragging");
    }
    });

    entityPanel.addEventListener("dragend", (event) => {
    if (draggedBlock && draggedBlock.classList.contains("panel-block")) {
        draggedBlock.classList.remove("dragging");
        draggedBlock = null; // Reset draggedBlock after drag ends
    }
    });

    entityPanel.addEventListener("dragover", (event) => {
    event.preventDefault();

    const targetBlock = event.target.closest(".panel-block");
    if (targetBlock && targetBlock !== draggedBlock) {
        targetBlock.classList.add("valid-drop-target");
    }
    });

    entityPanel.addEventListener("dragleave", (event) => {
    const targetBlock = event.target.closest(".panel-block");
    if (targetBlock) {
        targetBlock.classList.remove("valid-drop-target");
    }
    });
  
    entityPanel.addEventListener("drop", (event) => {
      event.preventDefault();
  
      const blockId = event.dataTransfer.getData("text/plain");
      const draggedBlock = document.getElementById(blockId);
  
      if (
        draggedBlock.classList.contains("panel-block") &&
        entityPanel.contains(draggedBlock)
      ) {
        const targetBlock = event.target.closest(".panel-block");
  
        if (targetBlock && targetBlock !== draggedBlock) {
          const draggedEntityLink = draggedBlock.getAttribute("data-link");
          const targetEntityLink = targetBlock.getAttribute("data-link");
  
          if (draggedEntityLink && targetEntityLink) {
            const draggedEntity = document.querySelector(
              `.entity[data-link="${draggedEntityLink}"]`
            );
            const targetEntity = document.querySelector(
              `.entity[data-link="${targetEntityLink}"]`
            );
  
            if (draggedEntity && targetEntity) {
              // Transfer data attributes from the target entity to the dragged entity
              const dataAttributes = [
                "data-link",
                "data-name",
                "data-sameAs",
                "data-certainty",
                "data-evidence",
                "data-note",
                "data-when",
                "data-from",
                "data-to",
                "data-notbefore",
                "data-notafter",
              ];
  
              dataAttributes.forEach((attribute) => {
                const targetAttributeValue = targetEntity.getAttribute(attribute);
                if (targetAttributeValue) {
                  draggedEntity.setAttribute(attribute, targetAttributeValue);
                } else {
                  // Remove the attribute from the dragged entity if it doesn't exist in the target entity
                  draggedEntity.removeAttribute(attribute);
                }
              });
  
              // Update the counter by adding the dragged block's counter value to the target block
              const draggedCounter = parseInt(
                draggedBlock.querySelector(".counter").textContent,
                10
              );
              const targetCounter = parseInt(
                targetBlock.querySelector(".counter").textContent,
                10
              );
              targetBlock.querySelector(".counter").textContent = (
                targetCounter + draggedCounter
              ).toString();
  
              // Remove the dragged block
              draggedBlock.remove();
            }
          }
        }
      }
    });
  })();
  
  
  export { EntityInteractionModule };
  