from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

api_url = "http://localhost:5065/api/Auth/Login"

@app.route('/')
def index():
    return render_template('login.html')  

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
        
        response = requests.post(api_url, json=payload)
        
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



if __name__ == '__main__':
    app.run(debug=True)