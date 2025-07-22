# server/app.py
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return {'message': 'Hello, Finance Tracker!'}

if __name__ == '__main__':
    app.run()