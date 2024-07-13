document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
<<<<<<< HEAD
    const type = document.getElementById('accountType').value;

    // Validar la complejidad de la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
=======
    const accountType = document.getElementById('accountType').value;

    // Validar la complejidad de la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
>>>>>>> fffdccce1b84cb9318ca45ec445c817e78d31706
    if (!passwordRegex.test(password)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo.');
        return;
    }

    const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
<<<<<<< HEAD
        body: JSON.stringify({ username, email, password, type })
=======
        body: JSON.stringify({ username, email, password, accountType })
>>>>>>> fffdccce1b84cb9318ca45ec445c817e78d31706
    });

    const result = await response.json();

    if (response.ok) {
        alert('Registro exitoso');
<<<<<<< HEAD
        window.location.href = 'login.html';
    } else {
        alert('Error: ' + result.message);
    }
});
=======
    } else {
        alert('Error: ' + result.message);
    }
});
>>>>>>> fffdccce1b84cb9318ca45ec445c817e78d31706
