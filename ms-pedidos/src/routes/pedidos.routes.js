const express = require('express');
const router = express.Router();
const { postCheckout, getPedidosUsuario } = require('../controllers/pedidos.controller');

router.post('/', postCheckout);
router.get('/:usuario_id', getPedidosUsuario);

module.exports = router;