(() =>{
    const Insertar = [
        { username: username, nombre: nombre, password: password}
      ];

    function hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; 
        }
        return hash;
    }

      const Sesion={
        registro(username, password) {
          const hashedPassword = hashCode(password);
          Insertar.push({ username, password: hashedPassword });
          console.log(Insertar)
        },

        inicioSesion(username, password){
          const hashedPassword = hashCode(password);
          const user = Insertar.find(item => item.username === username && item.password === hashedPassword);
          if (user) {
            localStorage.setItem("username", username);
            window.location.href = "../pages/profile.html";
          }
        },

        estadoLoggeado() {
          if (localStorage.getItem("username"))
            window.location.href = "../pages/profile.html";
        },

        estadoNoLoggeado() {
          if (!localStorage.getItem("username"))
            window.location.href = "../pages/login.html";
        },

      };

      window.Sesion=Sesion;
})();