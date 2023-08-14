const TabsModule = (function () {
  
    function openTab(event, tabName) {
      var i, tabcontent, tablinks;
      tablinks = document.getElementsByClassName("tab");
      tabcontent = document.getElementsByClassName("panel-content");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("is-active");
      }
      document.querySelector("." + tabName + "-content").style.display = "block";
      event.currentTarget.classList.add("is-active");
    }
  
    function initializeTabs() {
      var tablinks = document.querySelectorAll(".tab");
      tablinks.forEach(function (tablink) {
        tablink.addEventListener("click", function (event) {
          openTab(event, tablink.dataset.name);
        });
      });
    }

    const editorPanel = document.querySelector(".editor-panel");
    const metadataPanel = document.querySelector(".metadata-panel");

    const tabs = document.querySelectorAll(".editor-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            if (tab.classList.contains("is-active")) return;

            tabs.forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");

            if (tab.classList.contains("text-tab")) {
                editorPanel.style.display = "block";
                metadataPanel.style.display = "none";
            } else if (tab.classList.contains("metadata-tab")) {
                editorPanel.style.display = "none";
                metadataPanel.style.display = "block";
            }
        });
    });

    return {
      openTab,
      initializeTabs,
    };

  })();

  export { TabsModule };