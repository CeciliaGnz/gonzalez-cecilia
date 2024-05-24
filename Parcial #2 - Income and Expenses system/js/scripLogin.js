((Sesion) =>{
    const App = {
        htmlElements: {
          form: document.getElementById("form")

        },
    
    init() {
        App.bindEvents();
        App.verificarSesion();
      },

    verificarSesion() {
        Sesion.estadoLoggeado();
    },

    bindEvents(){
        App.htmlElements.form.addEventListener("submit".App.handlers.onSubmit)
    },

    handlers : {

    },

    };

    App.init();
    

})(window.Sesion);