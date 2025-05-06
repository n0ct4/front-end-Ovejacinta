document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('menu-boton');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('minimized');

                // Si el sidebar se minimiza, agrega clase "expanded" al main-content
                if (sidebar.classList.contains('minimized')) {
                    mainContent.classList.add('expanded');
                } else {
                    mainContent.classList.remove('expanded');
                }
        
    });

});