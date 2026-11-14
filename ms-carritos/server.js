require('dotenv').config();
const express = require('express');
const cors = require('cors');
const carritosRoutes = require('./src/routes/carritos.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/carritos', carritosRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`[MS-Carritos] Activo y escuchando en el puerto ${PORT}`);
});