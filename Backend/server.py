from flask import Flask, request, jsonify
import Locator
from model import Model

app = Flask(__name__)

chat_bot = Model()

@app.route('/chat')
def chat_interaction():
    speech_text = request.args.get('param1')
    return jsonify({"message" : chat_bot.newInput(speech_text)});

@app.route('/get-info', methods=['GET'])
def get_info():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)