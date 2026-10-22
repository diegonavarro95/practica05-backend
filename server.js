const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors()); // Permite peticiones desde otros dominios (ej. GitHub Pages)
app.use(express.json()); // Permite a Express entender el cuerpo (body) de peticiones POST en formato JSON

// ==========================================
// SIMULACIÓN DE BASE DE DATOS (En Memoria)
// ==========================================
let productos = [
    { id: 1, nombre: "Procesador AMD Ryzen 7 5700U", precio: 4500, stock: 10 },
    { id: 2, nombre: "Laptop ASUS TUF Gaming A15", precio: 18000, stock: 5 },
    { id: 3, nombre: "FPGA Digilent Nexys 4 DDR", precio: 6500, stock: 3 },
    { id: 4, nombre: "DualSense PS5 Controller", precio: 1200, stock: 15 }
];

let pedidos = [];

// ==========================================
// ENDPOINTS (API REST)
// ==========================================

// 1. GET: Obtener todos los productos
app.get('/api/v1/productos', (req, res) => {
    res.status(200).json(productos);
});

// 2. GET: Obtener un producto específico por ID
app.get('/api/v1/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
});

// 3. POST: Crear un nuevo pedido (Compra)
app.post('/api/v1/pedidos', (req, res) => {
    // Esperamos recibir { "productoId": 2, "cantidad": 1, "cliente": "Diego" }
    const { productoId, cantidad, cliente } = req.body;

    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        return res.status(404).json({ error: "El producto no existe" });
    }

    if (producto.stock < cantidad) {
        return res.status(400).json({ error: "Stock insuficiente para realizar la compra" });
    }

    // Lógica de negocio: Descontar stock y registrar el pedido
    producto.stock -= cantidad;
    
    const nuevoPedido = {
        idPedido: pedidos.length + 1,
        cliente: cliente,
        producto: producto.nombre,
        cantidad: cantidad,
        totalPagado: producto.precio * cantidad,
        fecha: new Date().toISOString()
    };
    
    pedidos.push(nuevoPedido);

    // 201 Created
    res.status(201).json({
        mensaje: "Pedido procesado con éxito",
        pedido: nuevoPedido
    });
});

// 4. GET: Ver todos los pedidos (Solo para administración)
app.get('/api/v1/pedidos', (req, res) => {
    res.status(200).json(pedidos);
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`[API REST] Servidor corriendo en http://localhost:${PORT}`);
});