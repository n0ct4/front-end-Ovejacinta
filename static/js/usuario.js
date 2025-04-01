document.addEventListener('DOMContentLoaded', function() {
    // Obtiene los datos del usuario almacenados
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
        // Actualiza el nombre en el sidebar
        const sidebarName = document.querySelector('.sidebar h6');
        if (sidebarName) {
            sidebarName.textContent = userData.username || 'Usuario';
        }
        
        // Actualiza el título de bienvenida
        const welcomeTitle = document.querySelector('.user-welcome h4');
        if (welcomeTitle) {
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