async function carregarClienteLogado() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }

    const res = await fetch("http://localhost:3000/perfil", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar dados do usuário");
    }

    const cliente = await res.json();
    document.getElementById("btn-enviar").value = "Alterar cadastro";
    document.getElementById("email").disabled = true;

    // Preenche os campos do formulário
    document.getElementById("nome").value = cliente.nome_completo || "";
    document.getElementById("cpf").value = cliente.cpf || "";
    document.getElementById("email").value = cliente.email || "";
    document.getElementById("telefone").value = cliente.telefone || "";
    document.getElementById("cep").value = cliente.cep || "";
    document.getElementById("rua").value = cliente.rua || "";
    document.getElementById("numero").value = cliente.n_casa || "";
    document.getElementById("bairro").value = cliente.bairro || "";
    document.getElementById("cidade").value = cliente.cidade || "";
    document.getElementById("uf").value = cliente.estado || "";
    // senha nunca deve vir no GET
    document.getElementById("senha").value = "*****";

  } catch (err) {
    logout();
    console.error("Erro:", err);
  }
}

// Carregar automaticamente ao abrir a página
document.addEventListener("DOMContentLoaded", carregarClienteLogado);
