
/**
 * @description
 * Función que se encarga de obtener el nombre del turista a través de una llamada a la API con su id
 * @param {*} id ID del turista que se va a buscar
 * @returns Nombre del turista en caso de Ok || Un string de 'Turista desconocido' si hay algún error o no es encontrado
 */
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
 * Función que se encarga de cargar todos los viajes que existen actualmente en la base de datos
 * Hace una llamada al endpoint de Viajes
 * Mete en un carrusel las cards que usamos para mostrar los viajes
 */
async function cargarTodosViajes() {
    try {
        const respuesta = await fetch(`http://localhost:5065/api/Viajes`);
        const data = await respuesta.json();
        const viajes = data.contenido;

        const carouselInner = document.getElementById("carouselInner");

        viajes.forEach(async (viaje, index) => {
            const fechaInicio = new Date(viaje.fechaInicioViaje).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const fechaFin = new Date(viaje.fechaFinalViaje).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const nombreTurista = await obtenerNombreTurista(viaje.idTuristaCreador);
            const item = document.createElement("div");
            item.className = "carousel-item" + (index === 0 ? " active" : "");
            item.innerHTML = `
                <div class="d-flex justify-content-center">
                    <div class="card viaje-card shadow-sm rounded-4 border-0 p-4 w-75">
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
                            
                            <button class="btn btn-primary rounded-pill px-3" onclick="verDetalles(${viaje.id})">
                                <i class="fas fa-eye me-1"></i>Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            carouselInner.appendChild(item);
        });

    } catch (error) {
        console.error("Error al cargar los viajes:", error);
    }
}

/**
 * @description
 * Función que se encarga de cargar en el select de la invitación a otros usuario
 * , todos los viajes que tiene un usuario
 * @async Es una función asíncrona 
 * @returns Devuelve un relleno de datos de un select en base a todos los viajes que tiene un usuario
 */
async function cargarViajesEnInvitacion() {
    try {
        // Obtén el ID del usuario desde userData
        const userData = JSON.parse(localStorage.getItem('userData')); // Asegúrate de que userData esté almacenado en localStorage
        if (!userData || !userData.id) {
            console.error("No se encontró el ID del usuario.");
            return;
        }

        // Llama al endpoint para obtener los viajes
        const response = await fetch(`http://localhost:5065/api/Viajes/Usuario/${userData.id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los viajes: ${response.statusText}`);
        }

        const viajes = await response.json();
        const arrayViajes = viajes.contenido;

        // Selecciona el elemento <select>
        const selectViaje = document.getElementById('selectViaje');
        selectViaje.innerHTML = ''; // Limpia el contenido previo

        // Llena el <select> con las opciones de los viajes
        arrayViajes.forEach(viaje => {
            const option = document.createElement('option');
            option.value = viaje.id; // Asume que cada viaje tiene un ID único
            option.textContent = viaje.nombre; // Asume que cada viaje tiene un nombre
            selectViaje.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los viajes en la invitación:", error);
    }
}

/**
 * @description
 * Función que se encarga de enviar una invitación a otro usuario desde un botón dentro de un modal
 * @async Es una función asíncrona 
 */
async function enviarInvitacion() {
    try {
        // Recogemos todos los datos necesarios del html para enviar la invitación
        const userData = JSON.parse(localStorage.getItem('userData'));
        const viajeId = document.getElementById('selectViaje').value;
        const email = document.getElementById('emailInvitado').value;

        // Llamamos al endpoint de la API para enviar la invitación
        const response = await fetch("http://localhost:5065/api/Usuario/Invitacion", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                idViajeAsociado: viajeId,
                idTuristaAnfitrion: userData.id,
                correoUsuarioInvitado: email,
                fechaEmision: new Date().toISOString()
            })
        });

        if (response.ok) {
            alert("Invitación enviada correctamente.");
        } else {
            alert("Error al enviar la invitación.");
        }
    }
    catch (error) {
        console.error("Error al enviar la invitación a otro usuario: ", error);
    }
}

/**
 * @description
 * Es una función que permite crear un viaje nuevo dentro de nuestro sistema
 * Se genera un modal que permite rellenar los datos típicos de un viaje dentro de nuestro sistema
 * @async Es una función asíncrona dentro del codigo
 * @throws {Error} Devuelve un error en caso de detectarlo durante el proceso de la función
 * @param {*} usuario_id ID del usuario que está creando el viaje nuevo
 */
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

/**
 * @description
 * Es una función que permite inspeccionar los detalles en especifico de un viaje seleccionado
 * @async Es una función asíncrona dentro del codigo
 * @throws {Error} Devuelve un error en caso de detectarlo durante el proceso de la función
 * @param {*} viajeId ID del viaje que se está inspeccionando
 */
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

        mostrarDetalleEnModal(viajeDetalle); // Llamada a función para que genere los detalles dentro del modal creado 

    } catch (error) {
        console.error('Error al obtener detalles del viaje:', error);
        alert('No se pudieron cargar los detalles del viaje: ' + error.message);
    }
}

/**
 * @description 
 * Función que se encarga de rellenar los datos y generar el html del modal a través de los datos
 * obtenidos por una llamada a uno de los endpoints de la API, que devuelve un viaje en concreto
 * @param {*} viaje Objeto de la clase viaje
 * @throws {Error} Devuelve un error si es detectado en el proceso de la función
 */
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

async function editarViaje(idViaje) {
    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`http://localhost:5065/api/Viajes/Detail?idViaje=${idViaje}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("No se pudo obtener el viaje");

        const result = await response.json();
        const viaje = result.contenido;

        const modalHTML = `
        <div class="modal fade" id="editarViajeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar viaje</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarViaje">
                            <input type="hidden" id="viajeIdEdit" value="${viaje.id}">
                            <div class="mb-3">
                                <label for="nombreEdit" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombreEdit" value="${viaje.nombre}">
                            </div>
                            <div class="mb-3">
                                <label for="descripcionEdit" class="form-label">Descripción</label>
                                <textarea class="form-control" id="descripcionEdit">${viaje.descripcion}</textarea>
                            </div>
                            <div class="mb-3">
                                <label for="fechaInicioEdit" class="form-label">Fecha inicio</label>
                                <input type="date" class="form-control" id="fechaInicioEdit" value="${viaje.fechaInicioViaje.split('T')[0]}">
                            </div>
                            <div class="mb-3">
                                <label for="fechaFinEdit" class="form-label">Fecha fin</label>
                                <input type="date" class="form-control" id="fechaFinEdit" value="${viaje.fechaFinalViaje.split('T')[0]}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="guardarCambiosViaje()">Guardar cambios</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('editarViajeModal'));
        modal.show();

        document.getElementById('editarViajeModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });

    } catch (error) {
        alert("Error al cargar datos del viaje: " + error.message);
    }
}


async function guardarCambiosViaje() {
    const idViaje = document.getElementById('viajeIdEdit').value;
    const nombre = document.getElementById('nombreEdit').value;
    const descripcion = document.getElementById('descripcionEdit').value;
    const fechaInicio = document.getElementById('fechaInicioEdit').value;
    const fechaFin = document.getElementById('fechaFinEdit').value;
    const token = localStorage.getItem('authToken');

    const turistaData = JSON.parse(localStorage.getItem('turistaData'));
    const idTuristaCreador = turistaData.id;

    try {
        const response = await fetch("http://localhost:5065/api/Viajes", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: idViaje,
                nombre,
                descripcion,
                fechaInicioViaje: fechaInicio,
                fechaFinalViaje: fechaFin,
                idTuristaCreador: idTuristaCreador
            })
        });

        if (!response.ok) throw new Error("Error al actualizar el viaje");

        alert("Viaje actualizado");
        window.location.reload();

    } catch (error) {
        alert("Error al guardar los cambios: " + error.message);
    }

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

async function cargarViajesInvitados(){
    try {
        
    } catch (error) {
        console.error("Error al cargar los viajes en los que estás invitado:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await cargarTodosViajes();
});

document.addEventListener('DOMContentLoaded', cargarViajesEnInvitacion);
document.getElementById('btnEnviarInvitacion').addEventListener('click', enviarInvitacion);

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
    });

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
                            <i class="fas fa-trash me-1"></i>
                        </button>

                        <button class="btn btn-secondary rounded-pill px-3" onclick="editarViaje(${viaje.id})">
                            <i class="fas fa-edit me-1"></i>
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

async function cargarViajesInvitados() {
    try {
        // 1. Obtener datos del usuario
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.id) {
            console.error("Usuario no autenticado");
            return;
        }

        // 2. Verificar contenedor HTML
        const container = document.getElementById('viajesInvitadosContainer');
        if (!container) {
            console.error("Contenedor no encontrado");
            return;
        }

        // 3. Mostrar estado de carga
        container.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando tus viajes aceptados...</p>
            </div>
        `;

        // 4. Hacer la petición al endpoint correcto
        const response = await fetch(`http://localhost:5065/api/Viajes/InvitacionesAceptadas/${userData.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'accept': '*/*'
            }
        });

        // 5. Manejar errores de respuesta
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // 6. Verificar estructura de respuesta
        if (!data.validez || !data.contenido) {
            throw new Error("Estructura de respuesta inválida");
        }

        // 7. Limpiar contenedor
        container.innerHTML = '';

        // 8. Mostrar resultados
        if (data.contenido.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No tienes invitaciones aceptadas actualmente.
                </div>
            `;
            return;
        }

        // 9. Procesar cada viaje
        for (const viaje of data.contenido) {
            try {
                // Formatear fechas
                const fechaInicio = new Date(viaje.fechaInicioViaje).toLocaleDateString('es-ES', {
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric'
                });
                
                const fechaFin = new Date(viaje.fechaFinalViaje).toLocaleDateString('es-ES', {
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric'
                });

                // Obtener nombre del creador
                const nombreCreador = await obtenerNombreTurista(viaje.idTuristaCreador);

                // Crear card del viaje
                const card = document.createElement('div');
                card.className = 'mb-4 animate__animated animate__fadeIn';
                card.innerHTML = `
                    <div class="card viaje-card shadow-sm rounded-4 border-0 p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="fw-semibold text-dark m-0">${viaje.nombre}</h4>
                            <span class="badge bg-success text-white px-3 py-2 rounded-pill">
                                <i class="fas fa-check-circle me-1"></i> Aceptado
                            </span>
                        </div>
                        
                        <div class="d-flex justify-content-between text-muted small mb-3">
                            <div>
                                <i class="fas fa-calendar-alt me-2"></i>
                                ${fechaInicio} - ${fechaFin}
                            </div>
                            <div>
                                <i class="fas fa-user me-2"></i>
                                Organizador: ${nombreCreador}
                            </div>
                        </div>
                        
                        <p class="text-secondary mb-4">${viaje.descripcion}</p>
                        
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-outline-primary rounded-pill px-3" 
                                    onclick="verDetalles(${viaje.id})">
                                <i class="fas fa-eye me-1"></i> Ver detalles
                            </button>
                        </div>
                    </div>
                `;
                
                container.appendChild(card);
            } catch (error) {
                console.error("Error al procesar viaje:", viaje.id, error);
            }
        }
    } catch (error) {
        console.error("Error al cargar viajes invitados:", error);
        
        const container = document.getElementById('viajesInvitadosContainer');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Aún no tienes invitaciones aceptadas o ha ocurrido un error al cargar los viajes.
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarViajesInvitados);
