const productosService = require('../services/productos.service');

const getProductos = async (req, res) => {
    try {
        const productos = await productosService.obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProductos };