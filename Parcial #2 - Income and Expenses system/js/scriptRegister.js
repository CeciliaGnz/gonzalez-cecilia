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

    handlers: {
        onSubmit(e){
            e.preventDefault();
            const username=e.target.username.value;
            const nombre=e.target.nombre.value;
            const password=e.target.password.value;

        },
    },

    methods: {

    }
    

    };

    App.init();
    

})(window.Sesion);