from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

# Instantiation
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/flaskreactcrud'
mongo = PyMongo(app)

# Settings
CORS(app)

# Database
db = mongo.db.pythonreact

# Routes
@app.route('/users', methods=['POST'])
def createUser():
    print(request.json)
    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }
    result = db.insert_one(user)  # Cambiar insert por insert_one
    return jsonify({'_id': str(result.inserted_id)})  # Usar el ID insertado directamente


@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(doc['_id']),  # No es necesario usar ObjectId aquí, ya es un ObjectId
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)

@app.route('/users/<id>', methods=['GET'])
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})
    if user:  # Comprobamos si el usuario existe
        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'password': user['password']
        })
    else:
        return jsonify({'error': 'User not found'}), 404  # Retornar error si no se encuentra el usuario

@app.route('/users/<id>', methods=['DELETE'])
def deleteUser(id):
    result = db.delete_one({'_id': ObjectId(id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'User Deleted'})
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<id>', methods=['PUT'])
def updateUser(id):
    print(request.json)
    result = db.update_one({'_id': ObjectId(id)}, {"$set": {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }})
    if result.matched_count > 0:
        return jsonify({'message': 'User Updated'})
    else:
        return jsonify({'error': 'User not found'}), 404

if __name__ == "__main__":
    app.run(debug=True)
