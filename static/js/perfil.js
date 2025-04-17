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