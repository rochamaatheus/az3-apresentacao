const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }
toggle.addEventListener('click', () => { const expanded = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(expanded)); navigation.classList.toggle('open', expanded); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
document.querySelector('#contact-preview').addEventListener('click', () => { document.querySelector('#contact-note').hidden = false; });

const parts = {
  flange: { title: 'Flange', text: 'Furos, diâmetros e superfícies que precisam se encontrar no conjunto.' },
  eixo: { title: 'Eixo', text: 'Uma peça cilíndrica com diferentes diâmetros, apoios e encaixes ao longo do corpo.' },
  bloco: { title: 'Bloco usinado', text: 'Faces, furos e cavidades que dão ao material a forma prevista no projeto.' }
};
const description = document.querySelector('#part-description');
document.querySelectorAll('[data-part]').forEach(button => {
  button.addEventListener('click', () => {
    const part = parts[button.dataset.part];
    document.querySelectorAll('[data-part]').forEach(point => {
      point.setAttribute('aria-pressed', String(point === button));
      point.querySelector('span').textContent = point === button ? '✓' : '+';
    });
    description.querySelector('h3').textContent = part.title;
    description.querySelector('p').textContent = part.text;
  });
});

const stepPaths = [
  'M9 9h30v23H24l-9 7v-7H9Z M16 17h16m-16 7h10',
  'M10 6h20l8 8v28H10Z M30 6v10h8 M17 24h14m-14 7h9 M6 10H3v32h3',
  'M10 12h28v28H10Z M18 12V7h12v5 M17 25l5 5 10-12',
  'm8 15 16-8 16 8-16 8Z M8 15v21l16 8 16-8V15 M24 23v21 M16 11l16 8v9'
];
document.querySelectorAll('.steps li').forEach((step, index) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('step-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', stepPaths[index]);
  svg.append(path);
  step.prepend(svg);
});
