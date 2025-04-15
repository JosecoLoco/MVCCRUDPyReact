from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from functools import wraps

# Instanciación
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/flaskreactcrud'
mongo = PyMongo(app)

# Configuración CORS
CORS(app)

# Base de datos
db = mongo.db.pythonreact

# Crear admin por defecto si no existe
def create_default_admin():
    if not db.find_one({'email': 'admin@admin'}):
        db.insert_one({
            'name': 'Administrador',
            'email': 'admin@admin',
            'password': 'admin',
            'role': 'admin'
        })

create_default_admin()

# Decorador para requerir admin (ahora acepta cualquier usuario con rol admin)
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        role = request.headers.get('Role')
        email = request.headers.get('Email')
        password = request.headers.get('Password')
        user = db.find_one({'email': email, 'password': password})
        if not user or user.get('role') != 'admin':
            return jsonify({'error': 'No autorizado'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Registro de usuario normal (cliente)
@app.route('/register', methods=['POST'])
def register():
    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password'],
        'role': 'cliente'
    }
    if db.find_one({'email': user['email']}):
        return jsonify({'error': 'El email ya está registrado'}), 400
    result = db.insert_one(user)
    return jsonify({'_id': str(result.inserted_id)})

# Crear usuario (solo admin)
@app.route('/users', methods=['POST'])
@admin_required
def createUser():
    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password'],
        'role': request.json.get('role', 'cliente')
    }
    if db.find_one({'email': user['email']}):
        return jsonify({'error': 'El email ya está registrado'}), 400
    result = db.insert_one(user)
    return jsonify({'_id': str(result.inserted_id)})

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.find_one({'email': data['email'], 'password': data['password']})
    if user:
        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'password': user['password']  # Para enviar al frontend y usar en headers
        })
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401

# Obtener todos los usuarios
@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(doc['_id']),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password'],
            'role': doc.get('role', 'cliente')
        })
    return jsonify(users)

# Obtener usuario por id
@app.route('/users/<id>', methods=['GET'])
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})
    if user:
        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'password': user['password'],
            'role': user.get('role', 'cliente')
        })
    else:
        return jsonify({'error': 'User not found'}), 404

# Borrar usuario (solo admin)
@app.route('/users/<id>', methods=['DELETE'])
@admin_required
def deleteUser(id):
    result = db.delete_one({'_id': ObjectId(id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'User Deleted'})
    else:
        return jsonify({'error': 'User not found'}), 404

# Editar usuario (solo admin)
@app.route('/users/<id>', methods=['PUT'])
@admin_required
def updateUser(id):
    result = db.update_one({'_id': ObjectId(id)}, {"$set": {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password'],
        'role': request.json.get('role', 'cliente')
    }})
    if result.matched_count > 0:
        return jsonify({'message': 'User Updated'})
    else:
        return jsonify({'error': 'User not found'}), 404

if __name__ == "__main__":
    app.run(debug=True)
