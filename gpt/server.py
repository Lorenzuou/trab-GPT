from flask import Flask, request
from GPT import GPT

app = Flask(__name__)

@app.route('/gptMove', methods=['POST'])
def gpt_play():
    moves = request.json 
    gpt = GPT()

    moves = '(2,1)/(3,0)\n2. (2,1)/(3,2)\n3. (2,3)/(3,2)\n4. (2,3)/(3,4)\n5. (2,5)/(3,4)\n6. (2,5)/(3,6)\n7. (2,7)/(3,6)'
    
    return gpt.gpt_play(moves)

if __name__ == '__main__':
    app.run(debug=True, port=8080)