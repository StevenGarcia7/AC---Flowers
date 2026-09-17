/* =========================================================
 
   --------------------------------------------------------- */
window.FloresAmarillas = window.FloresAmarillas || {};

/* Clave usada en localStorage para guardar si la fecha
   secreta ya fue descubierta. La usan también desbloqueo.js
   y las páginas internas (para saber si pueden mostrarse). */
window.FloresAmarillas.CLAVE_DESBLOQUEO = 'flores-amarillas:desbloqueado';

document.addEventListener('DOMContentLoaded', () => {
  iniciarGalaxia();
  crearParticulasDoradas();
  iniciarMenu();
  aplicarEstadoDeBloqueo();
  iniciarRevelado();
  iniciarReproductor();
});

/* ===========================================================
   1. FONDO DE GALAXIA
   =========================================================== */
function iniciarGalaxia() {
  const lienzo = document.querySelector('.lienzo-estrellas');
  if (!lienzo) return; // esta página no tiene fondo de galaxia

  const contexto = lienzo.getContext('2d');
  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let estrellas = [];
  let ancho = 0;
  let alto = 0;

  function ajustarTamano() {
    ancho = lienzo.width = window.innerWidth;
    alto = lienzo.height = window.innerHeight;
    generarEstrellas();
  }

  function generarEstrellas() {
    // Densidad moderada: una estrella cada ~7000px² aprox.
    const cantidad = Math.floor((ancho * alto) / 7000);
    estrellas = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      radio: Math.random() * 1.1 + 0.2,
      fase: Math.random() * Math.PI * 2,
      velocidad: 0.4 + Math.random() * 0.8
    }));
  }

  function dibujar(tiempo) {
    contexto.clearRect(0, 0, ancho, alto);
    contexto.fillStyle = '#f5efe0';

    for (const estrella of estrellas) {
      const brillo = prefiereMenosMovimiento
        ? 0.6
        : 0.35 + 0.5 * Math.abs(Math.sin(estrella.fase + tiempo * 0.0006 * estrella.velocidad));

      contexto.globalAlpha = brillo;
      contexto.beginPath();
      contexto.arc(estrella.x, estrella.y, estrella.radio, 0, Math.PI * 2);
      contexto.fill();
    }

    contexto.globalAlpha = 1;

    if (!prefiereMenosMovimiento) {
      requestAnimationFrame(dibujar);
    }
  }

  ajustarTamano();
  window.addEventListener('resize', ajustarTamano);
  requestAnimationFrame(dibujar);
}

/* ===========================================================
   2. PARTÍCULAS DORADAS 
   =========================================================== */
function crearParticulasDoradas() {
  const yaExisten = document.querySelector('.particula');
  if (yaExisten) return; // evita duplicar si el script corre dos veces

  const contenedor = document.body;
  const cantidad = window.innerWidth < 640 ? 8 : 16;

  for (let i = 0; i < cantidad; i++) {
    const particula = document.createElement('span');
    particula.className = 'particula' + (i % 3 === 0 ? ' particula--verde' : '');
    particula.style.left = `${Math.random() * 100}vw`;
    particula.style.bottom = `${Math.random() * 40}vh`;
    particula.style.animationDelay = `${Math.random() * 10}s`;
    contenedor.appendChild(particula);
  }
}

/* ===========================================================
   3. MENÚ DE NAVEGACIÓN
   =========================================================== */
function iniciarMenu() {
  const nav = document.querySelector('.nav');
  const boton = document.querySelector('.nav__hamburguesa');
  const enlaces = document.querySelectorAll('.nav__enlace');

  if (boton && nav) {
    boton.addEventListener('click', () => {
      const abierto = nav.classList.toggle('nav--abierto');
      boton.setAttribute('aria-expanded', String(abierto));
    });
  }

  // Cerrar el menú al elegir una sección (mejora la experiencia en móvil)
  enlaces.forEach((enlace) => {
    enlace.addEventListener('click', () => {
      if (nav) nav.classList.remove('nav--abierto');
    });
  });
}

/*  */
function aplicarEstadoDeBloqueo() {
  const desbloqueado = localStorage.getItem(window.FloresAmarillas.CLAVE_DESBLOQUEO) === 'true';
  const enlaces = document.querySelectorAll('[data-requiere-desbloqueo]');

  enlaces.forEach((enlace) => {
    const candadoExistente = enlace.querySelector('.nav__candado');

    if (desbloqueado) {
      enlace.classList.remove('nav__enlace--bloqueado');
      enlace.removeAttribute('aria-disabled');
      if (candadoExistente) candadoExistente.remove();
    } else {
      enlace.classList.add('nav__enlace--bloqueado');
      enlace.setAttribute('aria-disabled', 'true');
      if (!candadoExistente) {
        const candado = document.createElement('span');
        candado.className = 'nav__candado';
        candado.textContent = '🔒';
        enlace.appendChild(candado);
      }
    }
  });

 
  const estaEnPaginaInterna = window.location.pathname.includes('/paginas/');
  const esPaginaDeRespuesta = window.location.pathname.includes('respuesta.html');
  if (estaEnPaginaInterna && !desbloqueado && !esPaginaDeRespuesta) {
    window.location.href = obtenerRutaInicio();
  }
}

function obtenerRutaInicio() {
  return window.location.pathname.includes('/paginas/') ? '../index.html' : 'index.html';
}

/* ===========================================================
   4. REVELADO DE FRASES AL HACER SCROLL */
function iniciarRevelado() {
  const frases = document.querySelectorAll('.frase');
  if (!frases.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('es-visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  frases.forEach((frase) => observador.observe(frase));
}

/* ===========================================================
   5. REPRODUCTOR DE MÚSICA
 */
function iniciarReproductor() {
  const audio = document.querySelector('#audio-musica');
  const boton = document.querySelector('.reproductor__boton');
  const volumen = document.querySelector('.reproductor__volumen');

  if (!audio || !boton) return; // esta página no tiene reproductor

  boton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // El navegador bloqueó la reproducción; no pasa nada,
        // la persona puede intentar de nuevo con el botón.
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => (boton.textContent = '❚❚'));
  audio.addEventListener('pause', () => (boton.textContent = '▶'));

  if (volumen) {
    audio.volume = Number(volumen.value);
    volumen.addEventListener('input', () => {
      audio.volume = Number(volumen.value);
    });
  }
}

/* ===========================================================
   6. UTILIDAD COMPARTIDA: EFECTO MÁQUINA DE ESCRIBIR
   
   =========================================================== */
window.FloresAmarillas.escribirTexto = function (elemento, texto, velocidadMs = 45) {
  if (!elemento) return Promise.resolve();

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefiereMenosMovimiento) {
    elemento.textContent = texto;
    return Promise.resolve();
  }

  elemento.textContent = '';
  let indice = 0;

  return new Promise((resolver) => {
    function escribirSiguienteLetra() {
      elemento.textContent += texto.charAt(indice);
      indice++;

      if (indice < texto.length) {
        setTimeout(escribirSiguienteLetra, velocidadMs);
      } else {
        resolver();
      }
    }
    escribirSiguienteLetra();
  });
};
