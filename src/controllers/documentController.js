const initDb = require('../config/database');

// Listar apenas os documentos do usuário logado
async function listDocuments(req, res) {
  try {
    const db = await initDb();
    const userId = req.user.id; // Extraído do token pelo middleware requireAuth

    const documents = await db.all('SELECT * FROM documents WHERE user_id = ?', [userId]);

    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar documentos.' });
  }
}

// Criar um novo documento
async function createDocument(req, res) {
  try {
    const { title, description, value } = req.body;
    const userId = req.user.id;

    if (!title || value === undefined) {
      return res.status(400).json({ error: 'Título e valor são obrigatórios.' });
    }

    const db = await initDb();
    const result = await db.run(
      'INSERT INTO documents (title, description, value, user_id) VALUES (?, ?, ?, ?)',
      [title, description || '', value, userId]
    );

    return res.status(201).json({
      message: 'Documento criado com sucesso!',
      documentId: result.lastID
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar documento.' });
  }
}

// Deletar um documento (garantindo que pertence ao usuário)
async function deleteDocument(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const db = await initDb();

    // Verifica se o documento existe e se pertence ao usuário
    const document = await db.get('SELECT * FROM documents WHERE id = ? AND user_id = ?', [id, userId]);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado ou sem permissão para deletar.' });
    }

    await db.run('DELETE FROM documents WHERE id = ?', [id]);

    return res.json({ message: 'Documento excluído com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar documento.' });
  }
}

module.exports = { listDocuments, createDocument, deleteDocument };