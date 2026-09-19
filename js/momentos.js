/* =========================================================
   MOMENTOS.JS
      ========================================================= */

const MOMENTOS = [
  {
    fecha: '10 AGO 2026',
    hora: '9:02 PM',
    titulo: 'Primer mensaje',
    detalle: 'Qué bonita coincidencia que aquel día termináramos en la misma llamada por unas tareas de la universidad. Sin saberlo, ese pequeño momento sería el comienzo de algo que hoy significa mucho para mí.'
  },
  {
    fecha: '',
    hora: '',
    titulo: 'Primera conversación',
    detalle: 'Recuerdo esa primera conversación y lo nervioso que estaba. Pero recibir tu primer mensaje me alegró demasiado. Desde ese momento sentí una emoción muy bonita y unas ganas enormes de seguir conociéndote.'
  },
  {
    fecha: '',
    hora: '',
    titulo: 'Nuestra primera salida',
    detalle: 'Me gusta recordar mucho ese día. Estaba nervioso por conocerte en persona y sobre todo por no querer hacer algo mal con usted. A pesar de los nervios, fue un momento muy especial para mí y uno de esos recuerdos que quiero guardar siempre.'
  },
  {
    fecha: '',
    hora: '',
    titulo: 'Primer día de Base de Datos 2',
    detalle: 'Recuerdo el primer día de clases de Base de Datos 2. Estuve muy alegre de poder estar junto a usted y, especialmente, de poder estar agarrado de su mano. Para mí fue un momento sencillo, pero muy especial.'
  },
  {
    fecha: '',
    hora: '',
    titulo: 'HOY',
    esHoy: true,
    detalle: 'Hoy agradezco poder seguir conversando con usted y me alegra muchísimo poder seguir conociéndola. Me gusta todo lo que hemos ido construyendo poco a poco y espero poder seguir compartiendo muchos momentos más a su lado.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const contenedorTimeline = document.querySelector('#timeline');
  if (!contenedorTimeline) return;

  const modal = document.querySelector('#modal-momento');
  const modalFecha = modal.querySelector('#modal-fecha');
  const modalTitulo = modal.querySelector('#modal-titulo');
  const modalDetalle = modal.querySelector('#modal-detalle');
  const botonCerrarModal = modal.querySelector('.modal__cerrar');

  renderizarTimeline();
  observarAparicionDeMomentos();

  botonCerrarModal.addEventListener('click', cerrarModal);
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) cerrarModal();
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarModal();
  });

  function renderizarTimeline() {
    MOMENTOS.forEach((momento, indice) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'timeline__item' + (momento.esHoy ? ' timeline__item--hoy' : '');
      item.style.transitionDelay = `${indice * 90}ms`;

      const puntito = document.createElement('span');
      puntito.className = 'timeline__punto';
      item.appendChild(puntito);

      if (momento.fecha || momento.hora) {
        const fecha = document.createElement('span');
        fecha.className = 'timeline__fecha';
        fecha.textContent = [momento.fecha, momento.hora].filter(Boolean).join(' · ');
        item.appendChild(fecha);
      }

      const titulo = document.createElement('span');
      titulo.className = 'timeline__titulo';
      titulo.textContent = momento.titulo;
      item.appendChild(titulo);

      const pista = document.createElement('span');
      pista.className = 'timeline__pista';
      pista.textContent = 'Toca para ver más';
      item.appendChild(pista);

      item.addEventListener('click', () => abrirModal(momento));

      contenedorTimeline.appendChild(item);
    });
  }

  function observarAparicionDeMomentos() {
    const items = document.querySelectorAll('.timeline__item');
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('es-visible');
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    items.forEach((item) => observador.observe(item));
  }

  function abrirModal(momento) {
    modalFecha.textContent = [momento.fecha, momento.hora].filter(Boolean).join(' · ');
    modalFecha.hidden = !modalFecha.textContent;
    modalTitulo.textContent = momento.titulo;
    modalDetalle.textContent = momento.detalle;
    modal.classList.add('es-abierto');
    botonCerrarModal.focus();
  }

  function cerrarModal() {
    modal.classList.remove('es-abierto');
  }
});
