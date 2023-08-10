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
  
    return {
      openTab,
      initializeTabs,
    };
  })();

  export { TabsModule };