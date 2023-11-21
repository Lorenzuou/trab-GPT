import requests


class DamasGPT:
    def __init__(self):
        self.simbolo = "X"

    def gerar_prompt(self, tabuleiro):
        prompt = "Tabuleiro:\n"
        for i in range(8):
            for j in range(8):
                prompt += tabuleiro[i][j] + " "
            prompt += "\n"
        prompt += "Símbolo: " + self.simbolo + "\n"
        prompt += "Tipo de resposta: movimento de damas\n"
        return prompt

    def jogar(self, tabuleiro):
        prompt = self.gerar_prompt(tabuleiro)
        resposta = requests.post("https://api.gpt.com", data={"prompt": prompt}).json()
        movimento = resposta["move"]
        return movimento
