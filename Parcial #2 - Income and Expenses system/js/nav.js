(() => {
  const App = {
      htmlElements: {
          navPlaceholder: document.getElementById("nav-placeholder")
      },
      init() {
          App.loadNavigation();
      },

      loadNavigation() {
        fetch('nav.html')
        .then(response => response.text())
        .then(data => {
          App.htmlElements.navPlaceholder.innerHTML = data;
        });
      },
  };

  App.init();
})();
