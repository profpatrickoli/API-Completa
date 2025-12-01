const btnLogin = document.getElementById("btn-login");

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  btnLogin.disabled = true;
  btnLogin.value = "Entrando...";

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarToast(`❌ Falha ao enviar. Erro: ${data.erro}.`, "bg-danger");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("nomeCliente", data.nome_completo);
    localStorage.setItem("emailCliente", email);


    atualizarNavbar();
    mostrarToast("✅ Cadastro enviado com sucesso!", "bg-success");
    window.location.href = "index.html"; // redireciona para a home
  } catch (err) {
    mostrarToast(`❌ Falha ao enviar. Erro: ${err}.`, "bg-danger");  
  } finally {
    btnLogin.disabled = false;
    btnLogin.value = "Entrar";
  }
});
