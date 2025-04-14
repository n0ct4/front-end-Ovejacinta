document.getElementById("registrationForm").addEventListener("submit", async function(e){
    e.preventDefault();

    console.log("Formulario enviado");

    let nombre = document.getElementById("nombre").value;
    let nombreUsuario = document.getElementById("nombreUsuario").value;
    let email = document.getElementById("email").value;
    let contraseña = document.getElementById("password").value;
    let apellido1 = document.getElementById("apellido1").value;
    let apellido2 = document.getElementById("apellido2").value;
    let pais = document.getElementById("pais").value;
    let comunidadA = document.getElementById("comunidad").value;
    let edad = parseInt(document.getElementById("edad").value);
    let categoria = document.getElementById("categoria").value || null;

    let data = { 
        nombre: nombre, 
        nombreUsuario: nombreUsuario, 
        correo: email,
        contraseña: contraseña, 
        apellido1: apellido1, 
        apellido2: apellido2, 
        pais: pais, 
        comunidadA: comunidadA, 
        edad: edad, 
        categoria: categoria
    };

    try {
        const response = await fetch("http://localhost:5065/api/Auth/Registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Mostrar mensaje de éxito
            document.getElementById("successMessage").style.display = "block";
            document.getElementById("errorMessage").style.display = "none";
            
            // Resetear formulario
            document.getElementById("registrationForm").reset();
            
            // Esperar 3 segundos y redirigir
            setTimeout(() => {
                window.location.href = "/"; 
            }, 3000);
            
        } else {
            // Si la respuesta no es OK, mostrar error
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }
        
    } catch (error) {
        // Mostrar mensaje de error
        document.getElementById("successMessage").style.display = "none";
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessage").textContent = error.message || "Error al enviar el formulario. Inténtalo de nuevo.";
        console.error("Error:", error);
    }
});