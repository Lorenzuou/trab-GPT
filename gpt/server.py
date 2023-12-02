from flask import Flask, jsonify, request
from flask_cors import CORS

from GPT import GPT
app = Flask(__name__)
CORS(app) 

@app.route('/gptMove', methods=['POST'])
def gpt_play():
    try:
        data = request.json
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return jsonify({'error': 'Invalid JSON format'}), 400

    if data is None:
        return jsonify({'error': 'No JSON data received'}), 400

    gpt = GPT()
    gpt_play = gpt.gpt_play(data['plays'], data['board'])
    if gpt_play != None:
        return jsonify({'gpt_play': gpt_play[0], 'text': gpt_play[1]})
    else:
        return jsonify({"error': 'GPT cound't make a correct play"}), 500 

if __name__ == '__main__':
    app.run(debug=True, port=8080)