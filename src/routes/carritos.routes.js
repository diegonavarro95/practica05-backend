const express = require('express');
const router = express.Router();
const { getCarrito, addCarrito, removeCarrito } = require('../controllers/carritos.controller');

router.get('/:usuario_id', getCarrito);
router.post('/', addCarrito);
router.delete('/:id', removeCarrito);

module.exports = router;