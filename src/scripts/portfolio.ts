import es from '../data/es.json';
import en from '../data/en.json';
import ca from '../data/ca.json';

const idiomas: Record<string, Record<string, string>> = { es, en, ca };
const selector = document.querySelector<HTMLSelectElement>('#idioma')!;

function traducir(idioma: string) {
  if (!Object.hasOwn(idiomas, idioma)) return;
  const textos = idiomas[idioma];
  document.documentElement.lang = idioma;
  selector.value = idioma;
  selector.setAttribute('aria-label', textos.idioma_label);
  document.querySelectorAll<HTMLElement>('[data-idioma]').forEach(el => {
    el.textContent = textos[el.dataset.idioma!];
  });
}

try { traducir(localStorage.getItem('idioma') || 'es'); } catch { /* El español ya se sirve en el HTML. */ }
selector.addEventListener('change', () => {
  traducir(selector.value);
  try { localStorage.setItem('idioma', selector.value); } catch { /* El idioma se aplica también sin almacenamiento. */ }
});

const filtro = document.querySelector<HTMLSelectElement>('#filtro');
filtro?.addEventListener('change', () => {
  document.querySelectorAll<HTMLElement>('.grupo-proyectos').forEach(grupo => {
    let visibles = 0;
    grupo.querySelectorAll<HTMLElement>('[data-tecnologias]').forEach(fila => {
      const tecnologias: string[] = JSON.parse(fila.dataset.tecnologias!);
      fila.hidden = Boolean(filtro.value && !tecnologias.includes(filtro.value));
      if (!fila.hidden) visibles++;
    });
    grupo.hidden = visibles === 0;
  });
});
