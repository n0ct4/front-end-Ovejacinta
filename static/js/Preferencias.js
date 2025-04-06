let currentGroup = 1; // Empezamos por el grupo 1
const totalGroups = 3; // Tienes 3 grupos en total

const blocks = document.querySelectorAll('.question-block');

// Función para mostrar el grupo actual y actualizar la barra de progreso
function showGroup(groupNumber) {
    // Ocultar todos los bloques
    for (let i = 1; i <= totalGroups; i++) {
        const group = document.getElementById(`group-${i}`);
        group.style.display = (i === groupNumber) ? "block" : "none";
    }

    // Botones de navegación
    document.getElementById("prev-btn").style.display = (groupNumber > 1) ? "inline-block" : "none";
    document.getElementById("next-btn").style.display = (groupNumber < totalGroups) ? "inline-block" : "none";
    document.getElementById("submit-btn").style.display = (groupNumber === totalGroups) ? "inline-block" : "none";

    // Actualizar barra de progreso
    const progress = Math.round((groupNumber / totalGroups) * 100); // Calcular el progreso
    const progressBar = document.getElementById("progress-bar");

    progressBar.style.width = `${progress}%`; // Actualizar el ancho de la barra
}

// Función para pasar al siguiente grupo
function showNextBlock() {
    if (currentGroup < totalGroups) {
        currentGroup++;
        showGroup(currentGroup);
    }
}

// Función para volver al grupo anterior
function showPrevBlock() {
    if (currentGroup > 1) {
        currentGroup--;
        showGroup(currentGroup);
    }
}

// Mostrar el primer grupo al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    showGroup(currentGroup);
});

function enviarRespuestas() {
    alert("Las respuestas han sido enviadas correctamente.");
    console.log("Redirigiendo a login...");
    // Espera 2 segundos antes de redirigir
    setTimeout(() => {
        window.location.href = "../login.html"; // Ruta para que después de que se envíe el mensaje vaya a la página del login
    }, 2000);
}


// Iniciar al cargar
window.onload = () => showBlock(currentBlock);


