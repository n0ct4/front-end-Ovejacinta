document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken'); 
    
    // Si no hay token, redirige a LOGIN
    if (!authToken) {
        window.location.href = "/";
        return; 
    }

    // Si hay token carga los datos del usuario
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
        
        const sidebarNombre = document.querySelector('.nombre-bienvenida');
        if (sidebarNombre) {
            sidebarNombre.textContent = userData.username || 'Usuario';
        }
        
        // Actualiza el titulo de bienvenida
        const tituloBienvenida = document.querySelector('.user-welcome h4');
        if (tituloBienvenida) {
            tituloBienvenida.textContent = `Bienvenido, ${userData.username || 'Usuario'}!`;
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

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = "/login";
        return;
    }

    // Cargar los viajes del usuario
    await cargarProximosViajes(userData.id);
});

async function cargarProximosViajes(userId) {
    try {
        const response = await fetch(`http://localhost:5065/api/Viajes/Usuario/${userId}`);
        if (!response.ok) throw new Error('Error al cargar viajes');
        
        const data = await response.json();
        const viajes = data.contenido || [];
        const container = document.getElementById('proximosViajesContainer');
        
        if (viajes.length === 0) {
            container.innerHTML = `
                <div class="empty-trips">
                    <i class="fas fa-calendar-plus"></i>
                    <p>No tienes viajes programados</p>
                    <a href="./viajes" class="btn btn-sm btn-primary mt-2">Planificar viaje</a>
                </div>
            `;
            return;
        }

        // Ordenar viajes por fecha (más cercanos primero)
        viajes.sort((a, b) => new Date(a.fechaInicioViaje) - new Date(b.fechaInicioViaje));
        
        // Mostrar solo los próximos 3 viajes
        const proximosViajes = viajes.slice(0, 3);
        
        let html = '<div class="list-group">';
        
        proximosViajes.forEach(viaje => {
            const fechaInicio = new Date(viaje.fechaInicioViaje).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const fechaFin = new Date(viaje.fechaFinalViaje).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            
            html += `
                <a href="#" class="list-group-item list-group-item-action" onclick="verDetalles(${viaje.id}); return false;">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${viaje.nombre}</h6>
                        <small class="text-muted">${fechaInicio} - ${fechaFin}</small>
                    </div>
                    <p class="mb-1 small text-muted">${viaje.descripcion || 'Sin descripción'}</p>
                </a>
            `;
        });
        
        html += '</div>';
        
        // Si hay más viajes, mostrar enlace
        if (viajes.length > 3) {
            html += `
                <div class="text-center mt-3">
                    <a href="./viajes" class="btn btn-sm btn-outline-primary">
                        Ver todos los viajes (${viajes.length})
                    </a>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error al cargar viajes:', error);
        document.getElementById('proximosViajesContainer').innerHTML = `
            <div class="alert alert-warning">
                Error al cargar tus viajes. <a href="javascript:location.reload()">Recargar</a>
            </div>
        `;
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

        if (!response.ok) throw new Error('Error al obtener detalles');
        
        const result = await response.json();
        const viaje = result.contenido;
        
        // Mostrar modal con los detalles
        const modalHTML = `
            <div class="modal fade" id="viajeModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${viaje.nombre}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Fecha inicio:</strong> ${new Date(viaje.fechaInicioViaje).toLocaleDateString('es-ES')}</p>
                                    <p><strong>Fecha fin:</strong> ${new Date(viaje.fechaFinalViaje).toLocaleDateString('es-ES')}</p>
                                    <p><strong>Descripción:</strong></p>
                                    <p>${viaje.descripcion || 'No hay descripción disponible'}</p>
                                </div>
                                <div class="col-md-6">
                                    <h5>Información del creador</h5>
                                    <p><strong>Nombre:</strong> ${viaje.turista.nombre} ${viaje.turista.apellido1}</p>
                                    <p><strong>País:</strong> ${viaje.turista.pais}</p>
                                    <p><strong>Comunidad:</strong> ${viaje.turista.comunidadAutonoma}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="location.href='./viajes?id=${viaje.id}'">Ver completo</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('viajeModal'));
        modal.show();
        
        // Limpiar el modal después de cerrar
        document.getElementById('viajeModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
        
    } catch (error) {
        console.error('Error al ver detalles:', error);
        alert('No se pudieron cargar los detalles del viaje');
    }
}