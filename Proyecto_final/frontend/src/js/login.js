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
        const email  = result.email
        const type = result.type
        const token = result.token
        sessionStorage.setItem("currentUser", JSON.stringify({email, type, token}));
        if(type == 'talent')
            {
            window.location.href = 'home.html';
            }
        else{
            window.location.href = 'index.html';
        }
    } else {
        alert('Error: ' + result.message);
    }
});