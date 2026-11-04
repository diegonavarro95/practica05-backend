const supabase = require('../config/supabase');

const obtenerProductos = async () => {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('categoria', { ascending: true });

    if (error) throw new Error("Error obteniendo el catálogo de la base de datos.");
    return data;
};

const verificarDisponibilidad = async (producto_id, cantidad) => {
    const { data, error } = await supabase
        .from('productos')
        .select('precio, stock')
        .eq('id', producto_id)
        .single();

    if (error || !data) throw new Error("Producto no encontrado.");
    if (data.stock < cantidad) throw new Error("Stock insuficiente.");
    
    return data;
};

const actualizarStock = async (producto_id, nuevoStock) => {
    const { error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', producto_id);

    if (error) throw new Error("Fallo al actualizar el inventario.");
};

module.exports = {
    obtenerProductos,
    verificarDisponibilidad,
    actualizarStock
};