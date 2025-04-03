let currentQuestion = 1; // Inicia en la primera pregunta

// Muestra la siguiente pregunta
function showNextQuestion() {
    const currentQuestionElement = document.getElementById(`question-${currentQuestion}`);
    currentQuestionElement.style.display = "none"; // Ocultar la pregunta actual

    currentQuestion++; // Incrementar la pregunta actual

    const nextQuestionElement = document.getElementById(`question-${currentQuestion}`);
    nextQuestionElement.style.display = "block"; // Mostrar la siguiente pregunta

    // Mostrar el botón "Anterior"
    if (currentQuestion > 1) {
        document.getElementById("prev-btn").style.display = "inline-block";
    }

    // Si es la última pregunta, mostrar el botón "Enviar"
    if (currentQuestion === 9) {
        document.getElementById("next-btn").style.display = "none"; // Ocultar el botón siguiente
        document.getElementById("submit-btn").style.display = "inline-block"; // Mostrar el botón de enviar
    }
}

// Muestra la pregunta anterior
function showPrevQuestion() {
    const currentQuestionElement = document.getElementById(`question-${currentQuestion}`);
    currentQuestionElement.style.display = "none"; // Ocultar la pregunta actual

    currentQuestion--; // Decrementar la pregunta actual

    const prevQuestionElement = document.getElementById(`question-${currentQuestion}`);
    prevQuestionElement.style.display = "block"; // Mostrar la pregunta anterior

    // Si es la primera pregunta, ocultar el botón "Anterior"
    if (currentQuestion === 1) {
        document.getElementById("prev-btn").style.display = "none";
    }

    // Mostrar el botón "Siguiente"
    if (currentQuestion < 9) {
        document.getElementById("next-btn").style.display = "inline-block";
        document.getElementById("submit-btn").style.display = "none"; // Ocultar el botón de enviar
    }
}

// Función para enviar las respuestas (puedes personalizar esta función)
function enviarRespuestas() {
    alert("Las respuestas han sido enviadas correctamente.");
}
