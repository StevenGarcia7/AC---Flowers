/* =========================================================
   PREGUNTA.JS 
   ========================================================= */

const CLAVE_RESPUESTAS = 'flores-amarillas:respuestas';

document.addEventListener('DOMContentLoaded', () => {
  const florSola = document.querySelector('#flor-sola');
  const frase1 = document.querySelector('#frase-1');
  const frase2 = document.querySelector('#frase-2');
  const frase3 = document.querySelector('#frase-3');
  const frase4 = document.querySelector('#frase-4');
  const boton = document.querySelector('#boton-continuar');
  const celebracion = document.querySelector('#celebracion');

  if (!frase1) return;

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  iniciarSecuencia();

  if (boton) {
    boton.addEventListener('click', () => {
      let actual = {};
      try {
        actual = JSON.parse(localStorage.getItem(CLAVE_RESPUESTAS) || '{}');
      } catch (e) {}
      actual.pregunta = 'Quiere seguir escribiendo nuestra historia';
      actual.fecha = new Date().toISOString();
      localStorage.setItem(CLAVE_RESPUESTAS, JSON.stringify(actual));
      lanzarConfeti();
    });
  }

  async function iniciarSecuencia() {
    const lienzo = document.querySelector('.lienzo-estrellas');
    if (lienzo) {
      lienzo.style.transition = 'opacity 3s ease';
      lienzo.style.opacity = '0.4';
    }

    await esperar(400);
    if (florSola) florSola.classList.add('es-visible');
    await esperar(1200);
    if (frase1) frase1.classList.add('es-visible');
    await esperar(1800);
    if (frase2) frase2.classList.add('es-visible');
    await esperar(2000);
    if (frase3) frase3.classList.add('es-visible');
    await esperar(2400);
    if (frase4) frase4.classList.add('es-visible');
    await esperar(1600);

    if (boton) {
      boton.style.opacity = '1';
      boton.style.pointerEvents = 'auto';
    }
  }

  function esperar(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function lanzarConfeti() {
    if (prefiereMenosMovimiento) return;
    const capa = celebracion || document.body;
    const emojis = ['🌻', '❤️', '✨', '⭐', '💚', '💛'];
    const colores = ['#f2c744', '#4a9c6d', '#d4af37', '#e8a4c0', '#7ec8a3'];

    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const p = document.createElement('span');
        p.className = 'confeti-item';
        if (Math.random() > 0.4) {
          p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          p.style.fontSize = (1 + Math.random()) + 'rem';
        } else {
          p.style.width = (6 + Math.random() * 8) + 'px';
          p.style.height = (8 + Math.random() * 10) + 'px';
          p.style.background = colores[Math.floor(Math.random() * colores.length)];
          p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        }
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (3.5 + Math.random() * 3) + 's';
        p.style.setProperty('--giro-inicial', Math.random() * 360 + 'deg');
        capa.appendChild(p);
        setTimeout(() => p.remove(), 7000);
      }, i * 40);
    }
  }
});
