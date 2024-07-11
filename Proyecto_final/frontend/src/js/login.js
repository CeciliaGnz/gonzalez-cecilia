document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        if (result.accountType === 'contractor') {
            window.location.href = '/ruta/a/contratista.html'; // Cambia esta ruta a la página de contratista
        } else if (result.accountType === 'talent') {
            window.location.href = '/ruta/a/talento.html'; // Cambia esta ruta a la página de talento
        }
    } else {
        alert('Error: ' + result.message);
    }
});
