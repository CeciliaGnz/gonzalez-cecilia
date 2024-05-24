((Session) =>{

    const App = {
        htmlElements: {
          logoutButton: document.getElementById("logoutButton")
        },

    init() {
        App.bindEvents();
        App.verificarSesion();
      },

      verificarSesion() {
        Sesion.estadoNoLoggeado();
      },
    };
    App.init();
    
})(window.Session);