import json
import urllib.request

url_produtos = "http://localhost:3000/produtos"
headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

def abrir():
    print("###########################")
    print("### CADASTRO DE PRODUTO ###")
    print("###########################")
    foto = input("Link da imagem: \n")
    nome = input("Nome: \n")
    descricao = input("Descrição: \n")
    preco = input("Preço: \n")
    quantidade = input("Quantidade: \n")
    categoria = input("Categoria: \n")

    dados = {
        "foto": foto,
        "nome": nome,
        "descricao": descricao,
        "preco": preco,
        "quantidade": quantidade,
        "categoria": categoria,
    }
    
    req = urllib.request.Request(
        url_produtos, 
        data = json.dumps(dados).encode('utf8'), 
        headers = headers,
        method = 'POST')
    
    try:
        resposta = urllib.request.urlopen(req)
        resposta_json = json.loads(resposta.read().decode('utf-8'))
        print(f"Produto cadastrado com sucesso, código: {resposta_json['id']}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

abrir()
