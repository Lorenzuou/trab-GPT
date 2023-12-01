from gpt4all import GPT4All

class GPT():
    def __init__(self) -> None:
        self.model = GPT4All("orca-mini-3b-gguf2-q4_0.gguf")
        self.base_string1 = "I want to play checkers with someone, but I'm alone, so let's play checkers together! I will send you a matrix that represents the board with the pieces. In each position of this matrix, there are three possibilities of characters:\n'x': represents a simple piece of yours\n'o': represents a simple piece of mine\n'.': represents an empty space\nThis is the current state of the board:"
        self.base_string2 = "To play checkers, you will choose one of the possible moves that I will send. Each move consists of the respective coordinates of the piece and its destination on the board where the first number indicates the position on the vertex X and the second representes the position on the vertex Y. The goal is to capture all the opponent's pieces. Among the possible moves, send me the one you want to choose ONLY by indicating the chosen number and nothing else:"

    def gpt_play(self, moves, board):
        str = self.base_string1 + board + self.base_string2 + moves
        tokens = ''
        for token in self.model.generate(str, max_tokens=20, streaming=True):
            tokens += token
        
        return tokens

    def select_answer(self, answer):
        return answer.split()[1]
