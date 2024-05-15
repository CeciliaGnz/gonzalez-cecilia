(() => {
    const App = {
      htmlElements: {
        form: document.getElementById("form")
      },
      init() {
        App.verificarSesion();
        App.bindEvents();
      },
      bindEvents() {
        App.htmlElements.form.addEventListener("submit", App.handlers.onSubmit);
      },
      handlers: {
        onSubmit(e) {
          e.preventDefault();
          const username=e.target.username.value;
          const password=e.target.password.value;
          App.methods.validarSesion(username,password);

        },
      },
      methods: {
        validarSesion(user, pass) {
          if (user === "cecilia.gnz" && pass === "12345") {
            localStorage.setItem("user", user);
            window.location.href = "home.html";
          } else {App.methods.mensajeError();}
        },

        mensajeError(){
          const error = document.createElement("span");
          error.textContent = "Usuario o contraseña incorrectos.";
          form.appendChild(error);
          setTimeout(() => {
            error.remove();
          }, 2000);
        }
      },

      verificarSesion() {
        const user = localStorage.getItem("user");
        if (user) {window.location.href = "home.html"; }
      },
      
    };
    App.init();
  })();