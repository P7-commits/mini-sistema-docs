const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // Procura o cabeçalho de autorização enviado na requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de acesso não fornecido.' });
  }

  // O formato do cabeçalho é: "Bearer TOKEN_AQUI"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Erro no formato do Token.' });
  }

  const token = parts[1];

  // Verifica se o token é válido e não expirou
  jwt.verify(token, process.env.JWT_SECRET || 'chave_padrao', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // Guarda os dados do utilizador na requisição para usar nas próximas rotas
    req.user = decoded;
    return next();
  });
}

module.exports = requireAuth;