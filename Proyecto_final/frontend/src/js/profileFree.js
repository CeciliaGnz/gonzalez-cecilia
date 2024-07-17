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
            <button class="text-red-700 ml-2 flex items-center" onclick="deleteApplication('${app._id}')">
                <span class="ml-1 text-red-600">Eliminar</span>
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
        tabcontent[i].classList.add("hidden"); 
    }
    tablinks = document.getElementsByTagName("button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active:bg-purple-200");
    }
    document.getElementById(tabName).classList.remove("hidden");
    if (evt) {
        evt.currentTarget.classList.add("active:bg-purple-200");
    }

    history.replaceState(null, null, `?tab=${tabName.substr(3)}`);
}