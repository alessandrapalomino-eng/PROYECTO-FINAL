// =============================================
// SWEET STOCK — Módulo 1 y 2
// =============================================

// Estado global
const state = {
  productos: {},   // { codigo: { nombre, stock, costoPromedio, costoTotal } }
  recepciones: []  // historial de recepciones
};

// =============================================
// NAVEGACIÓN
// =============================================
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.tab;

    document.querySelectorAll('.module').forEach(m => m.classList.remove('active-module'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    document.getElementById(target).classList.add('active-module');
    link.classList.add('active');
  });
});

// =============================================
// TOAST
// =============================================
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('hidden'), 3200);
}

// =============================================
// MÓDULO 1: REGISTRAR PRODUCTO
// =============================================

// Preview en tiempo real
['prod-stock', 'prod-costo'].forEach(id => {
  document.getElementById(id).addEventListener('input', updatePreview1);
});

function updatePreview1() {
  const stock = parseFloat(document.getElementById('prod-stock').value) || 0;
  const costo = parseFloat(document.getElementById('prod-costo').value) || 0;
  const total = stock * costo;

  document.getElementById('prev-total').textContent = formatMoney(total);
  document.getElementById('prev-promedio').textContent = formatMoney(costo);
}

function registrarProducto() {
  const codigo   = document.getElementById('prod-codigo').value.trim().toUpperCase();
  const nombre   = document.getElementById('prod-nombre').value.trim();
  const stock    = parseFloat(document.getElementById('prod-stock').value);
  const costo    = parseFloat(document.getElementById('prod-costo').value);

  // Validaciones
  if (!codigo) return showToast('⚠️ Ingresa un código de producto.', 'error');
  if (!nombre) return showToast('⚠️ Ingresa el nombre del postre.', 'error');
  if (isNaN(stock) || stock < 0) return showToast('⚠️ El stock inicial no puede ser negativo.', 'error');
  if (isNaN(costo) || costo < 0) return showToast('⚠️ El costo unitario no puede ser negativo.', 'error');
  if (state.productos[codigo]) return showToast(`⚠️ El código "${codigo}" ya está registrado.`, 'error');

  // Calcular
  const costoTotal    = stock * costo;
  const costoPromedio = costo; // promedio inicial = costo unitario

  // Guardar
  state.productos[codigo] = { nombre, stock, costoPromedio, costoTotal };

  // Agregar a tabla
  agregarFilaProducto(codigo, nombre, stock, costo, costoTotal, costoPromedio);

  // Limpiar formulario
  ['prod-codigo','prod-nombre','prod-stock','prod-costo'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('prev-total').textContent    = 'S/. 0.00';
  document.getElementById('prev-promedio').textContent = 'S/. 0.00';

  showToast(`🍰 "${nombre}" registrado exitosamente.`, 'success');
}

function agregarFilaProducto(codigo, nombre, stock, costoUnit, costoTotal, costoPromedio) {
  const wrapper = document.getElementById('tabla-productos-wrapper');
  wrapper.style.display = 'block';

  const tbody = document.getElementById('tbody-productos');
  const tr = document.createElement('tr');
  tr.classList.add('new-row');
  tr.id = `row-prod-${codigo}`;
  tr.innerHTML = `
    <td><span class="badge-code">${codigo}</span></td>
    <td><strong>${nombre}</strong></td>
    <td>${stock}</td>
    <td>${formatMoney(costoUnit)}</td>
    <td>${formatMoney(costoTotal)}</td>
    <td>${formatMoney(costoPromedio)}</td>
  `;
  tbody.appendChild(tr);
}

// Actualizar fila de producto cuando cambia stock/promedio tras recepción
function actualizarFilaProducto(codigo) {
  const p  = state.productos[codigo];
  const tr = document.getElementById(`row-prod-${codigo}`);
  if (!tr || !p) return;
  const tds = tr.querySelectorAll('td');
  tds[2].textContent = p.stock;
  tds[3].textContent = formatMoney(p.costoPromedio);
  tds[4].textContent = formatMoney(p.costoTotal);
  tds[5].textContent = formatMoney(p.costoPromedio);
  tr.classList.remove('new-row');
  void tr.offsetWidth;
  tr.classList.add('new-row');
}

// =============================================
// MÓDULO 2: RECEPCIÓN
// =============================================

function previewRecepcion() {
  const codigo   = document.getElementById('rec-codigo').value.trim().toUpperCase();
  const cantidad = parseFloat(document.getElementById('rec-cantidad').value) || 0;
  const costoNew = parseFloat(document.getElementById('rec-costo').value) || 0;

  const infoCard = document.getElementById('producto-info');
  const prev2    = document.getElementById('preview2');

  if (!codigo || !state.productos[codigo]) {
    infoCard.style.display = 'none';
    prev2.style.display    = 'none';
    return;
  }

  const p = state.productos[codigo];

  // Mostrar info del producto
  document.getElementById('pi-nombre').textContent  = p.nombre;
  document.getElementById('pi-codigo').textContent  = codigo;
  document.getElementById('pi-stock').textContent   = p.stock + ' uds';
  document.getElementById('pi-promedio').textContent = formatMoney(p.costoPromedio);
  infoCard.style.display = 'block';

  // Calcular preview si hay valores
  if (cantidad > 0 && costoNew > 0) {
    const costoTotalAnterior = p.stock * p.costoPromedio;
    const costoNuevaCompra   = cantidad * costoNew;
    const nuevoStock         = p.stock + cantidad;
    const nuevoTotal         = costoTotalAnterior + costoNuevaCompra;
    const nuevoPromedio      = nuevoStock > 0 ? nuevoTotal / nuevoStock : 0;

    document.getElementById('prev-nuevo-stock').textContent    = nuevoStock + ' uds';
    document.getElementById('prev-nuevo-total').textContent    = formatMoney(nuevoTotal);
    document.getElementById('prev-nuevo-promedio').textContent = formatMoney(nuevoPromedio);
    prev2.style.display = 'flex';
  } else {
    prev2.style.display = 'none';
  }
}

function registrarRecepcion() {
  const codigo   = document.getElementById('rec-codigo').value.trim().toUpperCase();
  const cantidad = parseFloat(document.getElementById('rec-cantidad').value);
  const costoNew = parseFloat(document.getElementById('rec-costo').value);

  // Validaciones
  if (!codigo) return showToast('⚠️ Ingresa el código del producto.', 'error');
  if (!state.productos[codigo]) return showToast(`⚠️ Producto "${codigo}" no encontrado.`, 'error');
  if (isNaN(cantidad) || cantidad <= 0) return showToast('⚠️ La cantidad debe ser mayor que 0.', 'error');
  if (isNaN(costoNew) || costoNew <= 0) return showToast('⚠️ El costo unitario debe ser mayor que 0.', 'error');

  const p = state.productos[codigo];

  // Fórmula costo promedio ponderado
  const costoTotalAnterior = p.stock * p.costoPromedio;
  const costoNuevaCompra   = cantidad * costoNew;
  const nuevoStock         = p.stock + cantidad;
  const nuevoTotal         = costoTotalAnterior + costoNuevaCompra;
  const nuevoPromedio      = nuevoStock > 0 ? nuevoTotal / nuevoStock : 0;

  // Actualizar estado
  p.stock         = nuevoStock;
  p.costoTotal    = nuevoTotal;
  p.costoPromedio = nuevoPromedio;

  // Guardar historial
  state.recepciones.push({
    fecha: formatFecha(new Date()),
    codigo,
    nombre: p.nombre,
    cantidad,
    costoUnitario: costoNew,
    stockResultante: nuevoStock,
    promedioResultante: nuevoPromedio
  });

  // Actualizar tabla de productos (módulo 1)
  actualizarFilaProducto(codigo);

  // Agregar fila al historial
  agregarFilaRecepcion(state.recepciones[state.recepciones.length - 1]);

  // Limpiar formulario
  ['rec-codigo','rec-cantidad','rec-costo'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('producto-info').style.display = 'none';
  document.getElementById('preview2').style.display      = 'none';

  showToast(`📥 Recepción de "${p.nombre}" registrada. Nuevo promedio: ${formatMoney(nuevoPromedio)}`, 'success');
}

function agregarFilaRecepcion(rec) {
  const wrapper = document.getElementById('tabla-recepciones-wrapper');
  wrapper.style.display = 'block';

  const tbody = document.getElementById('tbody-recepciones');
  const tr    = document.createElement('tr');
  tr.classList.add('new-row');
  tr.innerHTML = `
    <td>${rec.fecha}</td>
    <td><span class="badge-code">${rec.codigo}</span></td>
    <td>${rec.nombre}</td>
    <td><strong>${rec.cantidad}</strong> uds</td>
    <td>${formatMoney(rec.costoUnitario)}</td>
    <td>${rec.stockResultante} uds</td>
    <td><strong>${formatMoney(rec.promedioResultante)}</strong></td>
  `;
  tbody.insertBefore(tr, tbody.firstChild); // más reciente primero
}

// =============================================
// UTILIDADES
// =============================================

function formatMoney(n) {
  return 'S/. ' + (isNaN(n) ? '0.00' : n.toFixed(2));
}

function formatFecha(d) {
  return d.toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}