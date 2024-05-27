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
    mensajeError(mensaje) {
        const error = document.createElement("span");
        error.textContent = mensaje;
        error.style.color = "red";
        error.style.marginTop = "10px"; 
        form.appendChild(error);
        setTimeout(() => {
            error.remove();
        }, 2000);
    },

    mensajeExitoso(mensaje) {
        const success = document.createElement("span");
        success.textContent = mensaje;
        success.style.color = "green";  
        success.style.marginTop = "10px"; 
        form.appendChild(success);
        setTimeout(() => {
            success.remove();
        }, 2000);
    }

};

  const Sesion = {
      registro(username, nombre, password) {
          const hashedPassword = methods.hashCode(password);
          Insertar.push({ username, nombre, password: hashedPassword });
          localStorage.setItem('usuarios', JSON.stringify(Insertar));
          templates.mensajeExitoso("Usuario registrado exitosamente."); 
      },

      inicioSesion(username, password) {
          const hashedPassword = methods.hashCode(password);
          const user = Insertar.find(item => item.username === username && item.password === hashedPassword);
          if (user) {
              localStorage.setItem("username", username);
              localStorage.setItem("nombre", user.nombre);
              window.location.href = "../pages/profile.html";
          } else {
            templates.mensajeError("Usuario o contraseña incorrectos.");
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
        var mensaje="Nombre cambiado con exito."
        const username = localStorage.getItem("username");
        const userIndex = Insertar.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            Insertar[userIndex].nombre = nuevoNombre;
            localStorage.setItem("nombre", nuevoNombre);
            localStorage.setItem('usuarios', JSON.stringify(Insertar));
        }
    },
  };

  window.Sesion = Sesion;
})();
