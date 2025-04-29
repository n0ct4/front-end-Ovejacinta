document.addEventListener('DOMContentLoaded', async function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = "/login";
    }
});

document.getElementById("btnGuardarViaje").addEventListener("click",
    async function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        await crearViajeNuevo(userData.id);
        console.log("Viaje creado");
        window.location.reload();
    })

// document.getElementById('btnDetallesViaje').addEventListener('click',
//     async function () {
//         await mostrarDetalleViaje()
//     })

async function obtenerNombreTurista(id) {
    try {
        const response = await fetch(`http://localhost:5065/api/Usuario/${id}`);
        const data = await response.json();
        return data.nombre || 'Turista desconocido';
    } catch (error) {
        console.error('Error al obtener el nombre del turista:', error);
        return 'Error al cargar';
    }
}

/**
 * Función que se encarga de cargar los viajes
 * de cada turista en el html desde una llamada a la API.
 * Muestra una card con el contenido de cada viaje que se destaca por:
 * Titulo, descripcion, creador del viaje, etc
 * Permite además acceder a las funciones de borrar y mostrar detalles del viaje
 */
document.addEventListener('DOMContentLoaded', async function cargarViajes() {

    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const response = await fetch(`http://localhost:5065/api/Viajes/Usuario/${userData.id}`);
        const data = await response.json();
        const viajes = data.contenido;
        const container = document.getElementById('viajesContainer');
        container.innerHTML = '';

        viajes.forEach(async (viaje) => {
            const fechaInicio = new Date(viaje.fechaInicioViaje).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const fechaFin = new Date(viaje.fechaFinalViaje).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            const nombreTurista = await obtenerNombreTurista(viaje.idTuristaCreador);

            const card = document.createElement('div');
            card.className = 'mb-4';
            card.innerHTML = `
                <div class="card viaje-card shadow-sm rounded-4 border-0 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="fw-semibold text-dark m-0">${viaje.nombre}</h4>
                        <span class="badge bg-light text-dark px-3 py-2 rounded-pill">España</span>
                    </div>
                    <div class="d-flex justify-content-between text-muted small mb-3">
                        <div><i class="fas fa-calendar-alt me-2"></i>${fechaInicio} - ${fechaFin}</div>
                        <div><i class="fas fa-users me-2"></i>${nombreTurista}</div>
                    </div>
                    <p class="text-secondary mb-4">${viaje.descripcion}</p>
                    <div class="d-flex justify-content-end gap-2">
                        <button class="btn btn-outline-danger rounded-pill px-3" onclick="eliminarViaje(${viaje.id})">
                            <i class="fas fa-trash me-1"></i>Eliminar
                        </button>
                        <button class="btn btn-primary rounded-pill px-3" onclick="verDetalles(${viaje.id})">
                            <i class="fas fa-eye me-1"></i>Ver detalles
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
    catch (error) {
        console.log("Error:", error);
    }
});


async function crearViajeNuevo(usuario_id) {

    const nombreViaje = document.getElementById('nombreViaje').value;
    const descripcion = document.getElementById('descripcionViaje').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch("http://localhost:5065/api/Viajes/CreateViaje", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: nombreViaje,
                descripcion: descripcion,
                fechaInicioViaje: fechaInicio,
                fechaFinalViaje: fechaFin,
                idTuristaCreador: usuario_id
            })
        })
        if (response.ok) {
            console.log("Viaje creado");
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Error al crear el mafakin viaje " + error.message);
    }
}

async function verDetalles(viajeId) {
    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`http://localhost:5065/api/Viajes/Detail?idViaje=${viajeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del viaje');
        }

        const result = await response.json();

        const viajeDetalle = result.contenido;

        mostrarDetalleEnModal(viajeDetalle);

    } catch (error) {
        console.error('Error al obtener detalles del viaje:', error);
        alert('No se pudieron cargar los detalles del viaje: ' + error.message);
    }
}

function mostrarDetalleEnModal(viaje) {
    const fechaInicio = new Date(viaje.fechaInicioViaje).toLocaleDateString('es-ES');
    const fechaFin = new Date(viaje.fechaFinalViaje).toLocaleDateString('es-ES');

    const modalContent = `
        <div class="modal fade" id="detalleViajeModal" tabindex="-1" aria-labelledby="detalleViajeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="detalleViajeModalLabel">${viaje.nombre}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Fecha de inicio:</strong> ${fechaInicio}</p>
                                <p><strong>Fecha de fin:</strong> ${fechaFin}</p>
                                <p><strong>País:</strong> ${viaje.turista.pais}</p>
                                <p><strong>Descripcion:</strong> ${viaje.descripcion}</p>
                            </div>
                            <div class="col-md-6">
                                <h5>Información del turista</h5>
                                <p><strong>Creado por:</strong> ${viaje.turista.nombre} ${viaje.turista.apellido1}</p>
                                <p><strong>Edad:</strong> ${viaje.turista.edad}</p>
                                <p><strong>Comunidad Autónoma:</strong> ${viaje.turista.comunidadAutonoma}</p>
                                <p><strong>Total viajes:</strong> ${viaje.turista.numeroViajes}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Agregar el modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalContent);

    const modal = new bootstrap.Modal(document.getElementById('detalleViajeModal'));
    modal.show();

    document.getElementById('detalleViajeModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

/**
 * Función que se encarga de eliminar un viaje en base a un id pasado
 * al final del borrado recarga la página
 * @param {*} viajeId Id del viaje que se va a borrar
 */
async function eliminarViaje(viajeId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No autenticado');
        }

        const response = await fetch(`http://localhost:5065/api/Viajes`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: viajeId,
                nombre: "", // Estos campos pueden ser requeridos por el modelo
                descripcion: "",
                fechaInicioViaje: "2025-04-29T00:00:00Z", // Valor por defecto
                fechaFinalViaje: "2025-04-29T00:00:00Z", // Valor por defecto
                idTuristaCreador: 0 // Valor por defecto
            })
        });

    } catch (error) {
        console.error('Error:', error);
    }

    window.location.reload();
}