// Próx etapa: criptografar senha com bcrypt

// npm init -> inicia o projeto em Node.js
// npm i express -> instala biblioteca
const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

// npm i mysql2
const db = require('./db')

// npm i jsonwebtoken
const jwt = require('jsonwebtoken')

// npm i dotenv
const dotenv = require('dotenv')
dotenv.config()

// npm i bcrypt
const bcrypt = require('bcrypt');

// npm i cors
const cors = require('cors')
app.use(cors())

app.post('/cadastrar', async (req, res) => {
    const cliente = req.body;
    const senhaCriptografada = bcrypt.hashSync(cliente.senha, 10)
    try {
        const result = await db.pool.query(
            `INSERT INTO clientes (
                nome_completo, cpf, estado, 
                cidade, bairro, n_casa, rua, 
                cep, email, telefone, senha
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`,
            [cliente.nome_completo, cliente.cpf,
            cliente.estado, cliente.cidade, 
            cliente.bairro, cliente.n_casa, 
            cliente.rua, cliente.cep, 
            cliente.email, cliente.telefone, 
            senhaCriptografada]);
        dadosCliente = {
            id: Number(result[0].insertId),
            nome: cliente.nome,
            email: cliente.email
        }
        const tokenDeAcesso = jwt.sign(dadosCliente, process.env.JWT_SECRET, { expiresIn: '1m' })
        res.status(200).json({token: tokenDeAcesso})
    } catch (err) {
        res.status(500).json({erro: "Erro interno"})
        throw err;
    }
});

app.post("/login", async (req, res)=>{
    const user = req.body
    if (user.email == null || user.senha == null) {
      return res.status(400).json({ erro: 'Informe email e senha' });
    }
    try {
        const [dados] = await db.pool.query(
            "SELECT id, email, senha, nome_completo FROM clientes WHERE email = ?",
            [user.email]
        )
        const dadosCliente = dados[0]
        if (!dadosCliente){
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }
        senhaValida = await bcrypt.compare(user.senha, dadosCliente.senha)
        if (!senhaValida){
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }
        const infoCliente = {
            id: dadosCliente.id,
            nome_completo: dadosCliente.nome_completo,
            email: dadosCliente.email
        }
        const tokenDeAcesso = jwt.sign(infoCliente, process.env.JWT_SECRET, { expiresIn: '5m' })
        return res.status(200).json({nome_completo: dadosCliente.nome_completo, token: tokenDeAcesso})
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno' });
        throw err;
    }
    
})

app.get("/perfil", autenticar, async (req, res)=>{
    const cliente = req.usuario
    try {
        const [result] = await db.pool.query("SELECT * FROM clientes WHERE email = ?", [cliente.email]);
        //console.log(result[0])
        delete result[0]['senha']
        res.status(200).json(result[0])
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno' });
        throw err;
    }
    })

app.get("/produtos", async (req, res)=>{
  try {
    const result = await db.pool.query("SELECT * FROM produtos");
    res.status(200).json(result[0])
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
    throw err;
  }
})

app.post("/produtos", async (req, res)=>{
    const produto = req.body;
    try {
        const result = await db.pool.query(
            `INSERT INTO produtos (
                foto, nome, descricao, 
                preco, quantidade, categoria
            ) VALUES (
                ?, ?, ?, ?, ?, ?
            )`,
            [produto.foto, produto.nome,
            produto.descricao, produto.preco, 
            produto.quantidade, produto.categoria 
        ]);
        
        res.status(200).json({id: Number(result[0].insertId)})
    } catch (err) {
        res.status(500).json({erro: "Erro interno"})
        throw err;
    }
})

app.post("/comprar", autenticar, async (req, res)=>{
    const produto = req.body;
    const cliente = req.usuario;
    try {
        const result = await db.pool.query(
            `INSERT INTO compras (
                produto_id, cliente_id
            ) VALUES (
                ?, ?
            )`,
            [produto.id_produto, cliente.id]);
        
        res.status(200).json({id: Number(result[0].insertId)})
    } catch (err) {
        res.status(500).json({erro: "Erro interno"})
        throw err;
    }
})

app.listen(port, ()=>{
    console.log("Api rodando na porta " + port)
})

function autenticar(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
        return res.status(401).json({erro: "Token não enviado, usar Authorization Bearer <token>"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({erro: "Token inválido"})
        req.usuario = usuario
        next()
    })   
}