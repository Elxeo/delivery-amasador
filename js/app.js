// ========== PRODUCTOS ==========
const productos = [
    { id: 1, nombre: "Empanada de Carne", descripcion: "Carne molida de res, cebolla, huevo duro, aceitunas", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-de-carne.png", icono: "🥟" },
    { id: 2, nombre: "Empanada de Pollo", descripcion: "Pechuga de pollo desmenuzada, cebolla, pimiento", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-de-pollo.jpg", icono: "🥟" },
    { id: 3, nombre: "Empanada Vegetariana", descripcion: "Espinaca, choclo, queso, champiñones", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-vegetariana.jpg", icono: "🥟" },
    { id: 4, nombre: "Empanada de Lomo Saltado", descripcion: "Lomo saltado peruano: carne, cebolla, tomate, papas", precio: 7.50, categoria: "empanadas", imagen: "img/empanada-lomo.jpg", icono: "🥟" },
    { id: 5, nombre: "Empanada de Ají de Gallina", descripcion: "Ají de gallina peruano, cremoso y picante", precio: 7.50, categoria: "empanadas", imagen: "img/empanada-aji.jpg", icono: "🥟" },
    { id: 6, nombre: "Empanada de Jamón y Queso", descripcion: "Jamón, queso mozzarella y orégano", precio: 6.50, categoria: "empanadas", imagen: "img/empanada-jamon-queso.jpg", icono: "🥟" },
    { id: 7, nombre: "Chicha Morada", descripcion: "Refresco de chicha morada tradicional. 500ml", precio: 5.00, categoria: "bebidas", imagen: "img/chicha-morada.jpg", icono: "🥤" },
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
const logoHome = document.getElementById('logo-home');
const closeCarrito = document.getElementById('close-carrito');
const seguirComprando = document.getElementById('seguir-comprando');
const formularioCliente = document.getElementById('formulario-cliente');
const modalExito = document.getElementById('modal-exito');

// Guardar carrito
function guardarCarrito() { localStorage.setItem('carritoDelivery', JSON.stringify(carrito)); }
function cargarCarritoStorage() { const g = localStorage.getItem('carritoDelivery'); if (g) { carrito = JSON.parse(g); actualizarCarritoUI(); } }

window.agregarAlCarrito = function(producto) {
    let existente = carrito.find(i => i.id === producto.id);
    if (existente) existente.cantidad++;
    else carrito.push({ ...producto, cantidad: 1 });
    guardarCarrito();
    actualizarCarritoUI();
    mostrarMensajeGlobal(producto.nombre + " agregado", 'exito');
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
    const filtrados = filtroActual === 'todos' ? productos : productos.filter(p => p.categoria === filtroActual);
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

// Enviar pedido
async function enviarPedido(event) {
    event.preventDefault();
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const direccion = document.getElementById('cliente-direccion').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const notas = document.getElementById('cliente-notas').value.trim();
    if (!nombre || !direccion || !telefono) { mostrarMensajeGlobal('Completa todos los campos', 'error'); return; }
    if (carrito.length === 0) { mostrarMensajeGlobal('Agrega productos al carrito', 'error'); return; }
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
            modalExito.style.display = 'flex';
            mostrarSeccion('seccion-tienda');
        } else throw new Error(result.error);
    } catch (error) { mostrarMensajeGlobal('Error al enviar pedido', 'error'); }
    finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar pedido'; }
}

// Navegación
window.mostrarSeccion = function(idSeccion) {
    document.querySelectorAll('.seccion-contenido').forEach(sec => sec.classList.remove('active'));
    document.getElementById(idSeccion).classList.add('active');
};

// Event listeners
cartBtn.onclick = () => mostrarSeccion('seccion-carrito');
logoHome.onclick = () => mostrarSeccion('seccion-tienda');
closeCarrito.onclick = () => mostrarSeccion('seccion-tienda');
if (seguirComprando) seguirComprando.onclick = () => mostrarSeccion('seccion-tienda');
formularioCliente.addEventListener('submit', enviarPedido);
document.getElementById('cerrar-modal')?.addEventListener('click', () => modalExito.style.display = 'none');

// Filtros
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroActual = btn.dataset.categoria;
        renderizarProductos();
    });
});

// Inicialización
cargarCarritoStorage();
renderizarProductos();