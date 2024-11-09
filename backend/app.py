from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.json_util import dumps

app = Flask(__name__)

# Configure the MongoDB URI with the database name
app.config["MONGO_URI"] = "mongodb+srv://admin:admin@cluster0.1jic3.mongodb.net/evaluation"
mongo = PyMongo(app)

# Enable CORS
CORS(app)

@app.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
    name = data.get('name')
    grade = data.get('grade')
    if name and grade:
        mongo.db.students.insert_one({"name": name, "grade": grade})
        return jsonify(message="Document added"), 200
    else:
        return jsonify(message="Invalid data"), 400

@app.route('/students', methods=['GET'])
def get_students():
    documents = mongo.db.students.find()
    return dumps(documents), 200

if __name__ == '__main__':
    app.run(debug=True)