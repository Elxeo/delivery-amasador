// ========== ADMINISTRACIÓN PROTEGIDA ==========
let adminAutenticado = false;
const contenedorPedidosAdmin = document.getElementById('tarjetas-pedidos');

function mostrarMensaje(texto, tipo) {
    const toast = document.createElement('div');
    toast.textContent = texto;
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: ${tipo === 'exito' ? '#27ae60' : '#e74c3c'}; color: white;
        padding: 12px 24px; border-radius: 50px; z-index: 1000;
        animation: fadeIn 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
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
    } catch (error) {
        contenedorPedidosAdmin.innerHTML = '<div class="sin-pedidos">❌ Error al cargar pedidos</div>';
    }
}

function escapeHtml(str) { if (str == null) return ''; return String(str).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }
function formatearFecha(fechaStr) { try { return new Date(fechaStr).toLocaleString('es-PE'); } catch(e) { return fechaStr; } }

// Autenticación al cargar la página
function autenticar() {
    const claveIngresada = prompt("Ingrese la clave de administrador:");
    if (claveIngresada === CLAVE_ADMIN) {
        adminAutenticado = true;
        cargarPedidosAdmin();
    } else {
        mostrarMensaje("Clave incorrecta. Acceso denegado.", "error");
        document.body.innerHTML = '<div style="text-align:center; padding:2rem;"><h1>Acceso denegado</h1><p>No tienes permiso para ver esta página.</p><a href="index.html">Volver a la tienda</a></div>';
    }
}

// Evento del botón refrescar (solo si existe)
const btnRefrescar = document.getElementById('btn-refrescar');
if (btnRefrescar) btnRefrescar.onclick = () => { if (adminAutenticado) cargarPedidosAdmin(); };

// Iniciar autenticación
autenticar();