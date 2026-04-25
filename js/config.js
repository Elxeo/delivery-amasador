// ==========================================
// CONFIGURACIÓN GLOBAL
// ==========================================
// URL de tu Google Apps Script (Web App)
const URL_API = "https://script.google.com/macros/s/AKfycbyHLVXkwU2Qmgcb8Yrv1z6f8JAwiEvZYaqubDkrm9JyLoBuni8dWSPYxXXjFZvpPBRiPg/exec";

// Clave de acceso al panel de administración (cámbiala por la que quieras)
const CLAVE_ADMIN = "1234";

// Función auxiliar para mostrar mensajes flotantes (usada desde app.js y admin.js)
function mostrarMensajeGlobal(texto, tipo) {
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