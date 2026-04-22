function renderRecepcion() {
    return `
        <h2>📥 Recepción de Insumos</h2>
        <form onsubmit="ejecutarRecepcion(event)">
            <input type="text" id="rec-codigo" placeholder="Código del producto" required>
            <input type="number" id="rec-cantidad" placeholder="Cantidad recibida" required>
            <input type="number" id="rec-costo" placeholder="Costo unitario de compra" step="0.01" required>
            <button type="submit" style="background:#8D6E63; color:white; padding:10px">Actualizar Inventario</button>
        </form>
    `;
}

function ejecutarRecepcion(e) {
    e.preventDefault();
    const codigo = document.getElementById('rec-codigo').value;
    const cantRecibida = parseFloat(document.getElementById('rec-cantidad').value);
    const costoCompra = parseFloat(document.getElementById('rec-costo').value);

    let p = productos.find(prod => prod.codigo === codigo);
    if (!p) return alert("Producto no registrado");

    // FÓRMULA COSTO PROMEDIO PONDERADO
    const costoTotalAnterior = p.stock * p.costoPromedio;
    const costoNuevaCompra = cantRecibida * costoCompra;
    
    p.costoPromedio = (costoTotalAnterior + costoNuevaCompra) / (p.stock + cantRecibida);
    p.stock += cantRecibida;
    p.valorTotal = p.stock * p.costoPromedio;

    historial.push({ tipo: 'Recepción', codigo, cantidad: cantRecibida, fecha: new Date().toLocaleDateString() });
    alert("Stock y Costo Promedio actualizados");
}
