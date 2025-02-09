from flask import Flask, request, jsonify
import Locator
from model import Model

app = Flask(__name__)

chat_bot = Model()
lat = 33.951576
long = -83.375823

@app.route('/chat/<chat_message>')
def chat_interaction(chat_message):
    print(chat_message)
    return jsonify(chat_bot.newInput(chat_message))

@app.route('/gps')
def get_coordinates():
    lat = request.args.get('param1')
    long = request.args.get('param2')

@app.route('/get-info', methods=['GET'])
def get_info():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)