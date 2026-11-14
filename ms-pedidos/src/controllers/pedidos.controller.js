const pedidosService = require('../services/pedidos.service');

const postCheckout = async (req, res) => {
    try {
        const { usuario_id } = req.body;
        const resultado = await pedidosService.procesarCheckout(usuario_id);
        res.status(201).json(resultado);
    } catch (error) {
        // En un microservicio real usaríamos status 400 o 409 para fallos de reglas de negocio
        res.status(400).json({ error: error.message });
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

module.exports = { postCheckout, getPedidosUsuario };