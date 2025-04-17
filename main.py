from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

api_url_login = "http://localhost:5065/api/Auth/Login"
api_url_registro = "http://localhost:5065/api/Auth/Registro"

@app.route('/')
def index():
    return render_template('login.html')  

@app.route('/form')
def form():
    return render_template('formulario-preferencias.html') 

@app.route('/perfil')
def perfil():
    return render_template('perfil.html') 

@app.route('/registroUsuario')
def registroUsuario():
    return render_template('registro.html')  

@app.route('/cambioContraseña')
def cambioContraseña():
    return render_template('cambio-contrasenia.html')  

@app.route('/usuario')
def vista_usuario():
    return render_template('usuario.html')  

@app.route('/viajes')
def viaje():
    return render_template('viajes.html')


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Procesar los datos recibidos
        payload = {
            "correo" : data.get('email', None),
            "Contraseña": data.get('password', None)
        }
        
        response = requests.post(api_url_login, json=payload)
        
        if response.status_code == 200:
            resultado = response.json()
            return jsonify({
                "usuario": resultado.get("User"),
                "access_token": resultado.get("Token")
            })   
        else:
            return jsonify({"error": "Credenciales incorrectas bro"}), 401
        
    except Exception as e:
        return jsonify({"status":"error", "message": str(e)}), 400
    

@app.route('/registro', methods=['POST'])
def registro():
    try:
        data = request.get_json()

        # envio de tipoID como null
        if not data.get("IdTipoIdentificacion"):
            data["IdTipoIdentificacion"] = None

        response = requests.post(api_url_registro, json=data)

        if response.status_code == 200:
            return jsonify({"message": "Usuario registrado correctamente"}), 200
        else:
            return jsonify({
                "message": "Error al registrar usuario",
                "status_code": response.status_code,
                "detalle": response.text
            }), 400

    except Exception as e:
        return jsonify({"message": str(e)}), 500




        
# viajes

if __name__ == '__main__':
    app.run(debug=True)