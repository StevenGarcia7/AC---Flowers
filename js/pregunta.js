/* =========================================================
   PREGUNTA.JS
   ========================================================= */

const MAX_INTENTOS_EVASION = 5;

document.addEventListener('DOMContentLoaded', () => {
  const frase1 = document.querySelector('#frase-pregunta-1');
  const frase2 = document.querySelector('#frase-pregunta-2');
  const florSola = document.querySelector('#flor-sola');
  const bloquePregunta = document.querySelector('#bloque-pregunta');
  const zona = document.querySelector('#zona-pregunta');
  const botonSi = document.querySelector('#boton-si');
  const botonNo = document.querySelector('#boton-no');
  const respuestaNo = document.querySelector('#respuesta-no');
  const respuestaSi = document.querySelector('#respuesta-si');
  const celebracion = document.querySelector('#celebracion');

  if (!bloquePregunta) return;

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let intentosEvasion = prefiereMenosMovimiento ? MAX_INTENTOS_EVASION : 0;

  iniciarSecuencia();

  botonNo.addEventListener('mouseenter', intentarEvadir);
  botonNo.addEventListener('touchstart', (e) => {
    if (intentosEvasion < MAX_INTENTOS_EVASION) {
      e.preventDefault();
      intentarEvadir();
    }
  }, { passive: false });

  botonNo.addEventListener('click', (evento) => {
    if (intentosEvasion < MAX_INTENTOS_EVASION) {
      evento.preventDefault();
      intentarEvadir();
      return;
    }
    seleccionarNo();
  });

  botonSi.addEventListener('click', seleccionarSi);

  async function iniciarSecuencia() {
    // Reducir estrellas 
    const lienzo = document.querySelector('.lienzo-estrellas');
    if (lienzo) lienzo.style.transition = 'opacity 3s ease';
    if (lienzo) lienzo.style.opacity = '0.35';

    await esperar(400);
    if (florSola) florSola.classList.add('es-visible');
    await esperar(1200);
    frase1.classList.add('es-visible');
    await esperar(2000);
    frase2.classList.add('es-visible');
    await esperar(2200);
    bloquePregunta.style.opacity = '1';
  }

  function esperar(ms) {
    return new Promise((resolver) => setTimeout(resolver, ms));
  }

  function intentarEvadir() {
    if (intentosEvasion >= MAX_INTENTOS_EVASION) return;
    moverBotonNo();
    intentosEvasion++;
  }

  function moverBotonNo() {
    const rectZona = zona.getBoundingClientRect();
    const rectBoton = botonNo.getBoundingClientRect();
    const margen = 8;
    const maxX = Math.max(rectZona.width - rectBoton.width - margen, margen);
    const maxY = Math.max(rectZona.height - rectBoton.height - margen, margen);
    const nuevoX = margen + Math.random() * (maxX - margen);
    const nuevoY = margen + Math.random() * (maxY - margen);
    botonNo.style.transform = 'none';
    botonNo.style.left = `${nuevoX}px`;
    botonNo.style.top = `${nuevoY}px`;
  }

  function seleccionarNo() {
    bloquePregunta.style.display = 'none';
    frase1.style.display = 'none';
    frase2.style.display = 'none';
    if (florSola) florSola.style.display = 'none';
    respuestaNo.style.display = 'flex';
  }

  function seleccionarSi() {
    bloquePregunta.style.display = 'none';
    frase1.style.display = 'none';
    frase2.style.display = 'none';
    if (florSola) florSola.style.display = 'none';

    // Restaurar estrellas
    const lienzo = document.querySelector('.lienzo-estrellas');
    if (lienzo) lienzo.style.opacity = '1';

    // Partículas de celebración
    lanzarCelebracion();

    respuestaSi.style.display = 'flex';
  }

  function lanzarCelebracion() {
    if (!celebracion || prefiereMenosMovimiento) return;
    const colores = ['#f2c744', '#4a9c6d', '#d4af37', '#7ec8a3', '#f1d78c'];
    for (let i = 0; i < 48; i++) {
      const p = document.createElement('span');
      p.className = 'celebracion-si__particula';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.background = colores[Math.floor(Math.random() * colores.length)];
      p.style.width = (4 + Math.random() * 6) + 'px';
      p.style.height = p.style.width;
      p.style.opacity = '0';
      p.style.transition = `transform ${1.5 + Math.random()}s ease-out, opacity 1.2s ease`;
      celebracion.appendChild(p);
      requestAnimationFrame(() => {
        p.style.opacity = '0.85';
        p.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0)`;
      });
      setTimeout(() => p.remove(), 2500);
    }
  }
});
