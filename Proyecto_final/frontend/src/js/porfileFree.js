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
    }

    // Save profile changes
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', async () => {
            const phone = phoneInput.value;
            const nationality = nationalityInput.value;
            const username = usernameInput.value;

            try {
                const response = await fetch('/api/users/meTalent', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ phone, nationality, username })
                });

                if (response.ok) {
                    alert('Perfil actualizado con éxito.');
                    fetchUserProfile(); // Opcionalmente, vuelve a cargar los datos
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
                    <p>Trabajo: <span>${app.job_id.title}</span></p>
                    <p>Status: <span>${app.status}</span></p>
                </span>
                <div class="text-gray-500 text-md p-2">
                    <p>Fecha de aplicación: ${new Date(app.date).toLocaleDateString()}</p>
                    <div class="flex space-x-2">
                        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Ver trabajo</button>
                    </div>
                </div>
            </li>
        `).join('') : '<p class="text-center text-gray-500">No tienes aplicaciones.</p>';
    }
});


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
