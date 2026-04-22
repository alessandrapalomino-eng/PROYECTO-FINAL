function renderInventario() {
    let filas = productos.map(p => `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.stock}</td>
            <td>$${p.costoPromedio.toFixed(2)}</td>
            <td>$${p.valorTotal.toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <h2>📊 Inventario Actual</h2>
        <table>
            <thead>
                <tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Costo Prom.</th><th>Total</th></tr>
            </thead>
            <tbody>${filas || '<tr><td colspan="5">No hay productos</td></tr>'}</tbody>
        </table>
    `;
}
