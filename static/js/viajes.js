document.addEventListener('DOMContentLoaded', async function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = "/login";
    }
});

await cargarViajes(userData.id);

document.getElementById('btnGuardarViaje').addEventListener('click', 
    async function() {
        await crearViajeNuevo(userData.id)
})

async function cargarViajes(usuario_id) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5065/api/Viajes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Error al cargar el viaje");
        }
        // mostrar viaje
        const data = await response.json();
        
    }
    catch(error){
        console.log("Error: ", error);
    }
}

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
    } catch (error){
        console.log("Error:", error);
        alert("Error al crear el mafakin viaje " + error.message);
    }
}