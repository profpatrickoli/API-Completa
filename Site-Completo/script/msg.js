const toastEl = document.getElementById("liveToast");
const toastMessage = document.getElementById("toast-message");
const bsToast = new bootstrap.Toast(toastEl);

function mostrarToast(mensagem, bgClass) {
    toastMessage.textContent = mensagem;

    // remove classes de cor antigas
    toastEl.classList.remove("bg-success", "bg-danger");
    toastEl.classList.add(bgClass);

    bsToast.show();
}