require('dotenv').config();
const app = require('./app');
const initDb = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDb();
    console.log('Banco de dados SQLite inicializado com sucesso.');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

startServer();