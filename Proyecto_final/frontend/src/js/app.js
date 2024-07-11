(() => {
    const App = {
        htmlElements: {
            loginForm: document.getElementById("loginForm"),
            registerForm: document.getElementById("registerForm"),
            profileForm: document.getElementById("profileForm"),
            financeForm: document.getElementById("financeForm"),
            logoutBtn: document.getElementById("logoutBtn"),
            logoutBtn2: document.getElementById("logoutBtn2"),
            loginError: document.getElementById("loginError"),
            registerError: document.getElementById("registerError"),
            welcomeMessage: document.getElementById("welcomeMessage"),
            financeTable: document.getElementById("financeTable"),
            entryBar: document.getElementById("entryBar"),
            exitBar: document.getElementById("exitBar"),
            toRegisterBtn: document.getElementById("toRegister"),
            toLoginBtn: document.getElementById("toLogin"),
            toDashboardBtn: document.getElementById("toDashboard"),
            toProfileBtn: document.getElementById("toProfile")
        },
        data: {
            users: JSON.parse(localStorage.getItem("users")) || [{ username: 'user', name: 'dexsi', password: 48690 }], // hashed password for '123'
            currentUser: JSON.parse(sessionStorage.getItem("currentUser")) || null,
            finances: JSON.parse(localStorage.getItem("finances")) || []
        },
        init() {
            if (App.htmlElements.loginForm) App.htmlElements.loginForm.addEventListener("submit", App.handlers.handleLogin);
            if (App.htmlElements.registerForm) App.htmlElements.registerForm.addEventListener("submit", App.handlers.handleRegister);
            if (App.htmlElements.profileForm) App.htmlElements.profileForm.addEventListener("submit", App.handlers.handleUpdateProfile);
            if (App.htmlElements.financeForm) App.htmlElements.financeForm.addEventListener("submit", App.handlers.handleAddFinance);
            if (App.htmlElements.logoutBtn) App.htmlElements.logoutBtn.addEventListener("click", App.handlers.handleLogout);
            if (App.htmlElements.logoutBtn2) App.htmlElements.logoutBtn2.addEventListener("click", App.handlers.handleLogout);
            if (App.htmlElements.toRegisterBtn) App.htmlElements.toRegisterBtn.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = 'register.html';
            });
            if (App.htmlElements.toLoginBtn) App.htmlElements.toLoginBtn.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = 'index.html';
            });
            if (App.htmlElements.toDashboardBtn) App.htmlElements.toDashboardBtn.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = 'dashboard.html';
            });
            if (App.htmlElements.toProfileBtn) App.htmlElements.toProfileBtn.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = 'profile.html';
            });
            App.methods.checkAccess();
        },
        handlers: {
            handleLogin(event) {
                event.preventDefault();
                const username = document.getElementById("loginUsername").value;
                const password = App.methods.hashCode(document.getElementById("loginPassword").value);
                const user = App.data.users.find(user => String(user.username) === String(username) && parseInt(user.password) === parseInt(password));
                if (user) {
                    App.data.currentUser = user;
                    sessionStorage.setItem("currentUser", JSON.stringify(user));
                    window.location.href = 'dashboard.html';
                } else {
                    App.htmlElements.loginError.textContent = "Usuario o contraseña inválidos";
                }
            },
            handleRegister(event) {
                event.preventDefault();
                const username = document.getElementById("registerUsername").value;
                const name = document.getElementById("registerName").value;
                const password = App.methods.hashCode(document.getElementById("registerPassword").value);
                fetch("http://localhost:3000/api/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ username, name, password }),
                })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("El usuario ya existe");
                  }
                  alert('Usuario creado correctamente!')
                  window.location.href = 'Login.html';
                })
                .catch((error) => {
                  App.htmlElements.registerError.textContent = error.message;
                });
            },
            handleUpdateProfile(event) {
                event.preventDefault();
                const name = document.getElementById("profileName").value;
                const password = App.methods.hashCode(document.getElementById("profilePassword").value);
                App.data.currentUser.name = name;
                if (password) {
                    App.data.currentUser.password = password;
                }
                App.data.users = App.data.users.map(user => user.username === App.data.currentUser.username ? App.data.currentUser : user);
                localStorage.setItem("users", JSON.stringify(App.data.users));
                sessionStorage.setItem("currentUser", JSON.stringify(App.data.currentUser));
                alert("Perfil actualizado exitosamente");
            },
            handleLogout(event) {
                event.preventDefault();
                sessionStorage.removeItem("currentUser");
                window.location.href = 'Login.html';
            }
        },
        methods: {
            checkAccess() {
                if (!App.data.currentUser) {
                    window.location.href = 'Login.html';
                }
            },
            hashCode(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0; // Convert to 32bit integer
                }
                return hash;
            }       
        }
    };

    App.init();
})();
