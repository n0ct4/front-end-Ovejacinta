async function cambiarNombreUsuario() {
    const nombreInput = document.querySelector('input[placeholder="Nombre de usuario"]');
    const nuevoNombre = nombreInput.value.trim();
    
    if (!nuevoNombre) {
        alert('Por favor ingresa un nombre de usuario válido');
        return;
    }

    let userData;
    try {
        userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.id) {
            throw new Error('Datos de usuario no encontrados');
        }

        const updateResponse = await fetch(`http://localhost:5065/api/Usuario/NombreUsuario`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            },
            body: JSON.stringify({ 
                id: userData.id,
                nombreUsuario: nuevoNombre,
                correo: userData.correo
            })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar el nombre');
        }

        const getResponse = await fetch(`http://localhost:5065/api/Usuario/Usuario/${userData.id}`, {
            headers: {
                'Authorization': `Bearer ${userData.token}`
            }
        });

        if (!getResponse.ok) {
            throw new Error('Error al obtener datos actualizados');
        }

        const updatedUser = await getResponse.json();

        const newUserData = {
            ...userData,
            id: updatedUser.id,
            username: updatedUser.nombreUsuario || updatedUser.username, 
            correo: updatedUser.correo
        };

        localStorage.setItem('userData', JSON.stringify(newUserData));
        nombreInput.value = newUserData.username

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

document.getElementById('btnCambioPerfil').addEventListener('click', cambiarNombreUsuario);

document.addEventListener('DOMContentLoaded', async function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
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

        localStorage.setItem(
            "turistaData",
            JSON.stringify({
                id: data.id
            })
        );

        document.querySelector('input[placeholder="Nombre de usuario"]').value = userData.username || '';
        document.querySelector('input[placeholder="nombre"]').value = data.nombre || '';
        document.querySelector('input[placeholder="Apellido1"]').value = data.apellido1 || '';
        document.querySelector('input[placeholder="Apellido2"]').value = data.apellido2 || '';

        // Si, esto es una funcion que hardcodea el geneor en funcion del idGenero, y que pasa
        if (data.idGenero == 1)
            genero = "Hombre";
        else if (data.idGenero == 2)
            genero = "Mujer";
        else
            genero = "-";

        document.querySelector('input[placeholder="Genero"]').value = genero || '';

        document.querySelector('input[placeholder="Edad"]').value = data.edad || '';
        document.querySelector('input[placeholder="Viajes"]').value = data.numeroViajes || '';

        document.querySelector('input[placeholder="Pais"]').value = data.pais || '';
        document.querySelector('input[placeholder="Comunidad"]').value = data.comunidadAutonoma || '';

        document.querySelector('input[placeholder="Correo"]').value = userData.correo || '';

    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
    }
});

/**
 * Funcion que se encarga de permitir cambiar los datos personales del usuario dentro de la pestaña de perfil
 * Para poder cambiar los datos del usuario se debería de dar al botón de 'Save Profile'
 * Se coleccionan todos los datos propios del turista desde los placeholders
 */
document.addEventListener('DOMContentLoaded', async function () {
    await new Promise(resolve => setTimeout(resolve, 2000));
    var btnPerfil = document.getElementById('btnCambioPerfil');

    btnPerfil.addEventListener('click', async function () {

        const userData = JSON.parse(localStorage.getItem('turistaData'));
        const id = userData.id;
        const nombre = document.querySelector('input[placeholder="nombre"]').value;
        const apellido1 = document.querySelector('input[placeholder="Apellido1"]').value;
        const apellido2 = document.querySelector('input[placeholder="Apellido2"]').value;
        const pais = document.querySelector('input[placeholder="Pais"]').value;
        const comunidadAutonoma = document.querySelector('input[placeholder="Comunidad"]').value;
        const edad = document.querySelector('input[placeholder="Edad"]').value;
        const numeroViajes = document.querySelector('input[placeholder="Viajes"]').value
        
        // Se manda a la API una solicitud de PUT con los datos recopilados previamente
        // y se recarga la página si el evento ha sido exitoso

        try {
            let respuesta = await fetch("http://localhost:5065/api/Usuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ id: id, nombre: nombre, apellido1: apellido1, apellido2: apellido2, pais: pais, comunidadAutonoma: comunidadAutonoma, edad: edad, numeroViajes: numeroViajes }),
            });

            if (respuesta.ok) {
                await new Promise(resolve => setTimeout(resolve, 500));
                location.reload();
            }

        } catch {
            console.error("Error completo:", error);
            alert(error.message);
        }
    })
});

/**
 * Función que genera un evento en la carga del html
 * Se encarga de reducir el sidebar y ampliarlo en caso de que esté minimizado
 */
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