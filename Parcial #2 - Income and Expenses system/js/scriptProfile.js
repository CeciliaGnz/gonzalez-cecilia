((Sesion) =>{
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

      bindEvents() {
        App.htmlElements.logoutButton.addEventListener("click", App.handlers.onLogout);
      },
      handlers: {
        onLogout(e) {
          e.preventDefault();
          App.methodsEvents.logout();
        },
      },
      methods:{
        
      },
    };
    
    App.init();
    
})(window.Sesion);