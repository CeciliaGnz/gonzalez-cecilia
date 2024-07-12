(() => {
    const App = {
        htmlElements: {
            logoutBtn: document.querySelector("#logout-btn"),
            searchInput: document.querySelector("#search-input"),
            filterCheckboxes: document.querySelectorAll(".filter-checkbox"),
            talentsContainer: document.querySelector("#talents-container"),
            userEmail: document.querySelector("#user-email"),
        },
        data: {
            currentUser: JSON.parse(sessionStorage.getItem("currentUser")) || null,
            filters: {
                area: [],
                language: [],
                salary: []
            },
            searchQuery: ''
        },
        init() {
            // Asignación de eventos
            if (App.htmlElements.logoutBtn) {
                App.htmlElements.logoutBtn.addEventListener("click", App.handlers.handleLogout);
            }

            if (App.htmlElements.searchInput) {
                App.htmlElements.searchInput.addEventListener("input", App.handlers.handleSearch);
            }

            App.htmlElements.filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener("change", App.handlers.handleFilterChange);
            });

            App.methods.checkAccess();
            App.methods.updateUserEmail();
            App.methods.fetchTalents();
        },
        handlers: {
            handleLogout(event) {
                event.preventDefault();
                sessionStorage.removeItem("currentUser");
                window.location.href = 'Login.html';
            },
            handleSearch(event) {
                App.data.searchQuery = event.target.value;
                App.methods.fetchTalents();
            },
            handleFilterChange(event) {
                const { name, value, checked } = event.target;
                if (checked) {
                    App.data.filters[name].push(value);
                } else {
                    App.data.filters[name] = App.data.filters[name].filter(v => v !== value);
                }
                App.methods.fetchTalents();
            }
        },
        methods: {
            checkAccess() {
                if (!App.data.currentUser) {
                    window.location.href = 'Login.html';
                }
            },
            updateUserEmail() {
                if (App.htmlElements.userEmail && App.data.currentUser) {
                    App.htmlElements.userEmail.textContent = App.data.currentUser.email;
                }
            },
            async fetchTalents() {
                const filters = App.data.filters;
                const searchQuery = App.data.searchQuery;

                // Fetch talents from backend
                const response = await fetch(`/api/talents?search=${searchQuery}&filters=${JSON.stringify(filters)}`);
                const talents = await response.json();

                App.methods.renderTalents(talents);
            },
            renderTalents(talents) {
                App.htmlElements.talentsContainer.innerHTML = '';
                talents.forEach(talent => {
                    const talentCard = `
                        <div class="mb-6 p-4 bg-white rounded shadow">
                            <h2 class="text-xl font-bold mb-2">${talent.name} - ${talent.skills.join(', ')}</h2>
                            <p class="mb-2">${talent.description}</p>
                            <div class="flex justify-between items-center">
                                <button class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Postular perfil</button>
                                <a href="#" class="text-blue-500 hover:underline">Ver más información</a>
                            </div>
                        </div>
                    `;
                    App.htmlElements.talentsContainer.insertAdjacentHTML('beforeend', talentCard);
                });
            }
        }
    };

    App.init();
})();
