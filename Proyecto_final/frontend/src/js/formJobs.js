document.addEventListener('DOMContentLoaded', function() {
    const cancelButton = document.getElementById('cancel-button');

    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            window.history.back();
        });
    }

    document.getElementById('create-button').addEventListener('click', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(document.getElementById('formNewJob'));
        const title = formData.get('title');
        const description = formData.get('description');
        const area = formData.get('area');
        const salary = formData.get('money');

        let missingFields = [];

        if (!title) {
            missingFields.push('título');
        }
        if (!description) {
            missingFields.push('descripción');
        }
        if (!area) {
            missingFields.push('área');
        }
        if (!salary) {
            missingFields.push('salario');
        }

        if (missingFields.length > 0) {
            alert('Por favor completa los siguientes campos: ' + missingFields.join(', ') + '.');
            return;
        }

  
        const programmingLanguages = Array.from(formData.getAll('programming_language')).filter(lang => lang).join(', ');

        if (!programmingLanguages) {
            alert('Por favor selecciona al menos un lenguaje de programación.');
            return;
        }

        const linkPay = document.getElementById('linkPay');
        if (!linkPay.checked) {
            alert('Por favor acepta los términos de pago y autorización.');
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const token = currentUser ? currentUser.token : null;

        if (!token) {
            alert('No se encontró un token de autenticación. Por favor inicia sesión nuevamente.');
            return;
        }

        const jobData = {
            title: title,
            description: description,
            area: area,
            salary: salary,
            programming_language: programmingLanguages,
            contractor_id : currentUser.email
        };

        // creaccion de pago
        try {

            await fetch('http://localhost:3000/api/jobs/createJob', {
                 method: 'POST', 
                 headers: {
                    'Authorization': `Bearer ${token}`,  
                     'Content-Type': 'application/json'
            },
                 body: JSON.stringify(jobData)
            });

            // Crear el orden
            await fetch('http://localhost:3000/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.approval_url) {
                // Redirigir al usuario a PayPal para aprobar el pago
                window.location.href = data.approval_url;
                } else {
                alert('Error creando pago')
                }
            })
            .catch(error => console.error('Error:', error));
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la conexión. Por favor, inténtalo de nuevo.');
        }
    });
});
