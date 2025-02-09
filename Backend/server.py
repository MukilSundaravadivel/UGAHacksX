from flask import Flask, request, jsonify
import Locator
from model import Model

from transformers import pipeline
import torch

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

@app.route('/get-user-info')
def get_user_info():
    return jsonify(chat_bot.user_data)

@app.route('/upload', methods=['POST'])
def upload():

    file = request.files['file'].read()
    print(type(file))

    with open("./audio.mp4", "wb") as f:
        f.write(file)
        f.close()

    audio_file= open("audio.mp4", "rb")

    whisper = pipeline("automatic-speech-recognition", "openai/whisper-large-v3", torch_dtype=torch.float16, device="cuda:0")

    transcription = whisper("<audio.mp4>")

    return transcription["text"]

if __name__ == '__main__':
    app.run(debug=True)