(() => {
    const App = {
        htmlElements: {
            navPlaceholder: document.getElementById("nav-placeholder"),
            menuToggle: null,
            mobileMenu: null
        },

        init() {
            App.loadNavigation();
            App.bindLogoutEvent();
        },

        loadNavigation() {
            fetch('../html/navbar/navContractor.html')
                .then(response => response.text())
                .then(data => {
                    App.htmlElements.navPlaceholder.innerHTML = data;
                    App.setupMenuToggle();
                })
                .catch(error => {
                    console.error('Error loading navbar:', error);
                });
        },

        setupMenuToggle() {
            setTimeout(() => {
                App.htmlElements.menuToggle = document.getElementById('menu-toggle');
                App.htmlElements.mobileMenu = document.getElementById('mobile-menu');

                // Aplicar la clase 'hidden-menu' inicialmente si mobileMenu existe
                if (App.htmlElements.mobileMenu) {
                    App.htmlElements.mobileMenu.classList.add('hidden-menu');
                }

                App.bindMenuToggle();
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

        bindLogoutEvent() {
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    console.log('Logging out...');
                });
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
})();