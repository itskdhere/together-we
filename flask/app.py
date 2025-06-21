from flask import Flask, jsonify, redirect, url_for, request
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from civic_auth.integrations.flask import init_civic_auth, create_auth_blueprint, get_civic_auth, civic_auth_required
from flask import render_template_string
import inspect

load_dotenv()

def env(var: str):
    return os.getenv(var)

mongoclient = MongoClient(env("DB_URL"))
db = mongoclient[env("DB_NAME")]


print("Collections in DB:", db.list_collection_names())

app = Flask(__name__)
app.secret_key = env("SECRET_KEY")

config = {
    "client_id": env("CIVIC_CLIENT_ID"),  # Client ID from auth.civic.com
    "redirect_url": "http://localhost:5000/auth/callback",  # change to your domain when deploying
    "post_logout_redirect_url": "http://localhost:5000/"  # The postLogoutRedirectUrl is the URL where the user will be redirected after successfully logging out from Civic's auth server.
}
init_civic_auth(app, config)
app.register_blueprint(create_auth_blueprint(config))



@app.route("/")
async def home():
    """Home page - shows login button or redirects if logged in."""
    auth = await get_civic_auth()
    
    if not auth.is_logged_in():
        return redirect(url_for("civic_auth.login"))
    return redirect("/admin")
    

@app.route("/admin")
@civic_auth_required
async def admin():
    return render_template_string("""
    <html>
        <head>
            <title>Admin Dashboard</title>
        </head>
        <body>
            <h1>Welcome to the Admin Dashboard</h1>
            <p>You are logged in!</p>
            <a href="/auth/logout">Logout</a>
        </body>
    </html>
    """)

@app.post("/test2")
def test2():
    print(request.headers)
    return jsonify({"message": "Server is running"}), 200

@app.route('/test')
@civic_auth_required
async def test():
    auth = await get_civic_auth()
    user = auth.get_user()
    # Return a list of all collection names in the current database
    collections = db.list_collection_names()
    return jsonify({"collections": collections}), 200

@app.route('/logout')
def logout():
    return redirect(url_for("civic_auth.logout", next="/"))

@app.get('/profile')
async def profile():
    auth = await get_civic_auth()
    civicuser = auth.get_user()
    if civicuser is not None and inspect.iscoroutine(civicuser):
        civicuser = await civicuser
        
    print(civicuser)
    civicId = civicuser["id"]
    civicemail = civicuser["email"]
    
    user = db.users.find_one({"civicId": civicId})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user["email"] != civicemail:
        return jsonify({"error": "Email mismatch"}), 403
    
    userdata = db.volunteers.find_one({"_id": user["data"]})
    if not userdata:
        return jsonify({"error": "User data not found"}), 404
    data = {
        "name": user["name"],
        "email": user["email"],
        "username": user["username"],
        "bio": user["bio"],
        "type": user["type"],
        "created_at": user["createdAt"],
        "skills": userdata["skills"],
    }   
    
    return jsonify(data), 200
    return "hello"
if __name__ == "__main__":
    app.run(port=5000, debug=True)


