const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const requireAuth = require('../middlewares/authMiddleware');

// Aplica a proteção por token JWT para todas as rotas abaixo
router.use(requireAuth);

router.get('/', documentController.listDocuments);
router.post('/', documentController.createDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;