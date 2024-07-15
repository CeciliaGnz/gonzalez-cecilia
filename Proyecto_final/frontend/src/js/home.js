(() => {
    const App = {
        htmlElements: {
            logoutBtn: document.querySelector("#logout-btn"),
            profileBtn: document.querySelector("#profile-btn"),
            searchInput: document.querySelector("#search-input"),
            filterCheckboxes: document.querySelectorAll(".filter-checkbox"),
            jobsContainer: document.querySelector("#jobs-container"),
            userEmail: document.querySelector("#user-email"),
            userMenu: document.querySelector("#user-menu"),
        },
        data: {
            currentUser: JSON.parse(sessionStorage.getItem("currentUser")) || null,
            filters: {
                area: [],
                language: [],
                salary: []
            },
            searchQuery: '',
            jobs: []
        },
        init() {
            // Asignación de eventos
            if (App.htmlElements.logoutBtn) {
                App.htmlElements.logoutBtn.addEventListener("click", App.handlers.handleLogout);
            }

            if (App.htmlElements.profileBtn) {
                App.htmlElements.profileBtn.addEventListener("click", App.handlers.handleProfile);
            }

            if (App.htmlElements.searchInput) {
                App.htmlElements.searchInput.addEventListener("input", App.handlers.handleSearch);
            }

            App.htmlElements.filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener("change", App.handlers.handleFilterChange);
            });

            if (App.htmlElements.userEmail) {
                App.htmlElements.userEmail.addEventListener("click", App.handlers.toggleUserMenu);
            }

            App.methods.checkAccess();
            App.methods.updateUserEmail();
            App.methods.fetchJobs();
        },
        handlers: {
            handleLogout(event) {
                event.preventDefault();
                sessionStorage.removeItem("currentUser");
                window.location.href = 'Login.html';
            },
            handleProfile(event) {
                event.preventDefault();
                window.location.href = 'index.html';
            },
            handleSearch(event) {
                App.data.searchQuery = event.target.value;
                App.methods.applyFilters();
            },
            handleFilterChange(event) {
                const { name, value, checked } = event.target;
                if (checked) {
                    App.data.filters[name].push(value);
                } else {
                    App.data.filters[name] = App.data.filters[name].filter(v => v !== value);
                }
                App.methods.applyFilters();
            },
            toggleUserMenu() {
                App.htmlElements.userMenu.classList.toggle("hidden");
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
            async fetchJobs() {
                try {
                    const response = await fetch('http://localhost:3000/api/jobs/',{
                        headers: {
                            'Authorization': `${App.data.currentUser.token}`
                        }
                    });
                    const jobs = await response.json();
                    App.data.jobs = jobs;
                    App.methods.applyFilters();
                } catch (error) {
                    console.error('Error fetching jobs:', error);
                }
            },
            applyFilters() {
                let filteredJobs = App.data.jobs;
                
                const filters = App.data.filters;
                const searchQuery = App.data.searchQuery.toLowerCase();
                
                if (searchQuery) {
                    filteredJobs = filteredJobs.filter(job =>
                        job.title.toLowerCase().includes(searchQuery) ||
                        job.skills.some(skill => skill.toLowerCase().includes(searchQuery))
                    );
                }

                if (filters.area.length) {
                    filteredJobs = filteredJobs.filter(job =>
                        filters.area.includes(job.area)
                    );
                }

                if (filters.language.length) {
                    filteredJobs = filteredJobs.filter(job =>
                        filters.language.some(language => job.skills.includes(language))
                    );
                }

                if (filters.salary.length) {
                    filteredJobs = filteredJobs.filter(job =>
                        filters.salary.includes(job.salary)
                    );
                }
                App.methods.renderJobs(filteredJobs);
            },
            renderJobs(jobs) {
                App.htmlElements.jobsContainer.innerHTML = '';
                jobs.forEach(job => {
                    const jobCard = `
                        <div class="mb-6 p-4 bg-purple-100 rounded shadow text-black">
                            <h2 class="text-xl font-bold mb-2">${job.title}</h2>
                            <p class="mb-2">${job.description}</p>
                            <div class="flex justify-between items-center">
                                <button class="bg-purple-600 text-white p-2 rounded hover:bg-purple-400">Postular perfil</button>
                                <a href="#" class="text-purple-400 hover:underline">Ver más información</a>
                            </div>
                        </div>
                    `;
                    App.htmlElements.jobsContainer.insertAdjacentHTML('beforeend', jobCard);
                });
            }
        }
    };

    App.init();
})();
