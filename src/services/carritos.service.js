const supabase = require('../config/supabase');

const obtenerCarritoUsuario = async (usuario_id) => {
    
    const { data, error } = await supabase
        .from('carritos')
        .select(`
            id, cantidad, producto_id,
            productos (nombre, precio, stock)
        `)
        .eq('usuario_id', usuario_id);

    if (error) throw new Error("Error obteniendo el carrito.");
    return data;
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
    const { error } = await supabase
        .from('carritos')
        .delete()
        .eq('id', carrito_id);
    if (error) throw new Error("Error al eliminar el item del carrito.");
};

module.exports = { obtenerCarritoUsuario, agregarAlCarrito, eliminarDelCarrito };