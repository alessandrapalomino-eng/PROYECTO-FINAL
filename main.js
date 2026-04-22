// Base de datos global compartida
let productos = [];
let historial = [];

function cambiarModulo(tipo) {
    const contenedor = document.getElementById('app-container');
    
    if (tipo === 'registro') contenedor.innerHTML = renderRegistro();
    if (tipo === 'recepcion') contenedor.innerHTML = renderRecepcion();
    if (tipo === 'despacho') contenedor.innerHTML = renderDespacho();
    if (tipo === 'inventario') contenedor.innerHTML = renderInventario();
}
