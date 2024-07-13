(() => {
    const App = {
        htmlElements: {
            navPlaceholder: document.getElementById("nav-placeholder"),
            menuToggle: null,
            mobileMenu: null
        },

        init() {
            App.loadNavigation();
        },

        loadNavigation() {
            fetch('../html/navbar/navHome.html')
                .then(response => response.text())
                .then(data => {
                    App.htmlElements.navPlaceholder.innerHTML = data;
                    App.setupMenuToggle(); // Llamar a setupMenuToggle después de cargar el contenido
                })
                .catch(error => {
                    console.error('Error loading navbar:', error);
                });
        },

        setupMenuToggle() {
            // Esperar un breve tiempo para asegurar que los elementos se hayan renderizado correctamente
            setTimeout(() => {
                App.htmlElements.menuToggle = document.getElementById('menu-toggle');
                App.htmlElements.mobileMenu = document.getElementById('mobile-menu');

                // Aplicar la clase 'hidden-menu' inicialmente si mobileMenu existe
                if (App.htmlElements.mobileMenu) {
                    App.htmlElements.mobileMenu.classList.add('hidden-menu');
                }

                App.bindMenuToggle(); // Vincular el evento click del menú después de obtener los elementos
            }, 100);
        },

        bindMenuToggle() {
            if (App.htmlElements.menuToggle) {
                App.htmlElements.menuToggle.addEventListener('click', () => {
                    if (App.htmlElements.mobileMenu) {
                        App.htmlElements.mobileMenu.classList.toggle('hidden-menu');
                    }
                });
            }
        },
    };

    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
})();
