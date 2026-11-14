const productosService = require('../services/productos.service');

const getProductos = async (req, res) => {
    try {
        const productos = await productosService.obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await productosService.obtenerProductoPorId(req.params.id);
        res.status(200).json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const patchDescontarStock = async (req, res) => {
    try {
        const { cantidad } = req.body;
        await productosService.descontarStock(req.params.id, cantidad);
        res.status(200).json({ message: "Stock actualizado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getProductos, getProductoById, patchDescontarStock };