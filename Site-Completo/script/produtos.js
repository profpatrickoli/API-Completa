async function carregarProdutos() {
    try {
        const resposta = await fetch("http://127.0.0.1:3000/produtos"); 
        const dados = await resposta.json();

        const container = document.getElementById("produtos");
        container.className = "grid-produtos"
        dados.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${produto.foto}" alt="${produto.nome}">
                <div class="nome-produto">${produto.nome}</div>
                <div class="info">
                    <div class="descricao">${produto.descricao.substring(0, 40)}...</div>
                    <div class="preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
                </div>
                <button class="enviar" onclick="comprar(${produto.id_produto})">Comprar</button>
                `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        document.getElementById("produtos").className = "";
        document.getElementById("produtos").innerHTML = 
            '<p>❌ Não foi possível carregar os produtos.</p>';
    }
}

async function comprar(produtoId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            mostrarToast("❌ Realize login!", "bg-danger");
            return;
        }
    
        const response = await fetch("http://localhost:3000/comprar", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_produto: produtoId})
        });

        if (!response.ok) {
            throw new Error("Erro na compra.");
        }

        const result = await response.json();
        mostrarToast("✅ Compra realizada com sucesso! ID do pedido: " + result.id, "bg-success");

    } catch (error) {
        console.error("Erro ao comprar:", error);
        mostrarToast("❌ Não foi possível finalizar a compra.", "bg-danger");
    }
}

carregarProdutos();