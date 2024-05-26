
  ((Sesion) => {
      const App = {
          htmlElements: {
              logoutButton: document.getElementById("logoutButton"),
              passNewBtn: document.getElementById("passNewBtn"),
              nameNewBtn:document.getElementById("nameNewBtn"),
              userName: document.getElementById("userName"),
              nombre: document.getElementById("nombre"),
              titleNom: document.getElementById("titleNom"),
              newPass: document.getElementById("newPass"),
              confirmPass: document.getElementById("confirmPass")
          },
          init() {
              App.bindEvents();
              App.verificarSesion();
              App.mostrarData();
          },

          verificarSesion() {
              Sesion.estadoNoLoggeado();
          },

          bindEvents() {
                App.htmlElements.logoutButton.addEventListener("click", App.handlers.onLogout);
                App.htmlElements.nameNewBtn.addEventListener("click", App.Edit.editName);
                App.htmlElements.passNewBtn.addEventListener("click", App.Edit.editPass);
          },
          handlers: {
              onLogout(e) {
                  e.preventDefault();
                  Sesion.logout();
              }
          },

          Edit:{
            editName(e){
              e.preventDefault();
              const nombre=App.htmlElements.nombre.value;
              App.methods.cambiarNombre(nombre)
            },

            editPass(e) {
              e.preventDefault();
              const newPass = App.htmlElements.newPass.value;
              const confirmPass = App.htmlElements.confirmPass.value;
              if (newPass === confirmPass) {
                  App.methods.cambiarPassword(newPass);
              } else {
                  alert("Las contraseñas no coinciden.");
              }
          }
          },

          mostrarData() {
              App.methods.showUserName();
              App.methods.showName();
          },

          methods: {
              showUserName() {
                  const username = localStorage.getItem("username");
                  if (username && App.htmlElements.userName) {
                      App.htmlElements.userName.value = username;
                  }
              },
              showName() {
                  const nombre = localStorage.getItem("nombre");
                  if (nombre && App.htmlElements.nombre) {
                      App.htmlElements.nombre.value = nombre;
                      App.htmlElements.titleNom.textContent=nombre;
                  }
              },

              cambiarNombre(nuevoNombre) {
                Sesion.cambiarNombre(nuevoNombre);
                App.methods.showName(); 
                alert("Nombre modificado.");
              },

              cambiarPassword(newPass){
                Sesion.cambiarPass(newPass);
                alert("Contraseña modificada.");
              }
          }
      };

      App.init();
  })(window.Sesion);
