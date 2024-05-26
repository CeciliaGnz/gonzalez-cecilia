(() => {
  const App = {
      htmlElements: {
          navPlaceholder: document.getElementById("nav-placeholder"),
          userName: document.getElementById("user-name")
      },
      init() {
          App.loadNavigation();
          App.showUserName();
      },

      loadNavigation() {
        fetch('nav.html')
        .then(response => response.text())
        .then(data => {
          App.htmlElements.navPlaceholder.innerHTML = data;
          
        });
      },

      showUserName() {
        const username = localStorage.getItem("username");
        if (username) {
            App.htmlElements.userName.textContent = username;
        }
    }
  };

  App.init();
})();
