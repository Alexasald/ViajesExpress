

const CLAVE_CLIENTES = 'clientes';

/* Menú de navegación dinámico */
const ENLACES_MENU = [
  { archivo: 'index.html', texto: 'Inicio', icono: 'bi-house-door' },
  { archivo: 'servicios.html', texto: 'Servicios', icono: 'bi-suitcase-lg' },
  { archivo: 'registro.html', texto: 'Registro', icono: 'bi-person-plus' },
  { archivo: 'clientes.html', texto: 'Lista de Clientes', icono: 'bi-people' },
  { archivo: 'contacto.html', texto: 'Contacto', icono: 'bi-envelope' }
];

function construirMenu() {
  const contenedor = document.getElementById('menu-principal');
  if (!contenedor) return;

  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

  const items = ENLACES_MENU.map(function (enlace) {
    const activo = enlace.archivo === paginaActual;
    return '<li class="nav-item">' +
      '<a class="nav-link' + (activo ? ' active' : '') + '" href="' + enlace.archivo + '"' +
      (activo ? ' aria-current="page"' : '') + '>' +
      '<i class="bi ' + enlace.icono + ' me-1"></i>' + enlace.texto +
      '</a></li>';
  }).join('');

  contenedor.innerHTML =
    '<nav class="navbar navbar-expand-lg navbar-dark navbar-agencia sticky-top">' +
    '<div class="container">' +
    '<a class="navbar-brand" href="index.html">' +
    '<i class="bi bi-airplane-fill me-2"></i>Agencia de Viajes <span>Express</span>' +
    '</a>' +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" ' +
    'data-bs-target="#menuNav" aria-controls="menuNav" aria-expanded="false" ' +
    'aria-label="Mostrar menú de navegación">' +
    '<span class="navbar-toggler-icon"></span>' +
    '</button>' +
    '<div class="collapse navbar-collapse" id="menuNav">' +
    '<ul class="navbar-nav ms-auto mb-2 mb-lg-0">' + items + '</ul>' +
    '</div>' +
    '</div>' +
    '</nav>';
}

function construirPie() {
  const contenedor = document.getElementById('pie-pagina');
  if (!contenedor) return;

  const anio = new Date().getFullYear();
  contenedor.innerHTML =
    '<footer class="footer-agencia py-4 mt-auto">' +
    '<div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">' +
    '<div><i class="bi bi-airplane-fill text-warning me-2"></i>' +
    '<strong>Agencia de Viajes Express</strong> &copy; ' + anio + '</div>' +
    '<div class="small">' +
    '<a href="servicios.html">Paquetes</a> &middot; ' +
    '<a href="registro.html">Registro</a> &middot; ' +
    '<a href="contacto.html">Contacto</a>' +
    '</div>' +
    '</div>' +
    '</footer>';
}

/* ---------- localStorage ---------- */
function obtenerClientes() {
  try {
    const datos = localStorage.getItem(CLAVE_CLIENTES);
    const lista = datos ? JSON.parse(datos) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.error('No se pudieron leer los clientes de localStorage:', error);
    return [];
  }
}

function guardarClientes(lista) {
  localStorage.setItem(CLAVE_CLIENTES, JSON.stringify(lista));
}

/* ---------- Validaciones ---------- */
function emailValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
}

/* Devuelve true si la fecha y es posterior a hoy */
function fechaEsFutura(valor) {
  if (!valor) return false;
  const partes = valor.split('-').map(Number);
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fecha > hoy;
}

/* Fecha de mañana en formato AAAA-MM-DD */
function fechaManana() {
  const f = new Date();
  f.setDate(f.getDate() + 1);
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const dia = String(f.getDate()).padStart(2, '0');
  return f.getFullYear() + '-' + mes + '-' + dia;
}

/* ---------- Formato ---------- */
function formatearFecha(valor) {
  if (!valor) return '';
  const p = valor.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function formatearPrecio(numero) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(numero);
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto == null ? '' : String(texto);
  return div.innerHTML;
}

/* ---------- Alertas y mensajes dinámicos (Bootstrap) ---------- */
function mostrarAlerta(idContenedor, mensaje, tipo, icono) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  tipo = tipo || 'success';
  icono = icono || (tipo === 'success' ? 'bi-check-circle-fill' :
    tipo === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill');

  contenedor.innerHTML =
    '<div class="alert alert-' + tipo + ' alert-dismissible fade show d-flex align-items-center" role="alert">' +
    '<i class="bi ' + icono + ' me-2 fs-5"></i>' +
    '<div>' + mensaje + '</div>' +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>' +
    '</div>';

  contenedor.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- Exportación a clientes.txt ---------- */
function generarTextoClientes(lista) {
  const salto = '\r\n';
  const ahora = new Date();
  const linea = '='.repeat(52);
  const sep = '-'.repeat(52);

  let texto = linea + salto;
  texto += 'AGENCIA DE VIAJES EXPRESS - REGISTRO DE CLIENTES' + salto;
  texto += 'Generado: ' + ahora.toLocaleString('es-MX') + salto;
  texto += 'Total de clientes: ' + lista.length + salto;
  texto += linea + salto + salto;

  lista.forEach(function (c, i) {
    texto += 'Cliente #' + (i + 1) + salto;
    texto += 'Nombre:          ' + c.nombre + salto;
    texto += 'Correo:          ' + c.correo + salto;
    texto += 'Destino:         ' + c.destino + salto;
    texto += 'Personas:        ' + c.personas + salto;
    texto += 'Fecha tentativa: ' + formatearFecha(c.fecha) + salto;
    texto += 'Comentarios:     ' + (c.comentarios ? c.comentarios : '(sin comentarios)') + salto;
    texto += 'Registrado el:   ' + (c.registradoEn || '') + salto;
    texto += sep + salto + salto;
  });

  return texto;
}

/* Descarga clientes.txt. Devuelve la cantidad de registros exportados. */
function exportarClientesTXT() {
  const lista = obtenerClientes();
  if (lista.length === 0) return 0;

  const contenido = generarTextoClientes(lista);
  const blob = new Blob(['﻿' + contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'clientes.txt';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);

  return lista.length;
}

/* ---------- Inicialización común ---------- */
document.addEventListener('DOMContentLoaded', function () {
  construirMenu();
  construirPie();
});
