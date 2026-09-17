/* =========================================================
   DESBLOQUEO.JS
   ========================================================= */

const DIA_SECRETO = 10;
const MES_SECRETO = 8; // agosto
const ANIO_SECRETO = 2026;

// Mensajes de combinación es incorrecta.

const MENSAJES_INCORRECTOS = [
  'Mmm... no. Pero me gusta que lo esté intentando.',
  'Casi. O tal vez no tan casi. Sigue pensando ✨',
  'Nuestras memorias no coinciden todavía... inténtalo de nuevo.'
];

document.addEventListener('DOMContentLoaded', () => {
  const seccion = document.querySelector('#desbloqueo');
  if (!seccion) return; // esta página no tiene sistema de desbloqueo

  // Si esta desbloqueado en una visita anterior, saltamos
    /* const yaDesbloqueado = localStorage.getItem(window.FloresAmarillas.CLAVE_DESBLOQUEO) === 'true';
  if (yaDesbloqueado) {
    mostrarEstadoDesbloqueado(seccion);
    return;
  } */

    
  construirSelectorDeFecha(seccion);
});

/* -----------------------------------------------------------
  ----------------------------------------------------------- */
function construirSelectorDeFecha(seccion) {
  const contenedorDias = seccion.querySelector('#opciones-dia');
  const contenedorMeses = seccion.querySelector('#opciones-mes');
  const contenedorAnios = seccion.querySelector('#opciones-anio');
  const botonDesbloquear = seccion.querySelector('#boton-desbloquear');
  const mensaje = seccion.querySelector('#mensaje-desbloqueo');

  const seleccion = { dia: null, mes: null, anio: null };
  let intentosFallidos = 0;

  // --- Días 1 a 31 ---
  for (let dia = 1; dia <= 31; dia++) {
    contenedorDias.appendChild(
      crearBotonDeFecha(dia, () => seleccionar('dia', dia, contenedorDias))
    );
  }

  // --- Meses 1 a 12 ---
  for (let mes = 1; mes <= 12; mes++) {
    contenedorMeses.appendChild(
      crearBotonDeFecha(mes, () => seleccionar('mes', mes, contenedorMeses))
    );
  }

  // --- Años (ajusta este rango si lo necesitas) ---
  [2024, 2025, 2026].forEach((anio) => {
    contenedorAnios.appendChild(
      crearBotonDeFecha(anio, () => seleccionar('anio', anio, contenedorAnios))
    );
  });

  function seleccionar(campo, valor, contenedor) {
    seleccion[campo] = valor;
    contenedor.querySelectorAll('.selector-fecha__boton').forEach((boton) => {
      boton.classList.toggle('es-seleccionado', Number(boton.textContent) === valor);
    });
    mensaje.textContent = '';
  }

  botonDesbloquear.addEventListener('click', () => {
    if (seleccion.dia === null || seleccion.mes === null || seleccion.anio === null) {
      mensaje.textContent = 'Elige un día, un mes y un año antes de continuar.';
      mensaje.classList.remove('es-exito');
      return;
    }

    const esCorrecta =
      seleccion.dia === DIA_SECRETO &&
      seleccion.mes === MES_SECRETO &&
      seleccion.anio === ANIO_SECRETO;

    if (esCorrecta) {
      localStorage.setItem(window.FloresAmarillas.CLAVE_DESBLOQUEO, 'true');
      reproducirDestello();
      mensaje.classList.add('es-exito');
      mensaje.textContent = '🔓 La recordabas. Un momento...';
      setTimeout(() => mostrarEstadoDesbloqueado(seccion), 900);
    } else {
      mensaje.classList.remove('es-exito');
      mensaje.textContent = MENSAJES_INCORRECTOS[intentosFallidos % MENSAJES_INCORRECTOS.length];
      intentosFallidos++;
    }
  });
}

function crearBotonDeFecha(valor, alHacerClic) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'selector-fecha__boton';
  boton.textContent = String(valor).padStart(valor < 100 ? 2 : 4, '0');
  boton.addEventListener('click', alHacerClic);
  return boton;
}

/* -----------------------------------------------------------
    destello dorado a pantalla si es desbloqueado
   ----------------------------------------------------------- */
function reproducirDestello() {
  let destello = document.querySelector('.destello');
  if (!destello) {
    destello = document.createElement('div');
    destello.className = 'destello';
    document.body.appendChild(destello);
  }
  destello.classList.remove('es-activo');
  // Forzar reflow para poder reiniciar la animación si ya se usó antes
  void destello.offsetWidth;
  destello.classList.add('es-activo');
}

/* Reemplaza el selector de fecha por "desbloqueado" */

function mostrarEstadoDesbloqueado(seccion) {
  seccion.innerHTML = `
    <div class="seccion__contenido">
      <p class="frase es-visible">Lo recordabas. <span class="frase--enfasis">Bienvenida.</span></p>
      <p class="frase--pequena">El resto de esta pequeña historia ya está disponible para ti.</p>
      <a class="boton" href="paginas/comienzo.html">CONTINUAR</a>
    </div>
  `;

  if (typeof aplicarEstadoDeBloqueo === 'function') {
    aplicarEstadoDeBloqueo();
  }
}
