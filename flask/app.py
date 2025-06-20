from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

def env(var:str):
    return os.getenv(var)

mongoclient = MongoClient(env("DB_URL"))
db = mongoclient[env("DB_NAME")]
user = db.users.find_one({"username": })

app = Flask(__name__)

@app.route('/')
def home():
    return "API working"

# @app.get('/<username>/conversations')
# def get_conversations(username:str):
#     user = db.users.find_one({"username": username})
    
    # conversations = db.conversations.find({
    #     "$or":[{"user1": user_id},
    #      {"user2": user_id}]}
    #     )
    
    
    # result = []
    # for convo in conversations:
    #     convo['_id'] = str(convo['_id'])
    #     result.append(convo)
    # return jsonify(result)

if __name__ == '__main__':
    app.run(port=6000)