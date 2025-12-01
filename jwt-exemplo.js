// Video: https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified
// server.js
// API REST em Node.js com login via JWT e rota protegida GET /clientes
// Instruções de uso no chat.

require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===== Config =====
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const PORT = process.env.PORT || 3000;

// ===== "Banco" em memória (exemplo) =====
// Usuário padrão: email admin@exemplo.com senha 123456
const USERS = [
  {
    id: 1,
    nome: 'Admin',
    email: 'admin@exemplo.com',
    senhaHash: bcrypt.hashSync('123456', 10),
  },
];

// Apenas para demo
const CLIENTES = [
  { id: 101, nome: 'Maria Silva', email: 'maria@cliente.com' },
  { id: 102, nome: 'João Souza', email: 'joao@cliente.com' },
  { id: 103, nome: 'Ana Lima', email: 'ana@cliente.com' },
];

// ===== Helpers =====
function gerarToken(usuario) {
  const payload = { sub: usuario.id, email: usuario.email, nome: usuario.nome };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token não enviado. Use o header Authorization: Bearer <token>' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Anexa dados do usuário ao request
    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

// ===== Rotas Públicas =====
app.get('/', (req, res) => {
  res.json({ status: 'OK', mensagem: 'API ativa' });
});

// Login: recebe { email, senha } e retorna { token }
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe email e senha' });
    }

    const usuario = USERS.find((u) => u.email === email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaOk) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario);
    return res.json({ token, tipo: 'Bearer', expiraEm: JWT_EXPIRES_IN });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

// ===== Rotas Protegidas =====
// Somente acessível se autenticado com JWT
app.get('/clientes', authMiddleware, (req, res) => {
  // Você pode usar req.user caso queira filtrar por usuário
  return res.json({ usuario: req.user, dados: CLIENTES });
});

// Rota opcional para verificar token
app.get('/me', authMiddleware, (req, res) => {
  res.json({ autenticado: true, user: req.user });
});

// ===== Inicialização =====
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
