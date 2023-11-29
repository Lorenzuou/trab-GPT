from gpt4all import GPT4All

class GPT():
    def __init__(self) -> None:
        self.model = GPT4All("orca-mini-3b-gguf2-q4_0.gguf")
        self.base_string = "eu quero jogar damas com alguem porém estou sozinho, então vamos jogar damas juntos!\nVou enviar uma matriz para voce que representa o tabuleiro com as peças, em cada posição dessa matriz existirão essas 3 possibilidades de caracteres:\n- 'x': representa uma peça simples sua\n- 'o': representa uma peça simples minha\n- '.': representa um espaço em branco\nEsse é o estado atual do tabuleiro:\n.x.x.x.x\nx.x.x.x.\n.x.x.x.x\n........\n........\no.o.o.o.\n.o.o.o.o\no.o.o.o.\nPara jogar damas, você escolherá uma das jogadas possíveis que enviarei. Cada jogada é constituida pela respectiva coordenada da peça e do destino dela no mapa. O objetivo é consumir todas as peças do adversário. Dentre as possibilidades de jogo, me enviei a que voce deseje escolher APENAS me indicando o número escolhido e nada mais:\n"
    
    def gpt_play(self, moves):
        str = self.base_string + moves
        tokens = ''
        for token in self.model.generate(str, max_tokens=20, streaming=True):
            tokens += token
        
        return self.select_answer(tokens)

    def select_answer(self, answer):
        return answer.split()[1]
