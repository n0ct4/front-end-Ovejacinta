document.addEventListener('DOMContentLoaded', async function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(!userData) {
        window.location.href = "/login";
    }

});

/**
 * Cuando terminamos de cargar la pantalla de perfil, cargamos los valores recogidos del login y buscamos al turista que concuerde con el id del usuario
 * De esta forma, cargamos los valores de la variable data en cada campo del html
 */
document.addEventListener('DOMContentLoaded', async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    try {
        // LLamamos al endpoint de la API para conseguir el turista
        const response = await fetch(`http://localhost:5065/api/Usuario/${userData.id}`);
        const data = await response.json();
        var genero;

        document.querySelector('input[placeholder="nombre"]').value = data.nombre || '';
        document.querySelector('input[placeholder="surname"]').value = data.apellido1 || '';
        document.querySelectorAll('input[placeholder="surname"]')[1].value = data.apellido2 || ''; 

        // Si, esto es una funcion que hardcodea el geneor en funcion del idGenero, y que pasa
        if (data.idGenero == 1)
            genero = "Hombre";
        else if (data.idGenero == 2)
            genero = "Mujer";
        else
            genero = "-";

        document.querySelector('input[placeholder="enter address line 2"]').value = genero || ''; 

        document.querySelector('input[placeholder="enter address line 1"]').value = data.edad || '';
        document.querySelectorAll('input[placeholder="enter address line 2"]')[1].value = data.numeroViajes || ''; 

        document.querySelector('input[placeholder="country"]').value = data.pais || '';
        document.querySelector('input[placeholder="state"]').value = data.comunidadAutonoma || '';

        document.querySelector('input[placeholder="enter phone number"]').value = userData.correo || '';

    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
    }
});

 