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

        const jobData = {
            title: title,
            description: description,
            area: area,
            salary: salary,
            programming_language: programmingLanguages 
        };

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const token = currentUser ? currentUser.token : null;

        if (!token) {
            alert('No se encontró un token de autenticación. Por favor inicia sesión nuevamente.');
            return;
        }

        try {
            const response = await fetch('/api/jobs/createJob', {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${token}`,  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                alert('Trabajo creado exitosamente.');
                window.location.href = '/api/payments/create-order'; 
            } else {
                const errorData = await response.json();
                alert('Error al crear el trabajo: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la conexión. Por favor, inténtalo de nuevo.');
        }
    });
});
