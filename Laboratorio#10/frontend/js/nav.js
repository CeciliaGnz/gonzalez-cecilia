(() => {
  const App = {
      htmlElements: {
          navPlaceholder: document.getElementById("nav-placeholder"),
      },
      init() {
          App.loadNavigation();
      },

      loadNavigation() {
        fetch('nav.html')
        .then(response => response.text())
        .then(data => {
          App.htmlElements.navPlaceholder.innerHTML = data;
          
          App.htmlElements.userName = document.getElementById("user-name");
          App.htmlElements.logoutButton = document.getElementById("logoutButton");
          App.bindEvents();
          App.methods.showUserName();
        });
      },

      bindEvents() {
        if (App.htmlElements.logoutButton) {
          App.htmlElements.logoutButton.addEventListener("click", App.handlers.onLogout);
        }
      },

      handlers: {
        onLogout(e) {
          e.preventDefault();
          Sesion.logout();
        },
      },

      methods :{
        showUserName() {
        const username = localStorage.getItem("username");
        if (username && App.htmlElements.userName) {
            App.htmlElements.userName.textContent = username;
        }
      }
    },
  };

  App.init();
})();
