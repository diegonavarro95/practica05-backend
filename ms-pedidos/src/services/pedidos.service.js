const supabase = require('../config/supabase');

// Direcciones de la red interna (En producción Render usaremos variables de entorno)
const MS_PRODUCTOS_URL = process.env.URL_PRODUCTOS || 'http://localhost:3001/api/v1/productos';
const MS_CARRITOS_URL = process.env.URL_CARRITOS || 'http://localhost:3002/api/v1/carritos';

const procesarCheckout = async (usuario_id) => {
    // 1. Obtener carrito vía HTTP (MS-Carritos)
    const resCarrito = await fetch(`${MS_CARRITOS_URL}/${usuario_id}`);
    if (!resCarrito.ok) throw new Error("Error de comunicación con MS-Carritos.");
    const carrito = await resCarrito.json();

    if (!carrito || carrito.length === 0) {
        throw new Error("El carrito está vacío.");
    }

    let totalPedido = 0;
    const detallesParaInsertar = [];

    // 2. Validar stock vía HTTP (MS-Productos)
    for (const item of carrito) {
        // En tu carrito original, item.productos ya traía el precio, 
        // pero en microservicios puros, re-verificamos la fuente de verdad.
        const resProd = await fetch(`${MS_PRODUCTOS_URL}/${item.producto_id}`);
        if (!resProd.ok) throw new Error(`Producto ${item.producto_id} no encontrado.`);
        const producto = await resProd.json();

        if (producto.stock < item.cantidad) {
            throw new Error(`Stock insuficiente para el producto: ${producto.nombre}`);
        }

        totalPedido += (producto.precio * item.cantidad);
        detallesParaInsertar.push({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: producto.precio
        });
    }

    // 3. Persistencia en dominio propio (MS-Pedidos)
    const { data: pedido, error: errPed } = await supabase
        .from('pedidos')
        .insert([{ usuario_id, total: totalPedido, estado: 'completado' }])
        .select()
        .single();

    if (errPed) throw new Error("Error al generar la orden en base de datos.");

    // 4. Procesar Detalles y enviar comandos a otros microservicios
    for (const detalle of detallesParaInsertar) {
        detalle.pedido_id = pedido.id;
        
        // Insertamos el detalle localmente
        await supabase.from('detalles_pedido').insert([detalle]);
        
        // Comando HTTP: Descontar Stock (MS-Productos)
        await fetch(`${MS_PRODUCTOS_URL}/${detalle.producto_id}/descontar`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cantidad: detalle.cantidad })
        });
    }

    // 5. Comando HTTP: Vaciar el carrito (MS-Carritos)
    await fetch(`${MS_CARRITOS_URL}/usuario/${usuario_id}/vaciar`, {
        method: 'DELETE'
    });

    return {
        pedido_id: pedido.id,
        total: totalPedido
    };
};

const obtenerPedidosUsuario = async (usuario_id) => {
    // Obtenemos SOLO los datos de nuestro dominio, sin hacer JOIN a la tabla productos
    const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
            id, total, estado, creado_en,
            detalles_pedido ( producto_id, cantidad, precio_unitario )
        `)
        .eq('usuario_id', usuario_id)
        .order('creado_en', { ascending: false });

    if (error) throw new Error("Error al obtener el historial de pedidos.");

    // PATRÓN API COMPOSITION: Enriquecemos los datos pidiéndole los nombres a MS-Productos
    // Utilizamos Promise.all para hacer las peticiones concurrentes y no bloquear el hilo
    for (const pedido of pedidos) {
        await Promise.all(pedido.detalles_pedido.map(async (detalle) => {
            try {
                const resProd = await fetch(`${MS_PRODUCTOS_URL}/${detalle.producto_id}`);
                if (resProd.ok) {
                    const prodData = await resProd.json();
                    detalle.productos = { nombre: prodData.nombre }; // Estructuramos igual que el JOIN anterior
                } else {
                    detalle.productos = { nombre: "Producto no disponible" };
                }
            } catch (error) {
                detalle.productos = { nombre: "Error de sincronización" };
            }
        }));
    }

    return pedidos;
};

module.exports = { procesarCheckout, obtenerPedidosUsuario };