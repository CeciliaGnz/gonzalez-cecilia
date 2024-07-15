document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const logoutBtn = document.getElementById('logout-btn');
    const profileBtn = document.getElementById('profile-btn');
    const userEmail = document.getElementById('user-email');
    const userMenu = document.getElementById('user-menu');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const phoneInput = document.getElementById('phone');
    const companyInput = document.getElementById('company');
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
        console.log(user); // Verifica el objeto 'user'

        document.getElementById('email').value = user.email;
        document.getElementById('profile-email').textContent = user.email || '';
        document.getElementById('welcome-profile-name').textContent = user.username || '';
        document.getElementById('profile-name-display').textContent = user.username || '';
        phoneInput.value = user.profile.phone || '';
        document.getElementById('profile-phone').textContent = user.profile.phone || '';
        companyInput.value = user.profile.company || '';
        document.getElementById('profile-company').textContent = user.profile.company || '';
        nationalityInput.value = user.profile.nationality || '';
        document.getElementById('profile-nationality').textContent = user.profile.nationality || '';
        usernameInput.value = user.username || '';
    }

    // Save profile changes
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', async () => {
            const phone = phoneInput.value;
            const company = companyInput.value;
            const nationality = nationalityInput.value;
            const username = usernameInput.value;

            try {
                const response = await fetch('/api/users/me', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ phone, company, nationality, username })
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

    // Fetch jobs
    async function fetchJobs() {
        try {
            const response = await fetch('/api/jobs/contractor', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const jobs = await response.json();
            displayJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    }

    // Display jobs
    function displayJobs(jobs) {
        const jobsList = document.querySelector('.accordion');
        jobsList.innerHTML = jobs.length ? jobs.map(job => `
            <li class="cursor-pointer m-6">
                <span class="font-bold text-xl tracking-tight text-purple-500 flex justify-between items-center">
                    <p>Título: <span>${job.title}</span></p>
                    <span class="flex items-center">
                        <p class="font-normal text-base text-gray-700 mr-2">Postulantes</p>
                        <svg class="text-purple-600" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="currentColor" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                        </svg>
                    </span>
                </span>
                <div class="text-gray-500 text-md p-2 hidden">
                    <ul class="space-y-4">
                        ${job.applicants.length ? job.applicants.map(applicant => `
                            <li class="flex justify-between items-center">
                                <span>${applicant.name} - Postulado el ${new Date(applicant.date).toLocaleDateString()}</span>
                                <div class="flex space-x-2">
                                    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Ver perfil</button>
                                    <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700" onclick="aceptarPostulante(this)">Aceptar postulante</button>
                                </div>
                            </li>
                        `).join('') : '<li class="text-center text-gray-500">Sin postulantes por ahora.</li>'}
                    </ul>
                </div>
            </li>
        `).join('') : '<p class="text-center text-gray-500">No tienes trabajos creados.</p>';
    }

    // Initial fetch call for jobs
    fetchJobs();
});

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
    evt.currentTarget.classList.add("active:bg-purple-200");
}

// Function to accept an applicant
function aceptarPostulante(button) {
    if (confirm("¿Está seguro de que desea aceptar a este postulante? Esto rechazará a todos los demás postulantes.")) {
        const li = button.closest('li');
        li.innerHTML = `
            <span class="font-semibold text-lg tracking-tight text-gray-500 flex justify-between items-center">
                <p>Persona encargada: <span>${li.querySelector('span').textContent.split(' - ')[0]}</span></p>
            </span>
        `;
        const ul = li.closest('ul');
        const lis = ul.querySelectorAll('li');
        lis.forEach(l => {
            if (l !== li) {
                l.remove();
            }
        });
    }
}

// Accordion functionality
$(document).on('click', '.accordion li', function() {
    $(this).find('div').slideToggle();
    $(this).find('svg').toggleClass('flipY');
});
