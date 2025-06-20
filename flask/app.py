from flask import Flask, jsonify, request
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from schema import User,Conversation # Import specific model

load_dotenv()

def env(var:str):
    return os.getenv(var)

mongoclient = MongoClient(env("DB_URL"))
db = mongoclient[env("DB_NAME")]

app = Flask(__name__)


user = db.users.find_one({"username":"alice123" })
  # Convert ObjectId to string for easier 
@app.route('/')
def index():
    return  "Welcome to the API!"

@app.get('/<username>/conversation')
def get_conversation(username: str):
    user = db.users.find_one({"username": username})
    if (not user):
        return {"error": "User not found"}, 404
    try:
        user["_id"] = str(user["_id"])
    except KeyError:
        return {"error": "key not found"}, 503
    
    user_data = User(**user)
    user_id = user_data.id
    conversation = db.conversations.find(
        {"$or": [
            {"user1": user_id},
            {"user2": user_id}
        ]})

    if not conversation:
        return {"waring": "Conversation not found"},204
    conversation = tuple(conversation)
    conversation_list = {}
    for conv in conversation:
        conversation_list["conv_id"]=str(conv["_id"])
        if user_id == str(conv["user1"]):
            sender_id = conv["user2"]
        else:
            sender_id = conv["user1"]
        
        sender = db.users.find_one({"_id": sender_id})
        if not sender:
            continue    
        conversation_list["sender_id"] = str(sender_id)
        conversation_list["sender_name"] = sender["Name"]
        conversation_list["sender_username"] = sender["username"]
        
    return jsonify(conversation_list)


app.run(port=5000, debug=True)
