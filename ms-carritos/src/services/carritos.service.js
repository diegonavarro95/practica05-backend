const supabase = require('../config/supabase');

// Dirección del MS-Productos para la Composición de APIs
const MS_PRODUCTOS_URL = process.env.URL_PRODUCTOS || 'http://localhost:3001/api/v1/productos';

const obtenerCarritoUsuario = async (usuario_id) => {
    // 1. Consulta pura de su propio dominio (sin JOIN)
    const { data: itemsCarrito, error } = await supabase
        .from('carritos')
        .select('id, producto_id, cantidad')
        .eq('usuario_id', usuario_id);

    if (error) throw new Error("Error al obtener el carrito.");

    // 2. Patrón API Composition: Enriquecemos los datos consultando a MS-Productos vía HTTP
    const carritoEnriquecido = await Promise.all(itemsCarrito.map(async (item) => {
        try {
            const resProd = await fetch(`${MS_PRODUCTOS_URL}/${item.producto_id}`);
            if (resProd.ok) {
                const producto = await resProd.json();
                // Emulamos la estructura anidada que espera el frontend
                item.productos = { nombre: producto.nombre, precio: producto.precio };
            } else {
                item.productos = { nombre: "Producto no disponible", precio: 0 };
            }
        } catch (err) {
            item.productos = { nombre: "Error de red", precio: 0 };
        }
        return item;
    }));

    return carritoEnriquecido;
};

const agregarAlCarrito = async (usuario_id, producto_id, cantidad) => {
    const { data: existente } = await supabase
        .from('carritos')
        .select('*')
        .eq('usuario_id', usuario_id)
        .eq('producto_id', producto_id)
        .single();

    if (existente) {
        const { error } = await supabase
            .from('carritos')
            .update({ cantidad: existente.cantidad + cantidad })
            .eq('id', existente.id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('carritos')
            .insert([{ usuario_id, producto_id, cantidad }]);
        if (error) throw new Error(error.message);
    }
};

const eliminarDelCarrito = async (carrito_id) => {
    const { error } = await supabase.from('carritos').delete().eq('id', carrito_id);
    if (error) throw new Error(error.message);
};

// NUEVO: Comando ejecutado por Pedidos post-checkout
const vaciarCarritoUsuario = async (usuario_id) => {
    const { error } = await supabase.from('carritos').delete().eq('usuario_id', usuario_id);
    if (error) throw new Error(error.message);
};

module.exports = { obtenerCarritoUsuario, agregarAlCarrito, eliminarDelCarrito, vaciarCarritoUsuario };