document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const accountType = document.getElementById('accountType').value;

    // Validar la complejidad de la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo.');
        return;
    }

    const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, accountType })
    });

    const result = await response.json();

    if (response.ok) {
        alert('Registro exitoso');
    } else {
        alert('Error: ' + result.message);
    }
});
