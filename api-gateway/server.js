const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
app.use(cors());

// Definición de los nodos internos
const URL_PRODUCTOS = process.env.URL_PRODUCTOS || 'http://localhost:3001';
const URL_CARRITOS = process.env.URL_CARRITOS || 'http://localhost:3002';
const URL_PEDIDOS = process.env.URL_PEDIDOS || 'http://localhost:3003';

// Redirección de tráfico preservando la ruta completa (proxyReqPathResolver)
app.use('/api/v1/productos', proxy(URL_PRODUCTOS, {
    proxyReqPathResolver: (req) => '/api/v1/productos' + req.url
}));

app.use('/api/v1/carritos', proxy(URL_CARRITOS, {
    proxyReqPathResolver: (req) => '/api/v1/carritos' + req.url
}));

app.use('/api/v1/pedidos', proxy(URL_PEDIDOS, {
    proxyReqPathResolver: (req) => '/api/v1/pedidos' + req.url
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[API Gateway] Escuchando en puerto ${PORT} y orquestando tráfico.`);
});