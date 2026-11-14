const express = require('express');
const router = express.Router();
const { getCarrito, postCarrito, deleteCarritoItem, deleteVaciarCarrito } = require('../controllers/carritos.controller');

router.get('/:usuario_id', getCarrito);
router.post('/', postCarrito);
router.delete('/:carrito_id', deleteCarritoItem);
router.delete('/usuario/:usuario_id/vaciar', deleteVaciarCarrito);

module.exports = router;