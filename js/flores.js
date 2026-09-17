/* =========================================================
   FLORES.JS 
   ========================================================= */

const FLORES = [
  {
    titulo: 'Por tu forma de escuchar',
    descripcion: 'Hay algo especial en cómo me prestas atención. Siento que de verdad te importa lo que digo, y eso no es fácil de encontrar.'
  },
  {
    titulo: 'Por tu sonrisa',
    descripcion: 'Tu sonrisa tiene el poder de cambiarme el día. Aunque estemos a distancia, solo imaginarla ya me hace sentir más ligero.'
  },
  {
    titulo: 'Por tu paciencia',
    descripcion: 'Gracias por tener paciencia conmigo. Por esperar, por entender y por no presionar. Eso dice mucho de la persona que eres.'
  },
  {
    titulo: 'Por hacerme mejor persona',
    descripcion: 'Desde que te conocí descubrí una versión de mí más romántica, más atenta. Quiero seguir creciendo gracias a lo que me inspiras.'
  },
  {
    titulo: 'Por estar, aunque sea a la distancia',
    descripcion: 'No necesitas estar físicamente cerca para que yo sienta tu presencia. El hecho de que estés ahí, del otro lado, ya significa mucho.'
  },
  {
    titulo: 'Por ser tú',
    descripcion: 'Simplemente por ser quien eres. Por tus gustos, tu forma de ver las cosas, tu energía. Esta flor es solo por ti, sin más motivo.'
  }
];

const POSICIONES_RAMO = [
  { x: 70,  y: 155, d: 'M160,325 C120,260 85,205 70,155' },
  { x: 112, y: 100, d: 'M160,325 C135,245 118,165 112,100' },
  { x: 160, y: 68,  d: 'M160,325 C160,245 160,150 160,68' },
  { x: 208, y: 100, d: 'M160,325 C185,245 202,165 208,100' },
  { x: 250, y: 155, d: 'M160,325 C200,260 235,205 250,155' },
  { x: 160, y: 135, d: 'M160,325 C160,260 160,190 160,135' }
];

const NS = 'http://www.w3.org/2000/svg';

function iniciarCrecimiento() {
  const cont = document.querySelector('#crecimiento');
  const f1 = document.querySelector('#crecimiento-frase-1');
  const f2 = document.querySelector('#crecimiento-frase-2');
  const f3 = document.querySelector('#crecimiento-frase-3');
  const faseCrec = document.querySelector('#fase-crecimiento');
  const faseRamo = document.querySelector('#fase-ramo');

  if (!cont) return Promise.resolve();

  function esperar(ms) { return new Promise(r => setTimeout(r, ms)); }

  return (async () => {
    if (f1) f1.classList.add('es-visible');
    await esperar(1800);
    if (f2) f2.classList.add('es-visible');
    await esperar(1600);
    cont.classList.add('es-raiz');
    await esperar(900);
    cont.classList.add('es-tallo');
    await esperar(1400);
    cont.classList.add('es-hojas');
    await esperar(900);
    cont.classList.add('es-flor');
    await esperar(1100);
    if (f3) {
      f3.style.opacity = '1';
      f3.style.transition = 'opacity 900ms ease';
    }
    await esperar(2000);

    if (faseCrec) {
      faseCrec.style.transition = 'opacity 700ms ease';
      faseCrec.style.opacity = '0';
    }
    await esperar(750);
    if (faseCrec) faseCrec.style.display = 'none';
    if (faseRamo) {
      faseRamo.style.opacity = '1';
      faseRamo.style.pointerEvents = 'auto';
    }
  })();
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[flores.js] cargado correctamente'); // ← si no ves esto en la consola (F12), el navegador no está usando este archivo

  await iniciarCrecimiento();

  const svgRamo = document.querySelector('#ramo');
  if (!svgRamo) {
    console.warn('[flores.js] no se encontró #ramo en el HTML');
    return;
  }

  const capaTallos = document.querySelector('#capa-tallos');
  const capaFlores = document.querySelector('#capa-flores');
  const botonPlantar = document.querySelector('#boton-plantar');
  const contador = document.querySelector('#ramo-contador');
  const mensajeFinal = document.querySelector('#ramo-mensaje-final');
  const modal = document.querySelector('#modal-flor');
  const modalTitulo = modal.querySelector('#modal-flor-titulo');
  const modalDetalle = modal.querySelector('#modal-flor-detalle');
  const botonCerrarModal = modal.querySelector('.modal__cerrar');

  if (!capaTallos || !capaFlores) {
    console.warn('[flores.js] falta #capa-tallos o #capa-flores dentro del <svg id="ramo">');
    return;
  }

  const totalFlores = Math.min(FLORES.length, POSICIONES_RAMO.length);
  let indicePlantado = 0;

  actualizarContador();

  botonPlantar.addEventListener('click', plantarSiguienteFlor);
  botonCerrarModal.addEventListener('click', cerrarModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

  function plantarSiguienteFlor() {
    if (indicePlantado >= totalFlores) return;

    const datosFlor = FLORES[indicePlantado];
    const posicion = POSICIONES_RAMO[indicePlantado];

    // --- Tallo ---
    const tallo = document.createElementNS(NS, 'path');
    tallo.setAttribute('class', 'ramo__tallo');
    tallo.setAttribute('d', posicion.d);
    capaTallos.appendChild(tallo);

    const longitud = tallo.getTotalLength();
    tallo.style.strokeDasharray = String(longitud);
    tallo.style.strokeDashoffset = String(longitud);
    void tallo.getBoundingClientRect();
    tallo.style.strokeDashoffset = '0';

    // --- Flor: aparece YA completa, sin animación de por medio,
    //     para descartar cualquier problema de timing/CSS. ---
    const flor = crearFlorBonita(posicion.x, posicion.y, datosFlor);
    capaFlores.appendChild(flor);
    console.log('[flores.js] flor creada en', posicion.x, posicion.y, '— total nodos en capa-flores:', capaFlores.children.length);

    indicePlantado++;
    actualizarContador();

    if (indicePlantado >= totalFlores) {
      botonPlantar.disabled = true;
      botonPlantar.style.opacity = '0.4';
      setTimeout(mostrarMensajeFinal, 800);
    }
  }

  function crearFlorBonita(x, y, datosFlor) {
    const grupo = document.createElementNS(NS, 'g');
    grupo.setAttribute('transform', `translate(${x}, ${y})`);
    grupo.setAttribute('tabindex', '0');
    grupo.setAttribute('role', 'button');
    grupo.setAttribute('aria-label', datosFlor.titulo);
    grupo.style.cursor = 'pointer';
    grupo.style.filter = 'drop-shadow(0 0 8px rgba(242,199,68,0.55))';

    // 6 pétalos
    const petalos = [
      { cx: 0,   cy: -14, r: 11 },
      { cx: 12,  cy: -6,  r: 10 },
      { cx: 12,  cy: 8,   r: 10 },
      { cx: 0,   cy: 14,  r: 11 },
      { cx: -12, cy: 8,   r: 10 },
      { cx: -12, cy: -6,  r: 10 }
    ];

    petalos.forEach((p) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', String(p.cx));
      c.setAttribute('cy', String(p.cy));
      c.setAttribute('r', String(p.r));
      c.setAttribute('fill', '#f2c744');
      grupo.appendChild(c);
    });

    // Centro
    const centro = document.createElementNS(NS, 'circle');
    centro.setAttribute('cx', '0');
    centro.setAttribute('cy', '0');
    centro.setAttribute('r', '8');
    centro.setAttribute('fill', '#d4a017');
    grupo.appendChild(centro);

    // Brillo
    const brillo = document.createElementNS(NS, 'circle');
    brillo.setAttribute('cx', '-2');
    brillo.setAttribute('cy', '-2');
    brillo.setAttribute('r', '2.8');
    brillo.setAttribute('fill', 'rgba(255,255,255,0.5)');
    grupo.appendChild(brillo);

    function abrir() {
      modalTitulo.textContent = datosFlor.titulo;
      modalDetalle.textContent = datosFlor.descripcion;
      modal.classList.add('es-abierto');
      botonCerrarModal.focus();
    }

    grupo.addEventListener('click', abrir);
    grupo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrir();
      }
    });

    return grupo;
  }

  function actualizarContador() {
    if (contador) contador.textContent = `${indicePlantado} de ${totalFlores} flores plantadas`;
  }

  function mostrarMensajeFinal() {
    if (mensajeFinal) mensajeFinal.classList.add('es-visible');
  }

  function cerrarModal() {
    modal.classList.remove('es-abierto');
  }
});
