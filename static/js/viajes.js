document.addEventListener('DOMContentLoaded', async function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = "/login";
    }
});

document.getElementById('btnGuardarViaje').addEventListener('click',
    async function () {
        await crearViajeNuevo(userData.id)
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

document.addEventListener('DOMContentLoaded', async function cargarViajes() {

    try {
        const response = await fetch("http://localhost:5065/api/Viajes");
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
            card.className = 'col-md-6 mb-4';
            card.innerHTML = `
                        <div class="card viaje-card">
                            <div class="card-header viaje-header d-flex justify-content-between align-items-center">
                                <h3 class="card-title mb-0">${viaje.nombre}</h3>
                                <span class="badge badge-destino">España</span>
                            </div>
                            <div class="card-body viaje-body">
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-muted"><i class="fas fa-calendar-alt me-2"></i>${fechaInicio} - ${fechaFin}</span>
                                    <span class="text-muted"><i class="fas fa-users me-2"></i>${nombreTurista}</span>
                                </div>
                                <p class="card-text">Sin descripción aún.</p>
    
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-outline-danger btn-viaje me-2" onclick="eliminarViaje(${viaje.id})">
                                        <i class="fas fa-trash me-1"></i> Eliminar
                                    </button>
                                    <button class="btn btn-primary btn-viaje" onclick="verDetalles(${viaje.id})">
                                        <i class="fas fa-eye me-1"></i> Ver detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
            container.appendChild(card);
        });
    }
    catch (error) {
        console.log("Error:", error);
    }
})



async function crearViajeNuevo(usuario_id) {

    const nombreViaje = document.getElementById('nombreViaje').value;
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
                Nombre: nombreViaje,
                fechaI: fechaInicio,
                fechaFin: fechaFin,
                idUsuario: usuario_id
            })
        })
        if (!response.ok) {
            throw new Error("Error al crear el viaje");
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Error al crear el mafakin viaje " + error.message);
    }
}

async function mostrarDetalleViaje() {

}