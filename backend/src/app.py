from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

#Mongo
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/flaskreactcrud'
mongo = PyMongo(app)
#Cors
CORS(app)

db = mongo.db.pythonreact 

#Routas
@app.route('/users', methods=['POST'])
def createUser():
    print(request.json)
    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }
    result = db.insert_one(user)  
    return jsonify({'_id': str(result.inserted_id)})  


@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(doc['_id']),  
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)

@app.route('/users/<id>', methods=['GET'])
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})
    if user:  
        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'password': user['password']
        })
    else:
        return jsonify({'error': 'User not found'}), 404  





if __name__ == "__main__":
    app.run(debug=True)
