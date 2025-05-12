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

    // Implementacion de notificaciones al cargar la pagina

    mostrarInvitaciones();
    
    // Actualizar cada 30 segundos (opcional)
    setInterval(actualizarInvitaciones, 30000);
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
 * Carga las invitaciones pendientes del usuario actual
 */
async function cargarInvitacionesPendientes() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.id) {
            console.error("Usuario no identificado");
            return [];
        }

        const response = await fetch(`http://localhost:5065/api/Usuario/Invitaciones?idTurista=${userData.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) throw new Error("Error al obtener invitaciones o no hay invitaciones");

        const data = await response.json();
        return data.contenido || [];
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

/**
 * Muestra las invitaciones en el contenedor
 */
async function mostrarInvitaciones() {
    const container = document.getElementById('invitacionesContainer');
    if (!container) return;

    try {
        // Mostrar spinner de carga
        container.innerHTML = '<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>';
        
        const invitaciones = await cargarInvitacionesPendientes();
        
        if (invitaciones.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No tienes invitaciones pendientes</p>';
            return;
        }

        container.innerHTML = '';
        
        // Obtener información de los viajes asociados
        const viajesInfo = await obtenerInfoViajes(invitaciones);
        invitaciones.forEach(async (invitacion) => {
            const viaje = viajesInfo.find(v => v.id === invitacion.idViajeAsociado) || { nombre: 'Viaje desconocido' };
            const fecha = new Date(invitacion.fechaEmision).toLocaleDateString('es-ES');
            const respuestaNombreUsuarioAnfitrion = await fetch(`http://localhost:5065/api/Usuario/Usuario/${invitacion.idTuristaAnfitrion}`)
            const usuarioAnfitrion = await respuestaNombreUsuarioAnfitrion.json();

            const card = document.createElement('div');
            card.className = 'invitacion-card mb-3 p-3 border rounded';
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">Invitación para: <strong>${viaje.nombre}</strong></h6>
                        <small class="text-muted">De: ${usuarioAnfitrion.nombreUsuario || 'Anfitrión'}</small>
                    </div>
                    <small class="text-muted">${fecha}</small>
                </div>
            `;

            // Crear los botones
            const accionesDiv = document.createElement('div');
            accionesDiv.className = 'mt-3 d-flex justify-content-end gap-2';

            const btnRechazar = document.createElement('button');
            btnRechazar.className = 'btn btn-sm btn-outline-danger';
            btnRechazar.textContent = 'Rechazar';
            btnRechazar.onclick = () => rechazarInvitacion(invitacion.id);

            const btnAceptar = document.createElement('button');
            btnAceptar.className = 'btn btn-sm btn-success';
            btnAceptar.textContent = 'Aceptar';
            btnAceptar.onclick = () => aceptarInvitacion(invitacion);

            // Agregar botones al contenedor
            accionesDiv.appendChild(btnRechazar);
            accionesDiv.appendChild(btnAceptar);

            // Agregar contenedor de botones a la tarjeta
            card.appendChild(accionesDiv);

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error al mostrar invitaciones:", error);
        container.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar invitaciones: ${error.message}
                <button onclick="mostrarInvitaciones()" class="btn btn-sm btn-link">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Obtiene información de los viajes asociados a las invitaciones
 */
async function obtenerInfoViajes(invitaciones) {
    try {
        const idsViajes = [...new Set(invitaciones.map(i => i.idViajeAsociado))];
        const promises = idsViajes.map(id => 
            fetch(`http://localhost:5065/api/Viajes/Detail?idViaje=${id}`)
                .then(r => r.json())
                .then(data => ({ 
                    id, 
                    nombre: data.contenido?.nombre || 'Viaje desconocido'
                }))
                .catch(() => ({ id, nombre: 'Viaje desconocido' }))
        );
        return await Promise.all(promises);
    } catch (error) {
        console.error("Error al obtener info de viajes:", error);
        return [];
    }
}

/**
 * Acepta una invitación
 */
async function aceptarInvitacion(invitacion) {
    if (!confirm('¿Estás seguro de aceptar esta invitación?')) return;
    
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // Crear el objeto con la estructura exacta que espera el backend
        const invitacionData = {
            "correoUsuarioInvitado": userData.correo, // Asumo que el correo está en userData
            "idViajeAsociado": invitacion.idViajeAsociado,
            "fechaEmision": new Date().toISOString() // Formato: "2023-05-07T07:13:45.931Z"
        };

        const response = await fetch("http://localhost:5065/api/Usuario/AceptarInvitacion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(invitacionData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al aceptar la invitación");
        }

        alert("✅ Invitación aceptada correctamente");
        await mostrarInvitaciones(); // Actualizar la lista
        
    } catch (error) {
        console.error("Error al aceptar invitación:", error);
        alert(`❌ Error: ${error.message}`);
    }
}

/**
 * Rechaza una invitación
 */
async function rechazarInvitacion(idInvitacion) {
    if (!confirm('¿Rechazar esta invitación?')) return;

    try {
        // Nota: Asumiendo que tienes un endpoint para rechazar invitaciones
        const response = await fetch('http://localhost:5065/api/Usuario/RechazarInvitacion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                id: idInvitacion,
                estado: 2 // 2 = Rechazada
            })
        });

        if (!response.ok) throw new Error(await response.text());

        alert('Invitación rechazada correctamente');
        await mostrarInvitaciones();
    } catch (error) {
        console.error("Error al rechazar invitación:", error);
        alert('Error: ' + error.message);
    }
}

/**
 * Actualiza la lista de invitaciones
 */
async function actualizarInvitaciones() {
    const container = document.getElementById('invitacionesContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    await mostrarInvitaciones();
}

// Hacer funciones disponibles globalmente
window.aceptarInvitacion = aceptarInvitacion;
window.rechazarInvitacion = rechazarInvitacion;
window.actualizarInvitaciones = actualizarInvitaciones;

