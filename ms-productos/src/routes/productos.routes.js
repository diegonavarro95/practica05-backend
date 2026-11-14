const express = require('express');
const router = express.Router();
const { getProductos, getProductoById, patchDescontarStock } = require('../controllers/productos.controller');

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.patch('/:id/descontar', patchDescontarStock);

module.exports = router;