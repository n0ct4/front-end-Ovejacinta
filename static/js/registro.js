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
    // tipo id encio null por ahora

    let data = { nombre: nombre, 
                nombreUsuario: nombreUsuario, correo: email ,contraseña: contraseña, 
        apellido1:apellido1, apellido2:apellido2, pais: pais, comunidadA: comunidadA, edad:edad, categoria:categoria

     };

     try {
        const response = await fetch("http://localhost:5065/api/Auth/Registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            document.getElementById("successMessage").classList.remove("hidden");
            document.getElementById("errorMessage").classList.add("hidden");
            document.getElementById("registrationForm").reset();
            window.location.href = "/login";
        } else {
            throw new Error("Error en el servidor");
        }
        
    } catch (error) {
        document.getElementById("successMessage").classList.add("hidden");
        document.getElementById("errorMessage").classList.remove("hidden");
        console.error("Error:", error);
    }
});