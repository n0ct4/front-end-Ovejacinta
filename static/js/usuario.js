document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken'); 
    
    // Si no hay token, redirige a LOGIN
    if (!authToken) {
        window.location.href = "/";
        return; 
    }

    // Si hay token carga los datos del usuario
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
        
        const sidebarNombre = document.querySelector('.sidebar h6');
        if (sidebarNombre) {
            sidebarNombre.textContent = userData.username || 'Usuario';
        }
        
        // Actualiza el titulo de bienvenida
        const tituloBienvenida = document.querySelector('.user-welcome h4');
        if (tituloBienvenida) {
            tituloBienvenida.textContent = `Bienvenido, ${userData.username || 'Usuario'}!`;
        }  
    } 
    
    // Manejo del logout
    const logoutBtn = document.querySelector('.sidebar-item:last-child');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = "/";
        });
    }
});