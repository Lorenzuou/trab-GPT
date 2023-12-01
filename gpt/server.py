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
    print(gpt_play)

    # Continue with your processing logic using the 'data' variable

    return jsonify({'gpt_play': gpt_play})

if __name__ == '__main__':
    app.run(debug=True, port=8080)