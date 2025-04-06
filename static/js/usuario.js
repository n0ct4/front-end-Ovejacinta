document.addEventListener('DOMContentLoaded', function() {
    // Obtiene los datos del usuario almacenados
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
        // Actualiza el nombre en el sidebar
        const sidebarNombre = document.querySelector('.sidebar h6');
        if (sidebarNombre) {
            sidebarNombre.textContent = userData.username || 'Usuario';
        }
        
        // Actualiza el título de bienvenida
        const tituloBienvenida = document.querySelector('.user-welcome h4');
        if (tituloBienvenida) {
            welcomeTitle.textContent = `Bienvenido, ${userData.username || 'Usuario'}!`;
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