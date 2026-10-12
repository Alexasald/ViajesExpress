document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('form-registro');
  if (!formulario) return;

  const campos = {
    nombre: document.getElementById('nombre'),
    correo: document.getElementById('correo'),
    destino: document.getElementById('destino'),
    personas: document.getElementById('personas'),
    fecha: document.getElementById('fecha')
  };
  const comentarios = document.getElementById('comentarios');

  /* Select de destinos con los 10 paquetes */
  poblarSelectDestinos(campos.destino);

  /* La fecha mínima es mañana  */
  campos.fecha.min = fechaManana();

  /* Si se llega desde el modal de servicios.html (?destino=ID), se preselecciona */
  const idDestino = new URLSearchParams(window.location.search).get('destino');
  if (idDestino && buscarPaquete(idDestino)) {
    campos.destino.value = idDestino;
  }

  /* ---------- Validación de un campo ---------- */
  function validarCampo(input) {
    const valor = input.value.trim();
    let mensaje = '';

    switch (input.id) {
      case 'nombre':
        if (!valor) mensaje = 'El nombre completo es obligatorio.';
        else if (valor.length < 3) mensaje = 'Escribe al menos 3 caracteres.';
        break;

      case 'correo':
        if (!valor) mensaje = 'El correo electrónico es obligatorio.';
        else if (!emailValido(valor)) mensaje = 'Ingresa un correo válido (ej. nombre@dominio.com).';
        break;

      case 'destino':
        if (!valor) mensaje = 'Selecciona un destino de interés.';
        break;

      case 'personas': {
        const n = Number(valor);
        if (!valor) mensaje = 'Indica el número de personas.';
        else if (!Number.isInteger(n) || n < 1 || n > 20) mensaje = 'Debe ser un número entero entre 1 y 20.';
        break;
      }

      case 'fecha':
        if (!valor) mensaje = 'La fecha tentativa de viaje es obligatoria.';
        else if (!fechaEsFutura(valor)) mensaje = 'La fecha de viaje debe ser posterior a hoy.';
        break;
    }

    marcarCampo(input, mensaje);
    return mensaje === '';
  }

  function marcarCampo(input, mensaje) {
    const retro = input.parentElement.querySelector('.invalid-feedback');
    if (mensaje) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (retro) retro.textContent = mensaje;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  }

  /* Validación en vivo: al salir del campo y al corregir un error */
  Object.values(campos).forEach(function (input) {
    input.addEventListener('blur', function () { validarCampo(input); });
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid')) validarCampo(input);
    });
    input.addEventListener('change', function () { validarCampo(input); });
  });

  /* ---------- Envío ---------- */
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    /* Se validan todos los campos  */
    const resultados = Object.values(campos).map(validarCampo);
    const primerError = Object.values(campos).find(function (c) {
      return c.classList.contains('is-invalid');
    });

    if (resultados.includes(false)) {
      mostrarAlerta('alerta-registro',
        'Revisa los campos marcados en rojo antes de continuar.', 'danger');

      /* Alerta emergente el cliente NO se registró */
      const errores = Object.values(campos)
        .filter(function (c) { return c.classList.contains('is-invalid'); })
        .map(function (c) {
          const retro = c.parentElement.querySelector('.invalid-feedback');
          return '• ' + (retro ? retro.textContent : 'Campo inválido');
        });
      setTimeout(function () {
        alert(' El cliente NO fue registrado.\n\nCorrige lo siguiente:\n' + errores.join('\n'));
        if (primerError) primerError.focus();
      }, 50);
      return;
    }

    const paquete = buscarPaquete(campos.destino.value);
    const cliente = {
      id: Date.now(),
      nombre: campos.nombre.value.trim(),
      correo: campos.correo.value.trim(),
      destino: paquete ? paquete.destino : campos.destino.value,
      personas: Number(campos.personas.value),
      fecha: campos.fecha.value,
      comentarios: comentarios.value.trim(),
      registradoEn: new Date().toLocaleString('es-MX')
    };

    /* Se intenta guardar en localStorage; si falla, el cliente NO se registró */
    try {
      const lista = obtenerClientes();
      lista.push(cliente);
      guardarClientes(lista);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      mostrarAlerta('alerta-registro',
        '<strong>No se pudo registrar al cliente.</strong> El navegador no permitió guardar los datos.',
        'danger');
      setTimeout(function () {
        alert(' El cliente NO fue registrado.\n\nNo se pudo guardar en el navegador ' +
          '(localStorage lleno o bloqueado). Intenta de nuevo.');
      }, 50);
      return;
    }

    /* Primero se limpia el formulario  */
    formulario.reset();
    Object.values(campos).forEach(function (c) {
      c.classList.remove('is-valid', 'is-invalid');
    });

    /* y después se muestra el mensaje de éxito en pantalla */
    mostrarAlerta('alerta-registro',
      '<strong>¡Registro exitoso!</strong> Gracias, ' + escaparHTML(cliente.nombre) +
      '. Tu interés en <strong>' + escaparHTML(cliente.destino) + '</strong> quedó guardado. ' +
      '<a href="clientes.html" class="alert-link">Ver lista de clientes</a>.',
      'success');

    /* Alerta emergente: el cliente SÍ se registró */
    const resumen = ' ¡Cliente registrado correctamente!\n\n' +
      'Nombre: ' + cliente.nombre + '\n' +
      'Destino: ' + cliente.destino + '\n' +
      'Personas: ' + cliente.personas + '\n' +
      'Fecha: ' + formatearFecha(cliente.fecha);

    /* setTimeout para que el mensaje en pantalla se dibuje antes de bloquear con alert() */
    setTimeout(function () { alert(resumen); }, 50);
  });

  /* Al limpiar el formulario también se limpian los estados de validación */
  formulario.addEventListener('reset', function () {
    Object.values(campos).forEach(function (c) {
      c.classList.remove('is-valid', 'is-invalid');
    });
    document.getElementById('alerta-registro').innerHTML = '';
  });
});
