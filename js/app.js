// CONFIGURACIÓN - REEMPLAZA CON TU URL DE GOOGLE APPS SCRIPT
const URL_API = "https://script.google.com/macros/s/AKfycbyHLVXkwU2Qmgcb8Yrv1z6f8JAwiEvZYaqubDkrm9JyLoBuni8dWSPYxXXjFZvpPBRiPg/exec";

// ========== CATÁLOGO DE PRODUCTOS ==========
const productos = [
    { id: 1, nombre: "🥟 Empanada de Carne", descripcion: "Carne molida de res, cebolla, huevo duro, aceitunas", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-de-carne.png", icono: "🥟" },
    { id: 2, nombre: "🥟 Empanada de Pollo", descripcion: "Pechuga de pollo desmenuzada, cebolla, pimiento", precio: 6.00, categoria: "empanadas", imagen: "img/empanada-de-pollo.jpg", icono: "🥟" },
    { id: 3, nombre: "🥖 Pan Artesanal", descripcion: "Pan de masa madre con 24 horas de fermentación", precio: 10.00, categoria: "panes", imagen: "img/pan-artesanal.jpg", icono: "🥖" },
    { id: 4, nombre: "🥖 Pan de Queso", descripcion: "Pan relleno de queso mozzarella y parmesano", precio: 8.00, categoria: "panes", imagen: "img/pan-artesanal.jpg", icono: "🧀" },
    { id: 5, nombre: "🎂 Torta Temática", descripcion: "Bizcocho de vainilla/chocolate, relleno de manjar", precio: 60.00, categoria: "postres", imagen: "img/torta-tematica.jpg", icono: "🎂" },
    { id: 6, nombre: "🧁 Alfajores (6 unid)", descripcion: "Galletitas de maicena con manjar blanco", precio: 15.00, categoria: "postres", imagen: "img/torta-tematica.jpg", icono: "🧁" },
    { id: 7, nombre: "🧺 Pack Merienda", descripcion: "2 panes + 2 empanadas + jugo natural", precio: 35.00, categoria: "combos", imagen: "img/pack-merienda.jpg", icono: "🧺" },
    { id: 8, nombre: "🎁 Pack Familiar", descripcion: "6 empanadas + 1 pan grande + 1 torta pequeña", precio: 55.00, categoria: "combos", imagen: "img/pack-merienda.jpg", icono: "🎁" }
];

let carrito = [];
let filtroActual = "todos";

// DOM Elements
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

// Guardar carrito
function guardarCarrito() {
    localStorage.setItem('carritoDelivery', JSON.stringify(carrito));
}

// Cargar carrito
function cargarCarritoStorage() {
    const guardado = localStorage.getItem('carritoDelivery');
    if (guardado) {
        carrito = JSON.parse(guardado);
        actualizarCarritoUI();
    }
}

// Agregar al carrito
window.agregarAlCarrito = function(producto) {
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarritoUI();
    mostrarMensaje(`✓ ${producto.nombre} agregado`, 'exito');
};

// Actualizar cantidad
window.actualizarCantidad = function(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
        guardarCarrito();
        actualizarCarritoUI();
    }
};

// Remover item
window.removerItem = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
};

// Actualizar UI del carrito
function actualizarCarritoUI() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;
    
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal + 5.00;
    
    subtotalSpan.textContent = `S/ ${subtotal.toFixed(2)}`;
    totalCarritoSpan.textContent = `S/ ${total.toFixed(2)}`;
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = `<div class="carrito-vacio"><p>Tu carrito está vacío</p><button onclick="mostrarSeccion('seccion-tienda')">Seguir comprando</button></div>`;
        return;
    }
    
    carritoItems.innerHTML = carrito.map(item => `
        <div class="carrito-item">
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

// Renderizar productos (versión corregida)
function renderizarProductos() {
    const filtrados = filtroActual === 'todos'
        ? productos
        : productos.filter(p => p.categoria === filtroActual);

    productosGrid.innerHTML = filtrados.map(producto => {
        // Escapamos el icono para evitar comillas problemáticas
        const iconoSeguro = producto.icono ? producto.icono.replace(/'/g, "\\'") : '';
        return `
            <div class="tarjeta-producto">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}"
                         onerror="manejarErrorImagen(this, '${iconoSeguro}')">
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <div class="producto-precio">S/ ${producto.precio.toFixed(2)}</div>
                    <button class="btn-agregar" onclick="agregarAlCarrito(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Mostrar mensaje
function mostrarMensaje(texto, tipo) {
    const toast = document.createElement('div');
    toast.textContent = texto;
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: ${tipo === 'exito' ? '#27ae60' : '#e74c3c'}; color: white;
        padding: 12px 24px; border-radius: 50px; z-index: 1000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Navegación
window.mostrarSeccion = function(idSeccion) {
    document.querySelectorAll('.seccion-contenido').forEach(sec => sec.classList.remove('active'));
    document.getElementById(idSeccion).classList.add('active');
    if (idSeccion === 'seccion-admin') cargarPedidosAdmin();
};

// Enviar pedido
async function enviarPedido(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const direccion = document.getElementById('cliente-direccion').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const notas = document.getElementById('cliente-notas').value.trim();
    
    if (!nombre || !direccion || !telefono) {
        mostrarMensaje('Completa todos los campos', 'error');
        return;
    }
    
    if (carrito.length === 0) {
        mostrarMensaje('Agrega productos al carrito', 'error');
        return;
    }
    
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal + 5.00;
    
    const pedido = {
        cliente: nombre, direccion: direccion, telefono: telefono, notas: notas,
        productos: JSON.stringify(carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad, precio: item.precio }))),
        subtotal: `S/ ${subtotal.toFixed(2)}`, delivery: "S/ 5.00", total: `S/ ${total.toFixed(2)}`, estado: "pendiente"
    };
    
    const btn = document.getElementById('btn-confirmar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    const formData = new URLSearchParams();
    Object.keys(pedido).forEach(key => formData.append(key, pedido[key]));
    
    try {
        const response = await fetch(URL_API, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            carrito = [];
            guardarCarrito();
            actualizarCarritoUI();
            formularioCliente.reset();
            modalExito.style.display = 'flex';
            mostrarSeccion('seccion-tienda');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        mostrarMensaje('Error al enviar pedido', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar pedido';
    }
}

// Cargar pedidos admin
async function cargarPedidosAdmin() {
    if (!contenedorPedidosAdmin) return;
    contenedorPedidosAdmin.innerHTML = '<div class="cargando-tarjetas">Cargando pedidos...</div>';
    
    try {
        const response = await fetch(URL_API);
        const pedidos = await response.json();
        
        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            contenedorPedidosAdmin.innerHTML = '<div class="sin-pedidos">🍞 No hay pedidos aún</div>';
            return;
        }
        
        contenedorPedidosAdmin.innerHTML = pedidos.slice().reverse().map(p => {
            let productosTexto = '';
            try {
                productosTexto = JSON.parse(p.productos || '[]').map(item => `${item.cantidad}x ${item.nombre}`).join(', ');
            } catch(e) {
                productosTexto = p.productos || '';
            }
            return `
                <div class="tarjeta-pedido-admin">
                    <div><strong>👤 ${p.cliente || ''}</strong></div>
                    <div><i class="fas fa-map-marker-alt"></i> ${p.direccion || ''}</div>
                    <div><i class="fab fa-whatsapp"></i> ${p.telefono || ''}</div>
                    <div><i class="fas fa-shopping-bag"></i> ${productosTexto}</div>
                    <div><strong>💰 ${p.total || ''}</strong></div>
                    ${p.notas ? `<div><i class="fas fa-pencil-alt"></i> ${p.notas}</div>` : ''}
                    <div class="fecha"><i class="far fa-calendar-alt"></i> ${new Date(p.fecha).toLocaleString('es-PE')}</div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error:', error);
        contenedorPedidosAdmin.innerHTML = '<div class="sin-pedidos">❌ Error al cargar pedidos</div>';
    }
}

// Event Listeners
cartBtn.onclick = () => mostrarSeccion('seccion-carrito');
adminBtn.onclick = () => mostrarSeccion('seccion-admin');
logoHome.onclick = () => mostrarSeccion('seccion-tienda');
closeCarrito.onclick = () => mostrarSeccion('seccion-tienda');
if (seguirComprando) seguirComprando.onclick = () => mostrarSeccion('seccion-tienda');
formularioCliente.addEventListener('submit', enviarPedido);
document.getElementById('cerrar-modal')?.addEventListener('click', () => modalExito.style.display = 'none');
btnRefrescar?.addEventListener('click', cargarPedidosAdmin);

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
cargarPedidosAdmin();