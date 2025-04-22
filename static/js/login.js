document
  .getElementById("dataForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let data = { correo: email, Contraseña: password };

    console.log("Enviando datos:", data); // Verifica en la consola del navegador

    try {
      let response = await fetch("http://localhost:5065/api/Auth/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ correo: email, Contraseña: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error detallado:", errorData);
        throw new Error(errorData.message || "Error de autenticación");
      }

      // Después de un login exitoso, antes de redireccionar
      if (response.ok) {
        const data = await response.json();

        // Almacena los datos del usuario
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id_u: data.user.id, // pruba para comprobar id 
            username: data.user.nombreUsuario,
            correo: data.user.Correo,
          })
        );

        // Almacena el token
        localStorage.setItem("authToken", data.token);

        // Redirecciona
        window.location.href = "/usuario";
      }
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.message);
    }
  });
