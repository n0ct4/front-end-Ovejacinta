let currentBlock = 0; // Índice del bloque actual (0, 1 o 2)
const blocks = document.querySelectorAll('.question-block');

function showBlock(index) {
    blocks.forEach((block, i) => {
        block.style.display = i === index ? 'block' : 'none';
    });

    // Mostrar/ocultar botones según el bloque actual
    document.getElementById("prev-btn").style.display = index > 0 ? "inline-block" : "none";
    document.getElementById("next-btn").style.display = index < blocks.length - 1 ? "inline-block" : "none";
    document.getElementById("submit-btn").style.display = index === blocks.length - 1 ? "inline-block" : "none";
}

function showNextBlock() {
    if (currentBlock < blocks.length - 1) {
        currentBlock++;
        showBlock(currentBlock);
    }
}

function showPrevBlock() {
    if (currentBlock > 0) {
        currentBlock--;
        showBlock(currentBlock);
    }
}

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


