/* =========================================================
   CITA.JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const opciones = document.querySelectorAll('.opcion-cita');
  const tarjeta = document.querySelector('#tarjeta-cita');
  const tarjetaPlan = document.querySelector('#tarjeta-cita-plan');
  const botonCambiar = document.querySelector('#boton-cambiar-plan');
  const contenedorOpciones = document.querySelector('#opciones-cita');

  if (!opciones.length || !tarjeta) return;

  opciones.forEach((opcion) => {
    opcion.addEventListener('click', () => {
      opciones.forEach((otra) => otra.classList.remove('es-seleccionada'));
      opcion.classList.add('es-seleccionada');

      const textoPlan = opcion.textContent.trim();
      tarjetaPlan.textContent = `Plan: ${textoPlan}`;

      tarjeta.classList.add('es-visible');
      tarjeta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  if (botonCambiar) {
    botonCambiar.addEventListener('click', () => {
      tarjeta.classList.remove('es-visible');
      opciones.forEach((opcion) => opcion.classList.remove('es-seleccionada'));
      if (contenedorOpciones) {
        contenedorOpciones.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
