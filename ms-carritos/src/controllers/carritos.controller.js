const carritosService = require('../services/carritos.service');

const getCarrito = async (req, res) => {
    try {
        const carrito = await carritosService.obtenerCarritoUsuario(req.params.usuario_id);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const postCarrito = async (req, res) => {
    try {
        const { usuario_id, producto_id, cantidad } = req.body;
        await carritosService.agregarAlCarrito(usuario_id, producto_id, cantidad);
        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCarritoItem = async (req, res) => {
    try {
        await carritosService.eliminarDelCarrito(req.params.carrito_id);
        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteVaciarCarrito = async (req, res) => {
    try {
        await carritosService.vaciarCarritoUsuario(req.params.usuario_id);
        res.status(200).json({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCarrito, postCarrito, deleteCarritoItem, deleteVaciarCarrito };