const express = require('express');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas (exigem Token JWT)
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API do Mini Sistema de Documentos rodando!' });
});

module.exports = app;