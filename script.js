// Arreglo para almacenar nuestros productos de ropa deportiva
let inventario = [];

const formRegistro = document.getElementById('form-registro');

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capturar valores
    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const stockInicial = parseFloat(document.getElementById('stock-inicial').value);
    const costoUnitario = parseFloat(document.getElementById('costo-inicial').value);

    // Validaciones de Reglas de Negocio [cite: 61, 62, 63]
    if (inventario.find(p => p.codigo === codigo)) {
        alert("Error: El código ya existe.");
        return;
    }
    if (stockInicial < 0 || costoUnitario < 0) {
        alert("Error: El stock y el costo no pueden ser negativos.");
        return;
    }

    // Cálculos iniciales [cite: 14, 15]
    const costoTotalInicial = stockInicial * costoUnitario;
    const costoPromedioInicial = costoUnitario;

    // Crear objeto del producto
    const nuevoProducto = {
        codigo: codigo,
        nombre: nombre,
        stock: stockInicial,
        costoPromedio: costoPromedioInicial,
        costoTotal: costoTotalInicial
    };

    // Guardar en nuestro "almacén"
    inventario.push(nuevoProducto);
    
    console.log("Producto Registrado:", nuevoProducto);
    document.getElementById('mensaje-exito').innerText = `Producto ${nombre} registrado con éxito.`;
    
    formRegistro.reset();
});
const formRecepcion = document.getElementById('form-recepcion');

formRecepcion.addEventListener('submit', (e) => {
    e.preventDefault();

    const codigo = document.getElementById('recep-codigo').value.trim();
    const cantidadRecibida = parseFloat(document.getElementById('recep-cantidad').value);
    const costoCompraUnitario = parseFloat(document.getElementById('recep-costo').value);

    // 1. Validar que el producto exista en el inventario [cite: 67]
    const producto = inventario.find(p => p.codigo === codigo);

    if (!producto) {
        alert("Error: El producto no existe. Regístralo en el Módulo 1 primero.");
        return;
    }

    // 2. Reglas de negocio: Cantidad y costo deben ser mayores a 0 [cite: 65, 66]
    if (cantidadRecibida <= 0 || costoCompraUnitario <= 0) {
        alert("Error: La cantidad y el costo deben ser mayores a cero.");
        return;
    }

    // --- CÁLCULOS SEGÚN LA GUÍA ---
    
    // Costo de la nueva compra [cite: 27, 28]
    const costoNuevaCompra = cantidadRecibida * costoCompraUnitario;

    // Guardamos datos anteriores para la fórmula [cite: 25]
    const stockAnterior = producto.stock;
    const costoTotalAnterior = producto.costoTotal;

    // Aplicamos fórmula del Costo Promedio Nuevo [cite: 25]
    // (Costo Total Anterior + Costo Nueva Compra) / (Stock Anterior + Cantidad Recibida)
    const nuevoStock = stockAnterior + cantidadRecibida; [cite: 21]
    const nuevoCostoTotal = costoTotalAnterior + costoNuevaCompra; [cite: 22]
    const nuevoCostoPromedio = nuevoCostoTotal / nuevoStock; [cite: 23, 25]

    // 3. Actualizar el objeto en el inventario
    producto.stock = nuevoStock;
    producto.costoTotal = nuevoCostoTotal;
    producto.costoPromedio = nuevoCostoPromedio;

    console.log(`Ingreso exitoso de ${producto.nombre}. Nuevo Costo Promedio: S/ ${nuevoCostoPromedio.toFixed(2)}`);
    alert(`¡Ingreso registrado! El nuevo costo promedio de ${producto.nombre} es S/ ${nuevoCostoPromedio.toFixed(2)}`);
    
    formRecepcion.reset();
});