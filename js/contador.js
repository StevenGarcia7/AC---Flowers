/* =========================================================
   
   INICIO DEL CONTEO: 10 de agosto de 2026, 9:02 PM.
   
   ========================================================= */

const INICIO_CONTEO = new Date(2026, 7, 10, 21, 2, 0);

document.addEventListener('DOMContentLoaded', () => {
  const elementoDias = document.querySelector('#contador-dias');
  const elementoHoras = document.querySelector('#contador-horas');
  const elementoMinutos = document.querySelector('#contador-minutos');
  const elementoSegundos = document.querySelector('#contador-segundos');

  if (!elementoDias || !elementoHoras || !elementoMinutos || !elementoSegundos) {
    return; // esta página no tiene contador
  }

  actualizarContador(); // primer cálculo inmediato, sin esperar 1 segundo
  setInterval(actualizarContador, 1000);

  function actualizarContador() {
    const ahora = new Date();
    let diferenciaMs = ahora - INICIO_CONTEO;

    if (diferenciaMs < 0) diferenciaMs = 0;

    const segundoTotal = Math.floor(diferenciaMs / 1000);

    const dias = Math.floor(segundoTotal / 86400);
    const horas = Math.floor((segundoTotal % 86400) / 3600);
    const minutos = Math.floor((segundoTotal % 3600) / 60);
    const segundos = segundoTotal % 60;

    elementoDias.textContent = String(dias);
    elementoHoras.textContent = String(horas).padStart(2, '0');
    elementoMinutos.textContent = String(minutos).padStart(2, '0');
    elementoSegundos.textContent = String(segundos).padStart(2, '0');
  }
});