const carritosService = require('../services/carritos.service');

const getCarrito = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const carrito = await carritosService.obtenerCarritoUsuario(usuario_id);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addCarrito = async (req, res) => {
    try {
        const { usuario_id, producto_id, cantidad } = req.body;
        if (!usuario_id || !producto_id || !cantidad) {
            return res.status(400).json({ error: "Faltan datos requeridos." });
        }
        await carritosService.agregarAlCarrito(usuario_id, producto_id, cantidad);
        res.status(201).json({ mensaje: "Producto agregado al carrito correctamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeCarrito = async (req, res) => {
    try {
        const { id } = req.params;
        await carritosService.eliminarDelCarrito(id);
        res.status(200).json({ mensaje: "Item eliminado." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCarrito, addCarrito, removeCarrito };