// ===== Variables =====
let idioma = localStorage.getItem('idioma') || 'es';
let textos = {}; // es.json / en.json / ca.json
let proyectos = []; // projects.json
let stack = []; // labelsLanguage.json

// ===== Leer un JSON =====
async function leerJSON(ruta) {
  const respuesta = await fetch(ruta);
  return await respuesta.json();
}

// ===== Pintar los iconos de tecnologías =====
function crearBadges(tecnologias) {
  let html = '<div class="badges">';
  tecnologias.forEach((tec) => {
    html += `<img src="${tec.badge}" alt="${tec.nombre}" title="${tec.nombre}" />`;
  });
  return html + '</div>';
}

// ===== Textos de la página =====
function pintarTextos() {
  document.documentElement.lang = idioma;
  document.querySelectorAll('[data-idioma]').forEach((elemento) => {
    elemento.textContent = textos[elemento.dataset.idioma];
  });
}

// ===== Proyectos en la página de inicio =====
function pintarInicio() {
  const lista = document.getElementById('inicio-proyectos');
  if (!lista) return;

  lista.innerHTML = '';
  proyectos.slice(0, 3).forEach((p) => {
    lista.innerHTML += `
      <div class="tarjeta">
        <h3>${p.nombre}</h3>
        ${crearBadges(p.tecnologias)}
      </div>`;
  });
}

// ===== Opciones del filtro (una por tecnología) =====
function pintarFiltro() {
  const filtro = document.getElementById('filtro');
  if (!filtro) return;

  const nombres = [];
  proyectos.forEach((p) => {
    p.tecnologias.forEach((tec) => {
      if (!nombres.includes(tec.nombre)) nombres.push(tec.nombre);
    });
  });

  nombres.forEach((nombre) => {
    filtro.innerHTML += `<option value="${nombre}">${nombre}</option>`;
  });
}

// ===== Proyectos en la página de proyectos =====
function pintarProyectos() {
  const lista = document.getElementById('proyectos-lista');
  if (!lista) return;

  const filtro = document.getElementById('filtro').value;
  const visibles = proyectos.filter(p =>
    filtro === 'todos' || p.tecnologias.some(tec => tec.nombre === filtro)
  );
  const grupos = ['grupo_web', 'grupo_android', 'grupo_juegos', 'grupo_ejercicios'];
  lista.innerHTML = grupos.map(grupo => {
    const miembros = visibles.filter(p => p.grupo === grupo);
    if (!miembros.length) return '';
    const filas = miembros.map(p => `
      <article class="fila-proyecto">
        <div>
          <h3>${p.nombre}</h3>
          <p>${textos[p.descripcionKey]}</p>
        </div>
        ${crearBadges(p.tecnologias)}
        <a class="codigo" href="${p.githubUrl}" target="_blank" rel="noopener noreferrer"
           aria-label="${p.nombre} · ${textos.proyecto_btn_github}">GitHub <span aria-hidden="true">↗</span></a>
      </article>`).join('');
    return `<section class="grupo-proyectos"><h2>${textos[grupo]}</h2><div class="filas">${filas}</div></section>`;
  }).join('');
  document.getElementById('proyectos-vacio').hidden = visibles.length > 0;
}

// ===== Tecnologías en "Sobre mí" =====
function pintarStack() {
  const lista = document.getElementById('stack-lista');
  if (!lista) return;

  lista.innerHTML = '';
  stack.forEach((categoria) => {
    lista.innerHTML += `
      <div class="tarjeta">
        <h3>${textos[categoria.categoriaKey]}</h3>
        ${crearBadges(categoria.tecnologias)}
      </div>`;
  });
}

// ===== Pintar todo =====
function pintarTodo() {
  pintarTextos();
  pintarInicio();
  pintarProyectos();
  pintarStack();
}

// ===== Arranque =====
async function iniciar() {
  textos = await leerJSON(`/data/${idioma}.json`);
  proyectos = await leerJSON('/data/projects.json');
  stack = await leerJSON('/data/labelsLanguage.json');

  document.getElementById('idioma').value = idioma;

  // Marcar la página actual en el menú
  const ruta = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.menu a').forEach((enlace) => {
    if (enlace.getAttribute('href') === ruta) enlace.classList.add('activo');
  });

  pintarFiltro();
  pintarTodo();

  // Cambiar de idioma
  document.getElementById('idioma').addEventListener('change', async (e) => {
    idioma = e.target.value;
    localStorage.setItem('idioma', idioma);
    textos = await leerJSON(`/data/${idioma}.json`);
    pintarTodo();
  });

  // Cambiar el filtro
  const filtro = document.getElementById('filtro');
  if (filtro) filtro.addEventListener('change', pintarProyectos);
}

iniciar();
