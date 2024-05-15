(() => {
    const App = {
      htmlElements: {
        logoutButton: document.getElementById("logoutButton")
      },
      init() {
        App.verificarSesion();
        App.bindEvents();
      },
      bindEvents() {
        App.htmlElements.logoutButton.addEventListener("click", App.handlers.onLogout);
      },
      handlers: {
        onLogout(e) {
          e.preventDefault();
          App.methodsEvents.logout();
        },
      },
      methodsEvents: {
       logout() {
            localStorage.removeItem("user");
            window.location.href = "login.html";
          },
      },

      verificarSesion(user) {
        const userNameElement = document.getElementById("userName"); // Corrige el acceso al elemento del nombre de usuario
        if (user && userNameElement) {userNameElement.textContent = user;} 
    },
    };
    
    App.init();
  })();
  