const selector = document.getElementById('selector-idioma');

selector?.addEventListener('change', (e) => {
  const idiomaSeleccionado = e.target.value;

  const diccionario = translations[idiomaSeleccionado];

  document.querySelectorAll('[data-i18n]').forEach((elemento) => {
    const clave = elemento.getAttribute('data-i18n');

    if (clave && diccionario[clave]) {
      elemento.textContent = diccionario[clave];
    }
  });
});

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
});

const elementosOcultos = document.querySelectorAll('.anima-scroll');

elementosOcultos.forEach((elemento) => {
  observador.observe(elemento);
});