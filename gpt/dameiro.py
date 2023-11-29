import requests
from openai import OpenAI

# api_key= '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'
url = 'https://chatgpt-api.shn.hk/v1/'
# client = OpenAI(api_key=api_key)

data = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello, how are you?"}]
}

response = requests.post(url=url, data=data)
# print(response)

if response.status_code == 200:
    print("POST request successful!")
    print("Response:")
    print(response.text)
else:
    print(f"POST request failed with status code {response.status_code}")
    print("Response:")
    print(response.text)

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
