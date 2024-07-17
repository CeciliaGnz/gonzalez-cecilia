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

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const token = currentUser ? currentUser.token : null;

    if (!token) {
        window.location.href = 'Login.html';
    } else {
        userEmail.textContent = currentUser.email;
        fetchUserProfile();
        fetchJobs();
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.href = 'Login.html';
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'profileContractor.html';
        });
    }

    userEmail.addEventListener('click', function() {
        userMenu.classList.toggle('hidden');
    });

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
        console.log(user);

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
                    fetchUserProfile();
                } else {
                    alert('Error al actualizar el perfil.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });
    }

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

    function displayJobs(jobs) {
        const jobsList = document.querySelector('.accordion');
        jobsList.innerHTML = jobs.length ? jobs.map(job => `
            <li class="cursor-pointer m-3" data-job-id="${job._id}">
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
                            <li class="flex justify-between items-center" data-applicant-id="${applicant._id}">
                                <span>${applicant.name} - Postulado el ${new Date(applicant.date).toLocaleDateString()}</span>
                                <div class="flex space-x-2">
                                    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Ver perfil</button>
                                    <button 
                                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700" 
                                        onclick="aceptarPostulante(this)" 
                                        data-job-id="${job._id}" 
                                        data-applicant-id="${applicant._id}">
                                        Aceptar postulante
                                    </button>
                                </div>
                            </li>
                        `).join('') : '<li class="text-center text-gray-500">Sin postulantes por ahora.</li>'}
                    </ul>
                </div>
            </li>
            <br>
        `).join('') : '<p class="text-center text-gray-500">No tienes trabajos creados.</p>';
        
        // Debugging
        console.log('Jobs displayed:', jobs);

        document.querySelectorAll('.accordion li').forEach(li => {
            li.addEventListener('click', function() {
                const content = this.querySelector('div');
                if (content) {
                    content.classList.toggle('hidden');
                }
            });
        });
    }

    window.aceptarPostulante = async function(button) {
        if (confirm("¿Está seguro de que desea aceptar a este postulante? Esto rechazará a todos los demás postulantes.")) {
            const applicantLi = button.closest('li');
            const acceptedApplicantId = button.dataset.applicantId;
            const jobId = button.dataset.jobId;

            console.log('Job ID:', jobId);

            if (!acceptedApplicantId || !jobId) {
                alert('No se pudo obtener el ID del postulante o del trabajo.');
                return;
            }

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
                    applicantLi.innerHTML = `
                        <span class="font-semibold text-lg tracking-tight text-gray-500">
                            Persona encargada: <span>${applicantLi.querySelector('span').textContent.split(' - ')[0]}</span>
                        </span>
                    `;

                    const jobLi = applicantLi.closest('li[data-job-id]');
                    const applicantsList = jobLi.querySelector('div ul');
                    const remainingApplicants = applicantsList.querySelectorAll('li');

                    remainingApplicants.forEach(li => {
                        if (li !== applicantLi) {
                            li.remove();
                        }
                    });

                    alert('Postulante aceptado exitosamente.');
                } else {
                    console.error('Error accepting applicant:', response.statusText);
                }
            } catch (error) {
                console.error('Error accepting applicant:', error);
            }
        }
    };
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

// Accordion functionality
$(document).on('click', '.accordion li', function() {
    $(this).find('div').slideToggle();
    $(this).find('svg').toggleClass('flipY');
});