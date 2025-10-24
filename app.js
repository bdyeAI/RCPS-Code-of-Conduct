// App with header back button + improved responses modal formatting
let APP = { data: null, installPrompt: null };

async function loadData() {
  const res = await fetch('data.json');
  APP.data = await res.json();
}

// small helper
const el = (tag, attrs={}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k==='class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v!==null && v!==undefined) node.setAttribute(k, v);
  });
  for (const c of children) node.append(c?.nodeType ? c : document.createTextNode(c));
  return node;
};

function setThemeMeta() {
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (brand && meta) meta.setAttribute('content', brand);
}

function breadcrumbs(parts) {
  const wrap = el('nav', {class:'breadcrumbs', 'aria-label':'Breadcrumbs'});
  let path = '#/';
  wrap.append(el('a', {href:'#/'}, 'Home'));
  for (const p of parts) {
    wrap.append(document.createTextNode('›'));
    path += p.href;
    wrap.append(el('a', {href:path}, p.label));
  }
  return wrap;
}

function renderHome() {
  const main = document.getElementById('app');
  main.innerHTML = '';

  // Remove header back button when on home
  const backBtnHeader = document.querySelector('.back-btn-header');
  if (backBtnHeader) backBtnHeader.remove();

  const grid = el('section', {class:'grid'});
  APP.data.categories.forEach(cat => {
    grid.append(el('article', {class:'card', onclick: () => location.hash = '#/category/'+cat.code},
      el('h3', {}, `Category ${cat.code}: ${cat.name}`),
      el('small', {}, cat.abbrev)
    ));
  });
  main.append(grid);
}

function renderCategory(code) {
  const main = document.getElementById('app');
  main.innerHTML = '';

  // add header back button (rectangular with rounded corners)
  const header = document.querySelector('.app-header');
  if (!document.querySelector('.back-btn-header')) {
    const backBtn = el('button', { class: 'back-btn-header', onclick: () => location.hash = '#/' }, '←');
    header.prepend(backBtn);
  }

  const cat = APP.data.categories.find(c => c.code === code);
  if (!cat) { main.textContent = 'Category not found.'; return; }

  // show breadcrumbs below header (no old in-content back button)
  main.append(breadcrumbs([{href:'category/'+code, label:'Category '+code}]));

  const table = el('table', {class:'table', role:'table'});
  const thead = el('thead', {},
    el('tr', {},
      el('th', {}, 'Behavior'),
      el('th', {}, 'Elementary (Levels)'),
      el('th', {}, 'Secondary (Levels)')
    )
  );
  table.append(thead);

  const tbody = el('tbody');
  const term = (document.getElementById('searchInput')?.value || '').toLowerCase();
  cat.behaviors
    .filter(b => b.behavior.toLowerCase().includes(term))
    .forEach(b => {
      const tr = el('tr', {});
      tr.append(el('td', {class:'behavior'}, b.behavior));
      const elCell = el('td', {});
      const secCell = el('td', {});
      const elLevels = el('div', {class:'levels'}, ...b.elementary.map(l => levelDot(l, 'elem')));
      const secLevels = el('div', {class:'levels'}, ...b.secondary.map(l => levelDot(l, 'sec')));
      elCell.append(elLevels); secCell.append(secLevels);
      tr.append(elCell, secCell);
      tbody.append(tr);
    });
  table.append(tbody);
  main.append(table);
}

function levelDot(level, band) {
  return el('button', {class:'dot '+(band==='sec'?'secondary':''), 'aria-label':`Level ${level} responses`, onclick: () => openResponses(level)}, String(level));
}

// Improved modal: first line as description (no bullet) + divider + list
function openResponses(level) {
  const list = APP.data.responses[level] || [];

  const description = list.length ? list[0] : "";
  const items = list.length > 1 ? list.slice(1) : [];

  const body = el('div', {},
    el('h2', {}, `Level ${level} Responses`),
    description ? el('p', {class: 'level-desc'}, description) : null,
    (description && items.length) ? el('hr', {class: 'divider'}) : null,
    el('ul', {class:'response-list'}, ...items.map(item => el('li', {}, item)))
  );

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';
  modalBody.append(body);
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // lock background scroll
}

function closeModal() {
  document.getElementById('modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // restore scroll
}

function route() {
  const hash = location.hash || '#/';
  const [, path, param] = hash.match(/^#\/([^\/]+)?\/?([^\/]+)?/) || [];
  if (!APP.data) return;
  if (!path) renderHome();
  else if (path === 'category' && param) renderCategory(param);
  else renderHome();
}

window.addEventListener('hashchange', route);
document.addEventListener('click', e => {
  if (e.target && e.target.id==='closeModal') closeModal();
  if (e.target && e.target.id==='modal') closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.addEventListener('input', e => { if (e.target && e.target.id === 'searchInput') route(); });

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  APP.installPrompt = e;
  const btn = document.getElementById('installBtn');
  btn.hidden = false;
  btn.onclick = async () => {
    btn.hidden = true;
    APP.installPrompt.prompt();
    await APP.installPrompt.userChoice;
    APP.installPrompt = null;
  };
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('service-worker.js'); });
}

// Boot
(async function init(){
  await loadData();
  setThemeMeta();
  route();
})();
