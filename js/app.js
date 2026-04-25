// CONFIGURACIÓN - REEMPLAZA CON TU URL
const URL_API = "https://script.google.com/macros/s/AKfycbyHLVXkwU2Qmgcb8Yrv1z6f8JAwiEvZYaqubDkrm9JyLoBuni8dWSPYxXXjFZvpPBRiPg/exec";

window.manejarErrorImagen = function(img, icono) {
    img.onerror = null;
    img.style.display = 'none';
    let contenedor = img.parentElement;
    if (contenedor && !contenedor.querySelector('.icono-respaldo')) {
        let span = document.createElement('span');
        span.className = 'icono-respaldo';
        span.style.fontSize = '4rem';
        span.textContent = icono || '🍽️';
        contenedor.appendChild(span);
    }
};

// CATÁLOGO DE PRODUCTOS (actualizado con tus 9 productos)
const productos = [
    // Empanadas
    { id: 1, nombre: "Empanada de Carne", descripcion: "Carne molida de res, cebolla, huevo duro, aceitunas", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-de-carne.png", icono: "🥟" },
    { id: 2, nombre: "Empanada de Pollo", descripcion: "Pechuga de pollo desmenuzada, cebolla, pimiento", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-de-pollo.jpg", icono: "🥟" },
    { id: 3, nombre: "Empanada Vegetariana", descripcion: "Espinaca, choclo, queso, champiñones", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-vegetariana.jpg", icono: "🥟" },
    { id: 4, nombre: "Empanada de Lomo Saltado", descripcion: "Lomo saltado peruano: carne, cebolla, tomate, papas", precio: 7.50, categoria: "empanadas", imagen: "img/empanada-lomo.jpg", icono: "🥟" },
    { id: 5, nombre: "Empanada de Ají de Gallina", descripcion: "Ají de gallina peruano, cremoso y picante", precio: 7.50, categoria: "empanadas", imagen: "img/empanada-aji.jpg", icono: "🥟" },
    { id: 6, nombre: "Empanada de Jamón y Queso", descripcion: "Jamón, queso mozzarella y orégano", precio: 6.50, categoria: "empanadas", imagen: "img/empanada-jamon-queso.jpg", icono: "🥟" },
    // Bebidas
    { id: 7, nombre: "Chicha Morada", descripcion: "Refresco de chicha morada tradicional. 500ml", precio: 5.00, categoria: "bebidas", imagen: "img/chicha-morada.jpg", icono: "🥤" },
    // Otros (bocaditos y pack)
    { id: 8, nombre: "Bocaditos", descripcion: "Ideal para esos días especiales", precio: 80.00, categoria: "bocaditos", imagen: "img/bocaditos.jpg", icono: "🧁" },
    { id: 9, nombre: "Pack Merienda", descripcion: "2 panes + 2 empanadas + jugo natural", precio: 35.00, categoria: "otros", imagen: "img/pack-merienda.jpg", icono: "🧺" }
];

let carrito = [];
let filtroActual = "todos";

// DOM elements
const productosGrid = document.getElementById('productos-grid');
const carritoItems = document.getElementById('carrito-items');
const cartCount = document.getElementById('cart-count');
const subtotalSpan = document.getElementById('subtotal');
const totalCarritoSpan = document.getElementById('total-carrito');
const cartBtn = document.getElementById('cart-btn');
const adminBtn = document.getElementById('admin-btn');
const logoHome = document.getElementById('logo-home');
const closeCarrito = document.getElementById('close-carrito');
const seguirComprando = document.getElementById('seguir-comprando');
const formularioCliente = document.getElementById('formulario-cliente');
const modalExito = document.getElementById('modal-exito');
const btnRefrescar = document.getElementById('btn-refrescar');
const contenedorPedidosAdmin = document.getElementById('tarjetas-pedidos');

function guardarCarrito() { localStorage.setItem('carritoDelivery', JSON.stringify(carrito)); }
function cargarCarritoStorage() { const g = localStorage.getItem('carritoDelivery'); if (g) { carrito = JSON.parse(g); actualizarCarritoUI(); } }

window.agregarAlCarrito = function(producto) {
    let existente = carrito.find(i => i.id === producto.id);
    if (existente) existente.cantidad++;
    else carrito.push({ ...producto, cantidad: 1 });
    guardarCarrito();
    actualizarCarritoUI();
    mostrarMensaje(producto.nombre + " agregado", 'exito');
};

window.actualizarCantidad = function(id, cambio) {
    let item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) carrito = carrito.filter(i => i.id !== id);
        guardarCarrito();
        actualizarCarritoUI();
    }
};

window.removerItem = function(id) {
    carrito = carrito.filter(i => i.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
};

function actualizarCarritoUI() {
    const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);
    cartCount.textContent = totalItems;
    const subtotal = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
    const total = subtotal + 5;
    subtotalSpan.textContent = `S/ ${subtotal.toFixed(2)}`;
    totalCarritoSpan.textContent = `S/ ${total.toFixed(2)}`;
    if (carrito.length === 0) {
        carritoItems.innerHTML = `<div class="carrito-vacio"><p>Tu carrito está vacío</p><button onclick="mostrarSeccion('seccion-tienda')">Ver productos</button></div>`;
        return;
    }
    carritoItems.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <div class="carrito-item-imagen">
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E🍽️%3C%2Ftext%3E%3C%2Fsvg%3E'">
            </div>
            <div class="carrito-item-info">
                <div class="carrito-item-nombre">${item.nombre}</div>
                <div class="carrito-item-precio">S/ ${item.precio.toFixed(2)} c/u</div>
            </div>
            <div class="carrito-item-cantidad">
                <button class="cantidad-btn" onclick="actualizarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="cantidad-btn" onclick="actualizarCantidad(${item.id}, 1)">+</button>
                <button class="remover-btn" onclick="removerItem(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderizarProductos() {
    const filtrados = filtroActual === 'todos'
        ? productos
        : productos.filter(p => p.categoria === filtroActual);
    productosGrid.innerHTML = filtrados.map(p => {
        const iconoSeguro = p.icono ? p.icono.replace(/'/g, "\\'") : '';
        return `
            <div class="tarjeta-producto">
                <div class="producto-imagen"><img src="${p.imagen}" alt="${p.nombre}" onerror="manejarErrorImagen(this, '${iconoSeguro}')"></div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${p.nombre}</h3>
                    <p class="producto-descripcion">${p.descripcion}</p>
                    <div class="producto-precio">S/ ${p.precio.toFixed(2)}</div>
                    <button class="btn-agregar" onclick="agregarAlCarrito(${JSON.stringify(p).replace(/"/g, '&quot;')})">Agregar al carrito</button>
                </div>
            </div>
        `;
    }).join('');
}

function mostrarMensaje(texto, tipo) {
    const toast = document.createElement('div');
    toast.textContent = texto;
    toast.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: ${tipo === 'exito' ? '#27ae60' : '#e74c3c'}; color: white; padding: 12px 24px; border-radius: 50px; z-index: 1000;`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

window.mostrarSeccion = function(idSeccion) {
    document.querySelectorAll('.seccion-contenido').forEach(sec => sec.classList.remove('active'));
    document.getElementById(idSeccion).classList.add('active');
    if (idSeccion === 'seccion-admin') cargarPedidosAdmin();
};

async function enviarPedido(event) {
    event.preventDefault();
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const direccion = document.getElementById('cliente-direccion').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const notas = document.getElementById('cliente-notas').value.trim();
    if (!nombre || !direccion || !telefono) { mostrarMensaje('Completa todos los campos', 'error'); return; }
    if (carrito.length === 0) { mostrarMensaje('Agrega productos al carrito', 'error'); return; }
    const subtotal = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
    const total = subtotal + 5;
    const pedido = {
        cliente: nombre, direccion, telefono, notas,
        productos: JSON.stringify(carrito.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio, imagen: i.imagen }))),
        subtotal: `S/ ${subtotal.toFixed(2)}`, delivery: "S/ 5.00", total: `S/ ${total.toFixed(2)}`, estado: "pendiente"
    };
    const btn = document.getElementById('btn-confirmar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    const formData = new URLSearchParams();
    Object.keys(pedido).forEach(k => formData.append(k, pedido[k]));
    try {
        const response = await fetch(URL_API, { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
            carrito = []; guardarCarrito(); actualizarCarritoUI(); formularioCliente.reset();
            modalExito.style.display = 'flex'; mostrarSeccion('seccion-tienda');
        } else throw new Error(result.error);
    } catch (error) { mostrarMensaje('Error al enviar pedido', 'error'); }
    finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar pedido'; }
}

async function cargarPedidosAdmin() {
    if (!contenedorPedidosAdmin) return;
    contenedorPedidosAdmin.innerHTML = '<div class="cargando-tarjetas">Cargando pedidos...</div>';
    try {
        const response = await fetch(URL_API);
        const pedidos = await response.json();
        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            contenedorPedidosAdmin.innerHTML = '<div class="sin-pedidos">No hay pedidos aún</div>';
            return;
        }
        const pedidosRecientes = pedidos.slice().reverse();
        const tarjetas = pedidosRecientes.map(p => {
            let productosArray = [], primerProducto = null;
            try { productosArray = JSON.parse(p.productos || '[]'); if (productosArray.length) primerProducto = productosArray[0]; } catch(e) {}
            const listaProductos = productosArray.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');
            const imagenPreview = primerProducto?.imagen || '';
            return `
                <div class="tarjeta-pedido-admin">
                    ${imagenPreview ? `<img src="${imagenPreview}" class="pedido-imagen" alt="producto" onerror="this.style.display='none'">` : `<div class="pedido-imagen" style="display:flex; align-items:center; justify-content:center; background:#f5e6d3;">🍽️</div>`}
                    <div class="pedido-info">
                        <strong>${escapeHtml(p.cliente)}</strong>
                        <div><i class="fas fa-map-marker-alt"></i> ${escapeHtml(p.direccion)}</div>
                        <div><i class="fab fa-whatsapp"></i> ${escapeHtml(p.telefono)}</div>
                        <div><i class="fas fa-shopping-bag"></i> ${escapeHtml(listaProductos)}</div>
                        <div><strong>💰 ${escapeHtml(p.total)}</strong></div>
                        ${p.notas ? `<div><i class="fas fa-pencil-alt"></i> ${escapeHtml(p.notas)}</div>` : ''}
                        <div class="fecha"><i class="far fa-calendar-alt"></i> ${formatearFecha(p.fecha)}</div>
                    </div>
                </div>
            `;
        }).join('');
        contenedorPedidosAdmin.innerHTML = tarjetas;
    } catch (error) { contenedorPedidosAdmin.innerHTML = '<div class="sin-pedidos">❌ Error al cargar pedidos</div>'; }
}

function formatearFecha(fechaStr) { try { return new Date(fechaStr).toLocaleString('es-PE'); } catch(e) { return fechaStr; } }
function escapeHtml(str) { if (str == null) return ''; return String(str).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }

cartBtn.onclick = () => mostrarSeccion('seccion-carrito');
adminBtn.onclick = () => mostrarSeccion('seccion-admin');
logoHome.onclick = () => mostrarSeccion('seccion-tienda');
closeCarrito.onclick = () => mostrarSeccion('seccion-tienda');
if (seguirComprando) seguirComprando.onclick = () => mostrarSeccion('seccion-tienda');
formularioCliente.addEventListener('submit', enviarPedido);
document.getElementById('cerrar-modal')?.addEventListener('click', () => modalExito.style.display = 'none');
btnRefrescar?.addEventListener('click', cargarPedidosAdmin);

document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroActual = btn.dataset.categoria;
        renderizarProductos();
    });
});

cargarCarritoStorage();
renderizarProductos();
cargarPedidosAdmin();