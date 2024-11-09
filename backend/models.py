# models.py
from werkzeug.security import generate_password_hash, check_password_hash
from db import mongo

class User:
    def __init__(self, username, password, role):
        self.username = username
        self.password = generate_password_hash(password)
        self.role = role

    def save(self):
        mongo.db.users.insert_one({
            'username': self.username,
            'password': self.password,
            'role': self.role
        })

    @staticmethod
    def find_by_username(username):
        return mongo.db.users.find_one({'username': username})

    @staticmethod
    def check_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)