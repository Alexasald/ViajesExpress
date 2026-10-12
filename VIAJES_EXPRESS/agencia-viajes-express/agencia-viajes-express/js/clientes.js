

document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.getElementById('tabla-clientes');
  if (!cuerpoTabla) return;

  const contenedorTabla = document.getElementById('contenedor-tabla');
  const estadoVacio = document.getElementById('estado-vacio');
  const contador = document.getElementById('contador-clientes');
  const botonExportar = document.getElementById('btn-exportar');

  /* Dibuja la tabla con los datos ACTUALES de localStorage */
  function renderizarTabla() {
    const clientes = obtenerClientes();
    contador.textContent = clientes.length;

    if (clientes.length === 0) {
      cuerpoTabla.innerHTML = '';
      contenedorTabla.classList.add('d-none');
      estadoVacio.classList.remove('d-none');
      return;
    }

    contenedorTabla.classList.remove('d-none');
    estadoVacio.classList.add('d-none');

    cuerpoTabla.innerHTML = clientes.map(function (c, indice) {
      return '' +
        '<tr>' +
        '<td class="fw-semibold">' + escaparHTML(c.nombre) + '</td>' +
        '<td>' + escaparHTML(c.correo) + '</td>' +
        '<td>' + escaparHTML(c.destino) + '</td>' +
        '<td class="text-center">' + escaparHTML(c.personas) + '</td>' +
        '<td>' + escaparHTML(formatearFecha(c.fecha)) + '</td>' +
        '<td class="text-nowrap">' +
        '<button type="button" class="btn btn-sm btn-outline-primary me-1 btn-editar" ' +
        'data-indice="' + indice + '" title="Editar">' +
        '<i class="bi bi-pencil-square"></i> Editar' +
        '</button>' +
        '<button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" ' +
        'data-indice="' + indice + '" title="Eliminar">' +
        '<i class="bi bi-trash3"></i> Eliminar' +
        '</button>' +
        '</td>' +
        '</tr>';
    }).join('');
  }

  /* Editar / Eliminar: en esta práctica solo muestran un alert() */
  cuerpoTabla.addEventListener('click', function (evento) {
    const botonEditar = evento.target.closest('.btn-editar');
    const botonEliminar = evento.target.closest('.btn-eliminar');
    const clientes = obtenerClientes();

    if (botonEditar) {
      const cliente = clientes[botonEditar.dataset.indice];
      alert('Editar: aquí se modificaría el registro de "' + cliente.nombre +
        '".\n(La edición real no se implementa en esta práctica.)');
    }

    if (botonEliminar) {
      const cliente = clientes[botonEliminar.dataset.indice];
      alert('Eliminar: aquí se borraría el registro de "' + cliente.nombre +
        '".\n(La eliminación real no se implementa en esta práctica.)');
    }
  });

  /* Exportar a clientes.txt */
  botonExportar.addEventListener('click', function () {
    const total = exportarClientesTXT();
    if (total === 0) {
      mostrarAlerta('alerta-clientes',
        'No hay clientes registrados para exportar. <a href="registro.html" class="alert-link">Registra el primero</a>.',
        'warning');
    } else {
      mostrarAlerta('alerta-clientes',
        'Se exportaron <strong>' + total + '</strong> registro(s) al archivo <strong>clientes.txt</strong>.',
        'success');
    }
  });

  /* Si otra pestaña modifica localStorage, la tabla se actualiza sola */
  window.addEventListener('storage', function (evento) {
    if (evento.key === CLAVE_CLIENTES || evento.key === null) renderizarTabla();
  });

  renderizarTabla();
});
