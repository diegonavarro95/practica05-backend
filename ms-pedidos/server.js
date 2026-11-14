require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pedidosRoutes = require('./src/routes/pedidos.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`[MS-Pedidos] Activo y escuchando en el puerto ${PORT}`);
});