(() => {
    const App = {
        htmlElements: {
            logoutBtn: document.querySelector("#logout-btn"),
            profileBtn: document.querySelector("#profile-btn"),
            searchInput: document.querySelector("#search-input"),
            // filterCheckboxes: document.querySelectorAll(".filter-checkbox"),
            jobsContainer: document.querySelector("#jobs-container"),
            userEmail: document.querySelector("#user-email"),
            userMenu: document.querySelector("#user-menu"),

            // Area de filtros
            areaFilter : document.getElementById('areaFilter'),
            languageFilter : document.getElementById('languageFilter'),
            salaryFilter : document.getElementById('salaryFilter'),
        },
        data: {
            currentUser: JSON.parse(sessionStorage.getItem("currentUser")) || null,
            
            // Filtros aplicados
            filters: {
                area: [],
                language: [],
                salary: []
            },

            // Search aplicado
            searchQuery: '',

            //Trabajos almacenados
            jobs: [],

            //Lista de filtros disponibles
            areaOptions: [],
            languageOptions: [],
            salaryOptions: []
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

            // App.htmlElements.filterCheckboxes.forEach(checkbox => {
            //     console.log("Aqui")
            //     checkbox.addEventListener("change", App.handlers.handleFilterChange);
            // });

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

            // Agregacion o eliminacion de filtro aplicados.
            handleFilterChange(event) {
                const { name, value, checked } = event.target;
                console.log(value)
                console.log("Se aplicaron estos filtros")
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
            /** async fetchJobs() {
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
            }, **/
            async fetchJobs() {
                try {
                    const response = await fetch('http://localhost:3000/api/jobs/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `${App.data.currentUser.token}`
                        }
                    });
                    
                    const jobs = await response.json();

                    // Generar lista de áreas
                    const areas = [...new Set(jobs.map(job => job.area))];

                    // Generar lista de lenguajes de programación
                    let languagesSet = new Set();
                    jobs.forEach(job => {
                        if (job.programming_language) {
                            job.programming_language.split(',').forEach(lang => {
                                languagesSet.add(lang.trim());
                            });
                        }
                    });
                    const languages = [...languagesSet];

                    // Guardar los trabajos y filtros generados en el estado de la aplicación
                    App.data.jobs = jobs;
                    App.data.areaOptions = areas;
                    App.data.languageOptions = languages;
                    App.data.salaryOptions = ["0 - 1000/dolares", "1000 - 2000/dolares", "2000+/dolares"];

                    App.methods.renderFilters();
                    App.methods.renderJobs(jobs);
                } catch (error) {
                    console.error('Error fetching jobs:', error);
                }
                    
            },
            applyFilters() {
                
                let filteredJobs = App.data.jobs;
            
                const filters = App.data.filters;
                const searchQuery = App.data.searchQuery.toLowerCase();
            
                // Filtro de búsqueda
                if (searchQuery) {
                    filteredJobs = filteredJobs.filter(job =>
                        job.title.toLowerCase().includes(searchQuery)
                    );
                }
            
                // Filtro de área
                if (filters.area.length) {
                    filteredJobs = filteredJobs.filter(job =>
                        filters.area.includes(job.area)
                    );
                }
            
                // Filtro de idioma
                if (filters.language.length) {
                    filteredJobs = filteredJobs.filter(job =>
                        job.programming_language && filters.language.some(language => job.programming_language.includes(language))
                    );
                }
            
                // Filtro de salario
                if (filters.salary.length) {
                    filteredJobs = filteredJobs.filter(job => {
                        console.log(job.salary)
                        const jobSalary = parseFloat(job.salary);
                        return filters.salary.some(range => {
                            range = range.replace('/dolares', '')
                            range = range.replace('+', '')
                            const [min, max] = range.split('-').map(s => parseFloat(s));
                            return jobSalary >= min && (max ? jobSalary <= max : true);
                        });
                    });
                }
            
                App.methods.renderJobs(filteredJobs);
            },
            
            /** applyFilters() {
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
            }, **/
            renderFilters() {
                // Renderizar filtros de áreas
                
                App.htmlElements.areaFilter.innerHTML = App.data.areaOptions.map(area =>
                    `<label><input type="checkbox" name="area" value="${area}" class="mr-2 ml-2 filter-checkbox"> ${area}</label>`
                ).join('');
            
                // Renderizar filtros de lenguajes de programación
                
                App.htmlElements.languageFilter.innerHTML = App.data.languageOptions.map(language =>
                    `<label><input type="checkbox" name="language" value="${language}" class="mr-2 ml-2 filter-checkbox"> ${language}</label>`
                ).join('');
            
                // Renderizar filtros de salarios
                
                App.htmlElements.salaryFilter.innerHTML = App.data.salaryOptions.map(salary =>
                    `<label><input type="checkbox" name="salary" value="${salary}" class="mr-2  ml-2 filter-checkbox"> ${salary}</label>`
                ).join('');

                // Asignar eventos a los checkboxes después de renderizarlos
                App.htmlElements.filterCheckboxes = document.querySelectorAll(".filter-checkbox");
                App.htmlElements.filterCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener("change", App.handlers.handleFilterChange);
                });
            },
            renderJobs(jobs) {
                App.htmlElements.jobsContainer.innerHTML = '';
                jobs.forEach(job => {
                    const jobCard = `
                        <div class="mb-6 p-4 bg-white rounded shadow">
                            <h2 class="text-xl font-bold mb-2">${job.title}</h2>
                            <p class="mb-2">${job.description}</p>
                            <div class="flex justify-between items-center">
                                <button class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Postular perfil</button>
                                <a href="#" class="text-blue-500 hover:underline">Ver más información</a>
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
