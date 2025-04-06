document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mensaje de errores
        document.querySelectorAll('[id$="Error"]').forEach(el => {
            el.textContent = '';
            el.classList.add('hidden');
        });
        
        document.getElementById('successMessage').classList.add('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
        
        // coger los datos
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            confirmEmail: document.getElementById('confirmEmail').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };
        
        // validar el formulario
        let isValid = true;
        
        // Campos obligatorios
        if (!formData.firstName) {
            showError('firstName', 'El nombre es requerido');
            isValid = false;
        }
        
        if (!formData.lastName) {
            showError('lastName', 'Los apellidos son requeridos');
            isValid = false;
        }
        
        if (!formData.email) {
            showError('email', 'El correo electrónico es requerido');
            isValid = false;
        } else {
            // Formato del correo electrónico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showError('email', 'Formato de correo electrónico inválido');
                isValid = false;
            }
        }
        
        if (!formData.confirmEmail) {
            showError('confirmEmail', 'La confirmación de correo es requerida');
            isValid = false;
        } else if (formData.email !== formData.confirmEmail) {
            showError('confirmEmail', 'Los correos electrónicos no coinciden');
            isValid = false;
        }
        
        if (!formData.password) {
            showError('password', 'La contraseña es requerida');
            isValid = false;
        } else if (formData.password.length < 8) {
            showError('password', 'La contraseña debe tener al menos 8 caracteres');
            isValid = false;
        }
        
        if (!formData.confirmPassword) {
            showError('confirmPassword', 'La confirmación de contraseña es requerida');
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            showError('confirmPassword', 'Las contraseñas no coinciden');
            isValid = false;
        }
        
        if (!isValid) return;
        
        try {
            // enviar los datos al servidor
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Mostrar mensaje de éxito
                document.getElementById('successMessage').classList.remove('hidden');
                
                // Resetear el formulario
                form.reset();
                
                // Ocultar el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    document.getElementById('successMessage').classList.add('hidden');
                }, 3000);
            } else {
                // Mostrar mensaje de error
                document.getElementById('errorMessage').textContent = data.error || 'Error al enviar el formulario';
                document.getElementById('errorMessage').classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('errorMessage').classList.remove('hidden');
        }
    });
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        document.getElementById(fieldId).classList.add('border-red-500');
    }
    
    // Eliminar los mensajes cuando el usuario se pone encima del campo
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(`${this.id}Error`);
            if (errorElement) {
                errorElement.classList.add('hidden');
                this.classList.remove('border-red-500');
            }
        });
    });
});