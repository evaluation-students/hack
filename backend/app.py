# app.py (Backend)
from flask import Flask, jsonify, request
from flask_cors import CORS
from bson.json_util import dumps
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from models import User
from db import mongo

app = Flask(__name__)

# Configure the MongoDB URI with the database name
app.config["MONGO_URI"] = "mongodb+srv://admin:admin@cluster0.1jic3.mongodb.net/evaluation"
app.config['SECRET_KEY'] = 'your_secret_key'
mongo.init_app(app)

# Enable CORS
CORS(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.find_by_username(data['username'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    if username and password and role:
        if User.find_by_username(username):
            return jsonify({'message': 'User already exists!'}), 400
        new_user = User(username, password, role)
        new_user.save()
        return jsonify({'message': 'User registered successfully!'}), 201
    else:
        return jsonify({'message': 'Invalid data!'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.find_by_username(username)
    if user and User.check_password(user['password'], password):
        token = jwt.encode({
            'username': user['username'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token, 'role': user['role']}), 200
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/students', methods=['GET'])
@token_required
def get_students(current_user):
    if current_user['role'] != 'teacher':
        return jsonify({'message': 'Unauthorized!'}), 403
    documents = mongo.db.students.find()
    return dumps(documents), 200

@app.route('/students', methods=['POST'])
@token_required
def add_student(current_user):
    if current_user['role'] != 'teacher':
        return jsonify({'message': 'Unauthorized!'}), 403
    data = request.get_json()
    name = data.get('name')
    grade = data.get('grade')
    if name and grade:
        mongo.db.students.insert_one({"name": name, "grade": grade})
        return jsonify(message="Document added"), 200
    else:
        return jsonify(message="Invalid data"), 400

if __name__ == '__main__':
    app.run(debug=True)