
const POLITICAS_NACIONAL = [
  'Cancelación gratuita hasta 15 días antes de la salida.',
  'Entre 14 y 7 días antes: cargo del 30 % del total.',
  'Con menos de 7 días o no presentación: cargo del 100 %.'
];

const POLITICAS_INTERNACIONAL = [
  'Cancelación gratuita hasta 30 días antes de la salida.',
  'Entre 29 y 15 días antes: cargo del 40 % del total.',
  'Con menos de 14 días o no presentación: cargo del 100 %.',
  'Se recomienda contratar seguro de viaje con cobertura médica.'
];

const PAQUETES = [
  {
    id: 1,
    destino: 'Cancún All-Inclusive',
    duracion: '5 días / 4 noches',
    incluye: ['Vuelo redondo desde CDMX', 'Hotel 5★ todo incluido', 'Traslados aeropuerto-hotel', 'Tour a Isla Mujeres'],
    precio: 18500,
    imagen: 'img/destino-cancun.jpg',
    descripcion: 'Playas de arena blanca y aguas turquesa en la Riviera Maya, con alimentos y bebidas ilimitados en un resort frente al mar.',
    politicas: POLITICAS_NACIONAL
  },
  {
    id: 2,
    destino: 'Europa en 15 días',
    duracion: '15 días / 14 noches',
    incluye: ['Vuelo redondo internacional', 'Hoteles 4★ con desayuno', 'Tren entre ciudades', 'Guía en español'],
    precio: 62900,
    imagen: 'img/destino-europa.jpg',
    descripcion: 'Un recorrido clásico por Madrid, París, Roma y Ámsterdam: museos, gastronomía y arquitectura en un solo viaje.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 3,
    destino: 'Experiencia en Nueva York',
    duracion: '6 días / 5 noches',
    incluye: ['Vuelo redondo', 'Hotel en Manhattan', 'Pase de atracciones', 'Entradas a un show de Broadway'],
    precio: 29800,
    imagen: 'img/destino-nueva-york.jpg',
    descripcion: 'La ciudad que nunca duerme: Times Square, Central Park, la Estatua de la Libertad y las mejores vistas desde sus rascacielos.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 4,
    destino: 'Safari en África',
    duracion: '10 días / 9 noches',
    incluye: ['Vuelos internacionales', 'Lodges y campamentos', 'Safaris diarios en 4x4', 'Pensión completa'],
    precio: 84500,
    imagen: 'img/destino-africa.jpg',
    descripcion: 'Aventura por Kenia y Tanzania para ver a los "cinco grandes" en la sabana, incluida la gran migración según la temporada.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 5,
    destino: 'Maravillas de Asia',
    duracion: '14 días / 13 noches',
    incluye: ['Vuelo redondo', 'Hoteles 4★', 'Trenes bala y vuelos internos', 'Visitas guiadas'],
    precio: 71200,
    imagen: 'img/destino-asia.jpg',
    descripcion: 'Tokio, Kioto, Bangkok y Singapur: templos milenarios, tecnología, cocina callejera y paisajes inolvidables.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 6,
    destino: 'Ruta por Sudamérica',
    duracion: '12 días / 11 noches',
    incluye: ['Vuelos internos', 'Hoteles 3★ y 4★', 'Entrada a Machu Picchu', 'Traslados y desayunos'],
    precio: 48700,
    imagen: 'img/destino-sudamerica.jpg',
    descripcion: 'Cusco y Machu Picchu, Buenos Aires y Río de Janeiro en una ruta que combina historia, tango, playa y carnaval.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 7,
    destino: 'Islas del Caribe',
    duracion: '8 días / 7 noches',
    incluye: ['Crucero en cabina exterior', 'Pensión completa a bordo', 'Excursiones en 4 islas', 'Entretenimiento nocturno'],
    precio: 35400,
    imagen: 'img/destino-caribe.jpg',
    descripcion: 'Crucero por el Caribe con paradas en islas paradisíacas: snorkel, playas vírgenes y gastronomía local.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 8,
    destino: 'Desierto de Dubái',
    duracion: '6 días / 5 noches',
    incluye: ['Vuelo redondo', 'Hotel 5★ en el centro', 'Safari por el desierto con cena', 'Subida al Burj Khalifa'],
    precio: 38900,
    imagen: 'img/destino-dubai.jpg',
    descripcion: 'Lujo y aventura: rascacielos futuristas, zocos tradicionales y una noche bajo las estrellas en el desierto.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 9,
    destino: 'Canadá y sus paisajes',
    duracion: '9 días / 8 noches',
    incluye: ['Vuelo redondo', 'Hoteles 4★', 'Renta de auto o tren panorámico', 'Excursión a Cataratas del Niágara'],
    precio: 52300,
    imagen: 'img/destino-canada.jpg',
    descripcion: 'Vancouver, las Rocosas de Banff, Toronto y las Cataratas del Niágara: lagos color esmeralda y montañas nevadas.',
    politicas: POLITICAS_INTERNACIONAL
  },
  {
    id: 10,
    destino: 'Ruta Maya México',
    duracion: '7 días / 6 noches',
    incluye: ['Transporte terrestre', 'Hoteles boutique', 'Entradas a zonas arqueológicas', 'Guía certificado'],
    precio: 16900,
    imagen: 'img/destino-ruta-maya.jpg',
    descripcion: 'Chichén Itzá, Uxmal, Palenque y Tulum: un viaje por el legado de la civilización maya y la selva del sureste.',
    politicas: POLITICAS_NACIONAL
  }
];

/* Llena un <select> con los 10 paquetes (value = id, texto = destino) */
function poblarSelectDestinos(select) {
  PAQUETES.forEach(function (p) {
    const opcion = document.createElement('option');
    opcion.value = p.id;
    opcion.textContent = p.destino;
    select.appendChild(opcion);
  });
}

function buscarPaquete(id) {
  return PAQUETES.find(function (p) { return p.id === Number(id); });
}

/* ---------- Catálogo en servicios.html ---------- */
function renderizarCatalogo() {
  const contenedor = document.getElementById('catalogo');
  if (!contenedor) return;

  contenedor.innerHTML = PAQUETES.map(function (p) {
    const incluye = p.incluye.map(function (i) { return '<li>' + i + '</li>'; }).join('');
    return '' +
      '<div class="col d-flex">' +
      '<article class="card card-paquete shadow-sm w-100">' +
      '<img src="' + p.imagen + '" class="card-img-top" alt="Imagen de ' + p.destino + '" loading="lazy">' +
      '<div class="card-body d-flex flex-column">' +
      '<h5 class="card-title">' + p.destino + '</h5>' +
      '<p class="duracion mb-2"><i class="bi bi-clock me-1"></i>' + p.duracion + '</p>' +
      '<p class="small fw-semibold mb-1">Incluye:</p>' +
      '<ul class="small lista-incluye">' + incluye + '</ul>' +
      '<div class="mt-auto d-flex justify-content-between align-items-center gap-2 flex-wrap">' +
      '<span class="precio">' + formatearPrecio(p.precio) + ' <small>por persona</small></span>' +
      '<button type="button" class="btn btn-accent btn-sm btn-mas-info" data-id="' + p.id + '">' +
      '<i class="bi bi-info-circle me-1"></i>Más información' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</article>' +
      '</div>';
  }).join('');

  contenedor.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-mas-info');
    if (boton) abrirModalPaquete(boton.dataset.id);
  });
}

/* ---------- Modal de detalle ---------- */
function abrirModalPaquete(id) {
  const p = buscarPaquete(id);
  if (!p) return;

  document.getElementById('modalPaqueteTitulo').textContent = p.destino;
  const img = document.getElementById('modalImagen');
  img.src = p.imagen;
  img.alt = 'Imagen de ' + p.destino;
  document.getElementById('modalDescripcion').textContent = p.descripcion;
  document.getElementById('modalDuracion').textContent = p.duracion;
  document.getElementById('modalPrecio').textContent = formatearPrecio(p.precio) + ' por persona';
  document.getElementById('modalIncluye').innerHTML =
    p.incluye.map(function (i) { return '<li>' + i + '</li>'; }).join('');
  document.getElementById('modalPoliticas').innerHTML =
    p.politicas.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  document.getElementById('modalReservar').href = 'registro.html?destino=' + p.id;

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPaquete')).show();
}

document.addEventListener('DOMContentLoaded', renderizarCatalogo);
