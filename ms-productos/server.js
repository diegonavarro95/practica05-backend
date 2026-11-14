require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productosRoutes = require('./src/routes/productos.routes');

const app = express();
app.use(cors());
app.use(express.json());

// El proxy del Gateway inyecta la URL completa por defecto.
app.use('/api/v1/productos', productosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`[MS-Productos] Activo y escuchando en el puerto ${PORT}`);
});