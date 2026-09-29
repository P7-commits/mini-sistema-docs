const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const initDb = require('../config/database');

// Registrar novo usuário
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const db = await initDb();

    // Verifica se e-mail já existe
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado no sistema.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o usuário
    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      userId: result.lastID
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
  }
}

// Login do usuário
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const db = await initDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Compara senha enviada com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gera o Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'chave_padrao',
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Login realizado com sucesso!',
      token
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}

module.exports = { register, login };