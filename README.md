# Trabalho da Disciplina T. E. I.: Generative Pre-Trained Transformers - Jogando Damas com o GPT

##  Iniciando ambiente de Execução

### Conta Replicate

Como nossa aplicação faz usa da API da Replica, deve-se criar uma conta do site deles para que o usuário possa criar o seu própio token de acesso.
Basta ir no link ![Replicate](https://replicate.com/) e criar a sua conta.

Em sequência, no perfil de usuário, na aba de **API tokens**, deve-se criar um novo token para uso na aplicação.

### Inicialização do Projeto Localmente

Realite o processo de clonagem do repositório para uma pasta de interesse por meio do comando linux:

```
$ git clone https://github.com/Lorenzuou/trab-GPT.git
```


Em sequência acesse o diretório referente ao servidor interno da nossa aplicação navegando para *trab-GPT/gpt*. 

Pelo terminal, exporte o token criado no passo anterior e instale todas as dependências do projeto

```
$ export REPLICATE_API_TOKEN=*YOUR_TOKEN_HERE*

$ pip3 install -r requirements.txt
```

### Execução

Com todas as dependências instalas e o token exportado, podemos inicializar o servidor por meio do comando.

```
$ python3 server.py
```

Com o servidor inicializado, podemos navegar até o diretório *interface_grafica* e executar o arquivo **index.html** com o navegador web de sua preferência.


