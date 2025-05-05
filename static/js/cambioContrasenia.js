/**
 * Función que se encarga de cambiar la contraseña desde el forms de cambio de contraseña
 * Se debe de introducir el correo y las contraseñas
 * @param {} e 
 */
async function cambioContrasenia (e){
    e.preventDefault();

    let email = document.getElementById('email').value;
    let contraseña = document.getElementById('nuevaPassword').value;
    let confirmContraseña = document.getElementById('confirmarNuevaPassword').value;

    try {
        if (contraseña != confirmContraseña)
            console.log("Error: tu prima");
        else {
            let response = await fetch("http://localhost:5065/api/Usuario/Password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ Correo: email, Contraseña: contraseña }),
            });

            if (response.ok) {
                window.location.href = "/";
            }
        }

    } catch {

    }
}

/**
 * Función que genera el evento de cambio de contraseña
 */
document.getElementById('dataForm').addEventListener('submit', async (e) =>{
    await cambioContrasenia(e);
});