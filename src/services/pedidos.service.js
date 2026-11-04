const supabase = require('../config/supabase');
const carritosService = require('./carritos.service');
const productosService = require('./productos.service');

const procesarCheckout = async (usuario_id) => {
    const carrito = await carritosService.obtenerCarritoUsuario(usuario_id);
    if (!carrito || carrito.length === 0) {
        throw new Error("El carrito está vacío.");
    }

    let totalPedido = 0;
    const detallesParaInsertar = [];

    for (const item of carrito) {
        const producto = await productosService.verificarDisponibilidad(item.producto_id, item.cantidad);
        totalPedido += (producto.precio * item.cantidad);
        
        detallesParaInsertar.push({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: producto.precio
        });
    }

    const { data: pedido, error: errPed } = await supabase
        .from('pedidos')
        .insert([{ usuario_id, total: totalPedido, estado: 'completado' }])
        .select()
        .single();

    if (errPed) throw new Error("Error al generar la orden.");

    
    for (const detalle of detallesParaInsertar) {
        detalle.pedido_id = pedido.id; // Vinculamos el detalle al ID del pedido recién creado
        
        // Insertamos detalle
        await supabase.from('detalles_pedido').insert([detalle]);
        
        // Descontamos stock
        const productoDB = await supabase.from('productos').select('stock').eq('id', detalle.producto_id).single();
        const nuevoStock = productoDB.data.stock - detalle.cantidad;
        await productosService.actualizarStock(detalle.producto_id, nuevoStock);
    }

    
    await supabase.from('carritos').delete().eq('usuario_id', usuario_id);

    return {
        pedido_id: pedido.id,
        total: totalPedido
    };
};

const obtenerPedidosUsuario = async (usuario_id) => {
    
    const { data, error } = await supabase
        .from('pedidos')
        .select(`
            id, total, estado, creado_en,
            detalles_pedido ( cantidad, precio_unitario, productos (nombre) )
        `)
        .eq('usuario_id', usuario_id)
        .order('creado_en', { ascending: false });

    if (error) throw new Error("Error al obtener el historial de pedidos.");
    return data;
};

module.exports = { procesarCheckout };
module.exports = { procesarCheckout, obtenerPedidosUsuario };