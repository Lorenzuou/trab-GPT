import replicate

class GPT():
    def __init__(self) -> None:
        self.base_string1 = "I am sending you a board of checkers, it is checkers it is NOT CHESS. Based on this board and the possible plays that i will send you \
                            choose a play to keep playing. Here is the board: "
        self.base_string2 = "Here are the possible plays: \n"

    def gpt_play(self, moves, board):
        string = self.base_string1 + board + self.base_string2 + moves + "Do not create new plays, choose one of those options for me. After that, say why did you choose that play. Remember, you are not playing chess, you are playing checkers, so there is only one kind of pieces and eventually queens"
        tokens = ''
        
        
        output = replicate.run(
           "meta/codellama-7b-instruct:7bf2629623162c0cf22ace9ec7a94b34045c1cfa2ed82586f05f3a60b1ca2da5",
            input={"prompt": string} 
        )
        print(moves)

        for i in output:
            tokens += i
        return self.select_answer(tokens, moves)
    
    def select_answer(self, tokens, moves):
        for move in moves.split():
            if move in tokens:
                return [move, tokens]

        return None