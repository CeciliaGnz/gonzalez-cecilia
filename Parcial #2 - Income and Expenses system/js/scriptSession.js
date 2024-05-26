(() => {
  const Insertar = JSON.parse(localStorage.getItem('usuarios')) || [];

  const methods = {
      hashCode(str) {
          let hash = 0;
          for (let i = 0, len = str.length; i < len; i++) {
              let chr = str.charCodeAt(i);
              hash = (hash << 5) - hash + chr;
              hash |= 0;
          }
          return hash;
      }
  };

  const templates = {
      mensajeError() {
          const error = document.createElement("span");
          error.textContent = "Usuario o contraseña incorrectos.";
          form.appendChild(error);
          setTimeout(() => {
              error.remove();
          }, 2000);
      }
  };

  const Sesion = {
      registro(username, nombre, password) {
          const hashedPassword = methods.hashCode(password);
          Insertar.push({ username, nombre, password: hashedPassword });
          localStorage.setItem('usuarios', JSON.stringify(Insertar)); 
      },

      inicioSesion(username, password) {
          const hashedPassword = methods.hashCode(password);
          const user = Insertar.find(item => item.username === username && item.password === hashedPassword);
          if (user) {
              localStorage.setItem("username", username);
              localStorage.setItem("nombre", user.nombre);
              window.location.href = "../pages/profile.html";
          } else {
              templates.mensajeError();
          }
      },

      usuarioExiste(username) {
          return Insertar.some(user => user.username === username);
      },

      estadoLoggeado() {
          if (localStorage.getItem("username"))
              window.location.href = "../pages/profile.html";
      },

      estadoNoLoggeado() {
          if (!localStorage.getItem("username"))
              window.location.href = "../pages/login.html";
      },

      logout() {
        localStorage.removeItem("username");
        localStorage.removeItem("nombre");
        window.location.href = "login.html";
      },

      cambiarPass(nuevaPass) {
        const username = localStorage.getItem("username");
        const hashedPassword = methods.hashCode(nuevaPass);
        const userIndex = Insertar.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            Insertar[userIndex].password = hashedPassword;
            localStorage.setItem('usuarios', JSON.stringify(Insertar));
        }
    },

      cambiarNombre(nuevoNombre) {
        const username = localStorage.getItem("username");
        const userIndex = Insertar.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            Insertar[userIndex].nombre = nuevoNombre;
            localStorage.setItem("nombre", nuevoNombre);
        }
    },
  };

  window.Sesion = Sesion;
})();
