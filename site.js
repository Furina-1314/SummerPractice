const content = window.manualContent || [];
const main = document.querySelector('#content');
const toc = document.querySelector('#toc');
const backToTop = document.querySelector('#backToTop');

const slugCounts = new Map();
const slugify = (text) => {
  const base = text.trim().toLowerCase().replace(/[\s\/]+/g, '-').replace(/[，。、“”‘’：:；;（）()]/g, '').replace(/^-+|-+$/g, '') || 'section';
  const count = slugCounts.get(base) || 0;
  slugCounts.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
};
const escapeHtml = (text) => String(text).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const appendListItem = (type, text) => {
  const last = main.lastElementChild;
  const tag = type === 'ol' ? 'OL' : 'UL';
  const list = last && last.tagName === tag ? last : document.createElement(type);
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
  if (!last || last.tagName !== tag) main.appendChild(list);
};
const renderTable = (rows) => {
  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  const table = document.createElement('table');
  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const el = document.createElement(index === 0 ? 'th' : 'td');
      el.textContent = cell;
      tr.appendChild(el);
    });
    table.appendChild(tr);
  });
  wrap.appendChild(table);
  main.appendChild(wrap);
};

const tocList = document.createElement('ul');
tocList.className = 'toc-list';
let titleRendered = false;
content.forEach(block => {
  if (block.type === 'h1' || block.type === 'h2') {
    const id = slugify(block.text);
    const level = block.type === 'h1' ? 1 : 2;
    const heading = document.createElement(block.type === 'h1' ? 'h2' : 'h3');
    heading.id = id;
    heading.textContent = block.text;
    main.appendChild(heading);
    const li = document.createElement('li');
    li.className = `level-${level}`;
    li.innerHTML = `<a href="#${id}">${escapeHtml(block.text)}</a>`;
    tocList.appendChild(li);
  } else if (block.type === 'ul' || block.type === 'ol') {
    appendListItem(block.type, block.text);
  } else if (block.type === 'table') {
    renderTable(block.rows);
  } else {
    const p = document.createElement('p');
    p.textContent = block.text;
    if (!titleRendered && block.text.includes('清华大学电子工程系')) {
      p.className = 'cover-line';
      titleRendered = true;
    }
    main.appendChild(p);
  }
});
toc.appendChild(tocList);

window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 500));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
