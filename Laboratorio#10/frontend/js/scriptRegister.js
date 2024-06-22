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
        App.htmlElements.form.addEventListener("submit", App.handlers.onSubmit)
    },

    handlers: {
        onSubmit(e){
            e.preventDefault();
            const username=e.target.username.value;
            const nombre=e.target.nombre.value;
            const password=e.target.password.value;
            App.methods.registroUsuario(username, nombre, password);
        },
    },

    methods: {

        registroUsuario(username,nombre,password){
            if (Sesion.usuarioExiste(username)) {
                alert('El usuario ya existe. Por favor, elige otro nombre de usuario.');//cambiar por un mensaje con estilo
            } else {
                Sesion.registro(username, nombre, password);
            }
        }
    }

    };

    App.init();
    

})(window.Sesion);