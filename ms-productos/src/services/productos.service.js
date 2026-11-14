const supabase = require('../config/supabase');

const obtenerProductos = async () => {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('categoria', { ascending: true });
    if (error) throw new Error("Error al obtener los productos.");
    return data;
};

// NUEVO: Requerido por Carritos y Pedidos para el patrón API Composition
const obtenerProductoPorId = async (id) => {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw new Error("Producto no encontrado.");
    return data;
};

// NUEVO: Comando ejecutado por Pedidos durante el Checkout
const descontarStock = async (id, cantidadRestar) => {
    const { data: producto } = await supabase.from('productos').select('stock').eq('id', id).single();
    if (!producto) throw new Error("Producto inexistente.");
    
    const nuevoStock = producto.stock - cantidadRestar;
    if (nuevoStock < 0) throw new Error("Stock insuficiente.");

    const { error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', id);
    if (error) throw new Error("Error al actualizar el stock.");
};

module.exports = { obtenerProductos, obtenerProductoPorId, descontarStock };