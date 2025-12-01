const formCliente = document.getElementById("form-cliente");
const btnEnviar = document.getElementById("btn-enviar");

formCliente.addEventListener("submit", async (event) => {
    // ALtera o texto do botão
    btnEnviar.disabled = true;
    btnEnviar.value = "Enviando...";

    // evita recarregar a página
    event.preventDefault();

    // coleta os dados do formulário
    const dados = pegarDadosCliente()
    try {
        // envia para a API
        const resposta = await fetch("http://127.0.0.1:3000/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error("Erro na API");
        }

        //await resposta.json();

        mostrarToast("✅ Cadastro enviado com sucesso!", "bg-success");
        formCliente.reset();
        destravaEndereco();

    } catch (erro) {
        mostrarToast("❌ Falha ao enviar. Tente novamente.", "bg-danger");
    } finally {
        // Restaura o botão
        btnEnviar.disabled = false;
        btnEnviar.value = "Enviar cadastro";
    }
});

/* ENVIO DE CADASTRO DO CLIENTE USANDO POST DA API */
function pegarDadosCliente(){
    let cliente = new Object();
    cliente.nome_completo = document.getElementById("nome").value;
    cliente.cpf = document.getElementById("cpf").value;
    cliente.email = document.getElementById("email").value;
    cliente.telefone = document.getElementById("telefone").value;
    cliente.cep = document.getElementById("cep").value;
    cliente.rua = document.getElementById("rua").value;
    cliente.n_casa = document.getElementById("numero").value;
    cliente.bairro = document.getElementById("bairro").value;
    cliente.cidade = document.getElementById("cidade").value;
    cliente.estado = document.getElementById("uf").value;
    cliente.senha = document.getElementById("senha").value;
    
    return cliente;
}

/* PREENCHIMENTO DO ENDEREÇO USANDO VIACEP */
function pesquisaCep(cep){
    limpaEndereco();
    destravaEndereco();
    let validacep = /^[0-9]{8}$/;
    if(validacep.test(cep)) {
        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=preenche_cep';

        //Insere script no documento e carrega o conteúdo.
        document.body.appendChild(script);
    } else {
        erro.textContent = "CEP digitado incorretamente!";
        document.getElementById("cep").value = "";
    }
}

function preenche_cep(conteudo){
    if("erro" in conteudo){
        erro.textContent = "CEP não encontrado, digite os dados manualmente!";
    } else {
        travaEndereco();
        document.getElementById("rua").value = conteudo.logradouro;
        document.getElementById("bairro").value = conteudo.bairro;
        document.getElementById("cidade").value = conteudo.localidade;
        document.getElementById("uf").value = conteudo.uf;
    }
}

function limpaEndereco(){
    erro.textContent = ""
    document.getElementById("rua").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("uf").value = "";
}

function travaEndereco(){
    document.getElementById("rua").readOnly = true;
    document.getElementById("bairro").readOnly = true;
    document.getElementById("cidade").readOnly = true;
    document.getElementById("uf").disabled = true;
}

function destravaEndereco(){
    document.getElementById("rua").readOnly = false;
    document.getElementById("bairro").readOnly = false;
    document.getElementById("cidade").readOnly = false;
    document.getElementById("uf").disabled = false;
}

