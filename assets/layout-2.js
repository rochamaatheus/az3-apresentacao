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
function animate(element) { element.classList.remove('swap-in'); void element.getBoundingClientRect(); element.classList.add('swap-in'); }
const stages = [
  { shape: 'stock', label: 'Material de partida', kicker: 'Antes de fabricar', title: 'O ponto de partida é a sua necessidade.', text: 'Aplicação, desenho, material e quantidade ajudam a definir o que será feito. Aqui, um bloco simples representa a matéria-prima.', fact: 'Desenho técnico e aplicação da peça.' },
  { shape: 'milling', label: 'Material sendo usinado', kicker: 'Durante o processo', title: 'A ferramenta revela a forma.', text: 'A remoção de material cria superfícies e cavidades. A operação escolhida depende da geometria e da função previstas no desenho.', fact: 'Forma, dimensões e requisitos do projeto.' },
  { shape: 'block', label: 'A forma ganha uma função', kicker: 'Ao final da operação', title: 'O resultado precisa fazer sentido no conjunto.', text: 'A peça pronta é conferida em relação ao que foi especificado. Furos, faces e encaixes têm uma finalidade na aplicação.', fact: 'Medidas a conferir e aplicação a demonstrar.' }
];
let stageIndex = 0;
const stageButtons = [...document.querySelectorAll('button[data-stage]')];
function showStage(index) {
  stageIndex = index; const stage = stages[index]; select(stageButtons, stageButtons[index]);
  document.querySelector('#stage-label').textContent = stage.label;
  document.querySelector('#stage-counter').textContent = `${index + 1} / 3`;
  document.querySelector('#stage-kicker').textContent = stage.kicker;
  document.querySelector('#stage-title').textContent = stage.title;
  document.querySelector('#stage-text').textContent = stage.text;
  document.querySelector('#stage-fact').textContent = stage.fact;
  const drawing = document.querySelector('#stage-drawing'); drawing.querySelector('use').setAttribute('href', `../assets/processos.svg#${stage.shape}`); drawing.setAttribute('aria-label', stage.label); animate(drawing);
  document.querySelector('#stage-next').firstChild.textContent = index === 2 ? 'Voltar ao material ' : 'Ver a próxima etapa ';
}
stageButtons.forEach((button, index) => button.addEventListener('click', () => showStage(index)));
document.querySelector('#stage-next').addEventListener('click', () => showStage((stageIndex + 1) % stages.length));

const operations = {
  milling: ['Dar forma ao material.', 'Uma ferramenta de corte remove material para formar superfícies, canais ou cavidades.', 'Esquema de fresamento'],
  turning: ['Construir formas ao redor de um eixo.', 'No torneamento, a peça gira enquanto a ferramenta remove material para trabalhar superfícies cilíndricas.', 'Esquema de torneamento'],
  drilling: ['Abrir caminho para uma montagem.', 'A furação cria aberturas na peça. Posição e diâmetro são definidos pelas necessidades do projeto.', 'Esquema de furação'],
  measure: ['Conferir antes de seguir.', 'Os instrumentos ajudam a comparar medidas da peça com as especificações do desenho. O método depende do requisito.', 'Esquema ilustrativo de medição']
};
const operationButtons = [...document.querySelectorAll('[data-operation]')];
operationButtons.forEach(button => button.addEventListener('click', () => { const key = button.dataset.operation; const operation = operations[key]; select(operationButtons, button); const drawing = document.querySelector('#operation-drawing'); drawing.querySelector('use').setAttribute('href', `../assets/processos.svg#${key}`); drawing.setAttribute('aria-label', operation[2]); animate(drawing); const detail = document.querySelector('#operation-detail'); detail.querySelector('h3').textContent = operation[0]; detail.querySelector('p').textContent = operation[1]; }));

const shopContent = {
  machine: { title: 'A máquina certa para entender a operação.', text: 'Nesta área entram imagens reais dos equipamentos da AZ3 e uma explicação simples do que cada um permite fabricar.', caption: 'Imagem ilustrativa gerada por IA. Não é um equipamento confirmado da AZ3.', facts: [['Equipamento', 'Nome e modelo a informar'], ['Aplicação', 'Tipos de peça que produz'], ['Capacidade', 'Dimensões e materiais a confirmar']] },
  tools: { title: 'Cada corte começa na ferramenta.', text: 'Brocas, fresas e ferramentas de torneamento são exemplos para explicar como o material é trabalhado. A seleção real será informada pela AZ3.', caption: 'Desenhos didáticos de ferramentas. Inventário da AZ3 a confirmar.', facts: [['Ferramenta', 'Tipo e uso a informar'], ['Operação', 'Qual forma ajuda a produzir'], ['Material', 'Compatibilidade a confirmar']] },
  measure: { title: 'O detalhe também precisa ser conferido.', text: 'Esta área apresenta os instrumentos e os procedimentos de conferência utilizados pela empresa. O esquema é apenas uma referência visual.', caption: 'Esquema de medição. Instrumentos e procedimentos reais a confirmar.', facts: [['Instrumento', 'Modelo e uso a informar'], ['Conferência', 'O que é verificado na peça'], ['Requisitos', 'Critérios do desenho a validar']] }
};
const shopButtons = [...document.querySelectorAll('[data-shop]')];
shopButtons.forEach(button => button.addEventListener('click', () => { const key = button.dataset.shop; const content = shopContent[key]; select(shopButtons, button); document.querySelector('#shop-photo').hidden = key !== 'machine'; const drawing = document.querySelector('#shop-drawing'); drawing.toggleAttribute('hidden', key === 'machine'); if (key !== 'machine') { drawing.querySelector('use').setAttribute('href', `../assets/processos.svg#${key}`); drawing.setAttribute('aria-label', key === 'tools' ? 'Esquema de ferramentas de corte' : 'Esquema de instrumento de medição'); } document.querySelector('#shop-title').textContent = content.title; document.querySelector('#shop-text').textContent = content.text; document.querySelector('#shop-caption').textContent = content.caption; const facts = document.querySelector('#shop-facts'); facts.replaceChildren(...content.facts.map(([term, value]) => { const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = term; dd.textContent = value; row.append(dt, dd); return row; })); animate(key === 'machine' ? document.querySelector('#shop-photo') : drawing); }));

const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => { select(filters, button); let count = 0; document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category; if (!card.hidden) count++; }); document.querySelector('#results-count').textContent = `${count} ${count === 1 ? 'exemplo exibido' : 'exemplos exibidos'}`; }));
const briefs = { drawing: ['Separe o desenho e as especificações.', 'Material, quantidade e aplicação ajudam na primeira avaliação.'], replacement: ['Mostre a peça e conte onde ela trabalha.', 'Fotos, medidas disponíveis e contexto da manutenção ajudam a explicar a necessidade.'], batch: ['Comece pela quantidade e pela aplicação.', 'Informe as especificações, a frequência desejada e o prazo que precisa avaliar.'] };
document.querySelector('#project-type').addEventListener('change', event => { const [title, text] = briefs[event.target.value]; document.querySelector('#brief-guidance h3').textContent = title; document.querySelector('#brief-guidance p').textContent = text; });
document.querySelector('#project-contact').addEventListener('click', () => { document.querySelector('#contact-status').hidden = false; });
