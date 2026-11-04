const pedidosService = require('../services/pedidos.service');

const crearPedido = async (req, res) => {
    
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: "Se requiere el ID del usuario para procesar el pago." });
    }

    try {
        const resultado = await pedidosService.procesarCheckout(usuario_id);
        res.status(201).json({
            mensaje: "Compra exitosa. Carrito procesado.",
            ...resultado
        });
    } catch (error) {
        const status = error.message.includes("vacío") || error.message.includes("Stock") ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
};

const getPedidosUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const pedidos = await pedidosService.obtenerPedidosUsuario(usuario_id);
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearPedido };
module.exports = { crearPedido, getPedidosUsuario };