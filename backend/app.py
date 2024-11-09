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
CORS(app, resources={r"/*": {"origins": "*"}})

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

def call_plagscan_api(file_path):
    """Calls the Plagscan API to check for plagiarism."""
    url = "https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism"
    headers = {
        "x-rapidapi-key": "47db59084amsh5aa33549068c032p151523jsnc941c40d7d71",
        "x-rapidapi-host": "plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com",
        "Content-Type": "application/json"
    }
    with open(file_path, 'r', encoding='utf-8') as file:
        text_content = file.read()

    payload = {
        "text": text_content,
        "language": "en",
        "includeCitations": False,
        "scrapeSources": False
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        result = response.json()
        return {
            'percentPlagiarism': result.get('percentPlagiarism', 0)
        }
    else:
        return {'error': 'Failed to check plagiarism', 'status_code': response.status_code}

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

@app.route('/user-assignments', methods=['GET'])
@token_required
def get_user_assignments(current_user):
    username = request.args.get('username')
    if not username:
        return jsonify({'message': 'Username is missing!'}), 400

    user = User.find_by_username(username)
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    assignments = user.get('homework', [])
    return jsonify(assignments), 200


@app.route('/upload-homework', methods=['POST'])
@token_required
def upload_homework(current_user):
    if 'homework' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['homework']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    # Save the file or process it as needed
    return jsonify({'message': 'File uploaded successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)