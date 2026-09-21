const nav = document.querySelector('#nav2');
const menu = document.querySelector('.menu-toggle');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const video = document.querySelector('#hero-film');
const videoButton = document.querySelector('#film-toggle');
const videoMessage = document.querySelector('#film-message');
let wantsVideo = !reducedMotion.matches && !navigator.connection?.saveData;
let videoVisible = false;
function updateVideoButton() { const playing = !video.paused && !video.ended; videoButton.textContent = playing ? 'Pausar vídeo' : 'Reproduzir vídeo'; videoButton.setAttribute('aria-pressed', String(playing)); }
async function syncVideo() {
  if (!wantsVideo || !videoVisible || document.hidden) { video.pause(); return; }
  const source = video.querySelector('source');
  if (!source.getAttribute('src')) { source.src = source.dataset.src; video.muted = true; video.load(); }
  try { await video.play(); videoMessage.hidden = true; }
  catch (error) { if (error.name !== 'AbortError') { wantsVideo = false; updateVideoButton(); } }
}
videoButton.addEventListener('click', () => { wantsVideo = video.paused; syncVideo(); });
video.addEventListener('play', updateVideoButton);
video.addEventListener('pause', updateVideoButton);
function videoFailed() { videoMessage.textContent = 'O vídeo não carregou. A imagem mantém a referência visual do processo.'; videoMessage.hidden = false; wantsVideo = false; updateVideoButton(); }
video.addEventListener('error', videoFailed);
video.querySelector('source').addEventListener('error', videoFailed);
new IntersectionObserver(entries => { videoVisible = entries[0].isIntersecting; syncVideo(); }, { threshold: .12 }).observe(video);
document.addEventListener('visibilitychange', syncVideo);
reducedMotion.addEventListener('change', event => { if (event.matches) { wantsVideo = false; syncVideo(); } });

function select(group, selected) { group.forEach(button => button.setAttribute('aria-pressed', String(button === selected))); }
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => { select(filters, button); let count = 0; document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category; if (!card.hidden) count++; }); document.querySelector('#results-count').textContent = `${count} ${count === 1 ? 'exemplo exibido' : 'exemplos exibidos'}`; }));
const briefs = { drawing: ['Separe o desenho e as especificações.', 'Material, quantidade e aplicação ajudam na primeira avaliação.'], replacement: ['Mostre a peça e conte onde ela trabalha.', 'Fotos, medidas disponíveis e contexto da manutenção ajudam a explicar a necessidade.'], batch: ['Comece pela quantidade e pela aplicação.', 'Informe as especificações, a frequência desejada e o prazo que precisa avaliar.'] };
document.querySelector('#project-type').addEventListener('change', event => { const [title, text] = briefs[event.target.value]; document.querySelector('#brief-guidance h3').textContent = title; document.querySelector('#brief-guidance p').textContent = text; });
document.querySelector('#project-contact').addEventListener('click', () => { document.querySelector('#contact-status').hidden = false; });

const stories = [...document.querySelectorAll('.scroll-story')].map(element => ({
  element,
  visual: element.querySelector('.story-visual'),
  steps: [...element.querySelectorAll('.story-step')],
  frames: [...element.querySelectorAll('.story-frame')],
  label: element.querySelector('.story-label'),
  counter: element.querySelector('.story-count'),
  progress: element.querySelector('.story-progress span'),
  index: -1
}));
const storyMode = matchMedia('(min-height: 650px) and (prefers-reduced-motion: no-preference)');
let queuedFrame = false;
let headerHeight = 88;
function updateStories() {
  queuedFrame = false;
  if (!storyMode.matches) return;
  const mobile = innerWidth <= 760;
  for (const story of stories) {
    const bounds = story.element.getBoundingClientRect();
    if (bounds.bottom < headerHeight || bounds.top > innerHeight) continue;
    const visualHeight = story.visual.getBoundingClientRect().height;
    const readingLine = mobile ? headerHeight + visualHeight + (innerHeight - headerHeight - visualHeight) * .32 : innerHeight * .5;
    let index = 0;
    story.steps.forEach((step, i) => { if (step.getBoundingClientRect().top <= readingLine) index = i; });
    if (index === story.index) continue;
    story.index = index;
    story.steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    story.frames.forEach((frame, i) => frame.classList.toggle('is-current', i === index));
    story.label.textContent = story.steps[index].dataset.label;
    story.counter.textContent = `${index + 1} / ${story.steps.length}`;
    story.progress.style.transform = `scaleX(${(index + 1) / story.steps.length})`;
  }
}
function queueStories() {
  if (!queuedFrame) { queuedFrame = true; requestAnimationFrame(updateStories); }
}
function configureStories() {
  document.documentElement.classList.toggle('scroll-enhanced', storyMode.matches);
  queueStories();
}
new ResizeObserver(entries => {
  headerHeight = entries[0].target.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  queueStories();
}).observe(document.querySelector('.topbar'));
addEventListener('scroll', queueStories, { passive: true });
addEventListener('resize', queueStories, { passive: true });
addEventListener('pageshow', queueStories);
storyMode.addEventListener('change', configureStories);
configureStories();
