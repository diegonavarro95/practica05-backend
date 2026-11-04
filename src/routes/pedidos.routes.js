const express = require('express');
const router = express.Router();
const { crearPedido, getPedidosUsuario } = require('../controllers/pedidos.controller');

router.post('/', crearPedido);
router.get('/:usuario_id', getPedidosUsuario);

module.exports = router;