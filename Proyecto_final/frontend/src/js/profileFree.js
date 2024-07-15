document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const logoutBtn = document.getElementById('logout-btn');
    const profileBtn = document.getElementById('profile-btn');
    const userEmail = document.getElementById('user-email');
    const userMenu = document.getElementById('user-menu');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const phoneInput = document.getElementById('phone');
    const nationalityInput = document.getElementById('nationality');
    const usernameInput = document.getElementById('username');
    const educationInput = document.getElementById('education');
    const skillsInput = document.getElementById('skills');
    const languagesInput = document.getElementById('languages');
    const portfolioInput = document.getElementById('portfolio');
    const linkedinInput = document.getElementById('linkedin');

    // Initialize user data
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const token = currentUser ? currentUser.token : null;

    // Check if user is logged in
    if (!token) {
        window.location.href = 'Login.html';
    } else {
        userEmail.textContent = currentUser.email;
        fetchUserProfile(); // Fetch user profile on load
        fetchApplications(); // Fetch user applications on load
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.href = 'Login.html';
        });
    }

    // Profile redirection
    if (profileBtn) {
        profileBtn.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'profileContractor.html';
        });
    }

    // Toggle user menu
    userEmail.addEventListener('click', function() {
        userMenu.classList.toggle('hidden');
    });

    // Fetch user profile
    async function fetchUserProfile() {
        try {
            const response = await fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                populateProfile(user);
            } else {
                alert('Error al cargar el perfil.');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    function populateProfile(user) {
        document.getElementById('email').value = user.email;
        document.getElementById('profile-email').textContent = user.email || '';
        document.getElementById('welcome-profile-name').textContent = user.username || '';
        document.getElementById('profile-name-display').textContent = user.username || '';
        phoneInput.value = user.profile.phone || '';
        document.getElementById('profile-phone').textContent = user.profile.phone || '';
        nationalityInput.value = user.profile.nationality || '';
        document.getElementById('profile-nationality').textContent = user.profile.nationality || '';
        usernameInput.value = user.username || '';
        educationInput.value = user.profile.education || '';
        skillsInput.value = user.profile.skills || '';
        languagesInput.value = user.profile.languages || '';
        portfolioInput.value = user.profile.portfolio || '';
        linkedinInput.value = user.profile.linkedin || '';
    }

    // Save profile changes
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', async () => {
            const phone = phoneInput.value;
            const nationality = nationalityInput.value;
            const username = usernameInput.value;
            const education = educationInput.value;
            const skills = skillsInput.value;
            const languages = languagesInput.value;
            const portfolio = portfolioInput.value;
            const linkedin = linkedinInput.value;

            try {
                const response = await fetch('/api/users/meTalent', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ phone, nationality, username, education, skills, languages, portfolio, linkedin })
                });

                if (response.ok) {
                    alert('Perfil actualizado con éxito.');
                    fetchUserProfile(); // Reload user profile data
                } else {
                    alert('Error al actualizar el perfil.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });
    }

    // Fetch applications
    async function fetchApplications() {
        try {
            const response = await fetch('/api/jobs/applications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const applications = await response.json();
            displayApplications(applications);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }

    // Display applications
    function displayApplications(applications) {
        const applicationsList = document.querySelector('.accordion');
        applicationsList.innerHTML = applications.length ? applications.map(app => `
            <li class="cursor-pointer m-6">
                <span class="font-bold text-xl tracking-tight text-purple-500 flex justify-between items-center">
                    <p class="flex items-center">
                        Trabajo: <span class="flex items-center ml-1">${app.job_id ? app.job_id.title : 'Trabajo no encontrado'}</span>
                        <button onclick="deleteApplication('${app._id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="h-5 w-5 ml-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </p>
                    <p>Contratista: <span>${app.job_id && app.job_id.contractor_id ? app.job_id.contractor_id.username : 'Contratista no encontrado'}</span></p>
                </span>
                <div class="text-gray-500 text-md p-2">
                    <p>Estado de postulación: <span>${app.status}</span></p>
                    <p>Fecha de aplicación: ${new Date(app.date).toLocaleDateString()}</p>
                </div>
            </li>
        `).join('') : '<p class="text-center text-gray-500">No tienes postulaciones por ahora.</p>';
    }


// Function to accept an applicant
async function aceptarPostulante(button) {
    if (confirm("¿Está seguro de que desea aceptar a este postulante? Esto rechazará a todos los demás postulantes.")) {
        const li = button.closest('li');
        const jobId = li.parentElement.parentElement.getAttribute('data-job-id'); // Obtén el ID del trabajo desde el atributo de datos.

        const acceptedApplicantId = li.querySelector('span').textContent.split(' - ')[0]; // Obtener el ID del postulante aceptado

        try {
            const response = await fetch(`/api/jobs/${jobId}/acceptApplicant`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ acceptedApplicantId })
            });

            if (response.ok) {
                alert('Postulante aceptado con éxito.');
                fetchJobs(); // Vuelve a cargar la lista de trabajos
            } else {
                alert('Error al aceptar el postulante.');
            }
        } catch (error) {
            console.error('Error al aceptar el postulante:', error);
        }
    }
}

    // Función para eliminar una postulación
    window.deleteApplication = async function(applicationId) {
        if (confirm('¿Estás seguro de que deseas eliminar esta postulación?')) {
            try {
                const response = await fetch(`/api/jobs/applications/${applicationId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Error al eliminar la postulación');
                fetchApplications(); // Refresca la lista de postulaciones
            } catch (error) {
                console.error('Error eliminando la postulación:', error);
            }
        }
    }
});

// Función para abrir tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.add("hidden"); // Oculta todos los tabs
    }
    tablinks = document.getElementsByTagName("button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active:bg-purple-200");
    }
    document.getElementById(tabName).classList.remove("hidden"); // Muestra el tab seleccionado
    if (evt) {
        evt.currentTarget.classList.add("active:bg-purple-200");
    }

    // Actualiza la URL para reflejar el tab activo
    history.replaceState(null, null, `?tab=${tabName.substr(3)}`);
}
