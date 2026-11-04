require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productosRoutes = require('./src/routes/productos.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');
const carritosRoutes = require('./src/routes/carritos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/carritos', carritosRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Endpoint no encontrado." });
});

app.listen(PORT, () => {
    console.log(`[Backend API] Servidor estructurado corriendo en puerto ${PORT}`);
});