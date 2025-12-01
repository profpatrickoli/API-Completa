function atualizarNavbar() {
  const token = localStorage.getItem("token");
  const nome = localStorage.getItem("nomeCliente");

  const navLogin = document.getElementById("nav-login");
  const userInfo = document.getElementById("user-info");

  if (token && nome) {
    navLogin.style.display = "none";
    userInfo.style.display = "inline";
    userInfo.innerText = `Olá, ${nome.split(" ")[0]}`;
  } else {
    navLogin.style.display = "inline";
    userInfo.style.display = "none";
  }
}

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("nomeCliente");
  window.location.href = "login.html"; // redireciona para a home
  atualizarNavbar();
}

// Chama a função ao carregar qualquer página
window.addEventListener("DOMContentLoaded", atualizarNavbar);
