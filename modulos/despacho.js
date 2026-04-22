function renderDespacho() {
    return `
        <h2>📤 Despacho de Postres</h2>
        <form onsubmit="ejecutarDespacho(event)">
            <input type="text" id="des-codigo" placeholder="Código del producto" required>
            <input type="number" id="des-cantidad" placeholder="Cantidad a despachar" required>
            <button type="submit" style="background:#5D4037; color:white; padding:10px">Registrar Salida</button>
        </form>
    `;
}

function ejecutarDespacho(e) {
    e.preventDefault();
    const codigo = document.getElementById('des-codigo').value;
    const cantidad = parseFloat(document.getElementById('des-cantidad').value);

    let p = productos.find(prod => prod.codigo === codigo);
    if (!p) return alert("Producto no encontrado");
    if (cantidad > p.stock) return alert("¡Error! No hay suficiente stock.");

    p.stock -= cantidad;
    p.valorTotal = p.stock * p.costoPromedio; // Al despachar el costo promedio NO cambia

    historial.push({ tipo: 'Despacho', codigo, cantidad, fecha: new Date().toLocaleDateString() });
    alert("Despacho realizado con éxito");
}