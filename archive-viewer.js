const ARCHIVES = {
  balaram: { file: 'Balaram System Dump.md', title: 'Balaram System Dump', subtitle: 'The living source archive of Vimuktam’s organising intelligence, Niyam, DNC and the evolution of the wider system.' },
  philosophy: { file: 'Philosophical Overview Dump.md', title: 'Philosophical Overview Dump', subtitle: 'A living source archive preserving the development of Vimuktam’s philosophical thought before canonical editing.' },
  purana: { file: 'Purana Narration Dump.md', title: 'Purāṇa Narration Dump', subtitle: 'The living source archive of the Vimuktam Purāṇa and its developing narrative world.' },
  dnc: { file: 'DNC Niyam CSE Dump.md', title: 'DNC / Niyam / CSE Source Dump', subtitle: 'The living source archive of Niyam, the DNC, People’s Log, Cultural Systems Engineering and related system ideas.' },
  marketing: { file: 'Marketing Strategy Idea Dump.md', title: 'Marketing Strategy Idea Dump', subtitle: 'The living source archive of Vimuktam’s marketing thinking, hypotheses, propositions and developing strategy.' }
};

const key = new URLSearchParams(location.search).get('doc') || 'balaram';
const config = ARCHIVES[key] || ARCHIVES.balaram;
const $ = id => document.getElementById(id);
const titleEl = $('archive-title');
const subtitleEl = $('archive-subtitle');
const statusEl = $('archive-status');
const contentEl = $('archive-content');
const listEl = $('archive-list');
const searchEl = $('archive-search');
const resultsEl = $('search-results');

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

function slug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function inline(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  s = s.replace(/_([^_\n]+)_/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (m, label, href) => {
    const safe = /^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(href) ? href : '#';
    return `<a href="${esc(safe)}"${/^https?:/i.test(safe) ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  });
  return s;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let i = 0;
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let quote = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html += `<p>${inline(paragraph.join(' '))}</p>`;
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listType) {
      html += `<${listType}>${listItems.join('')}</${listType}>`;
      listType = null;
      listItems = [];
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      html += `<blockquote>${quote.map(line => `<p>${inline(line)}</p>`).join('')}</blockquote>`;
      quote = [];
    }
  };
  const flush = () => { flushParagraph(); flushList(); flushQuote(); };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { flush(); i++; continue; }

    if (/^\s*```/.test(line)) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      html += `<pre><code>${esc(code.join('\n'))}</code></pre>`;
      continue;
    }

    const heading = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flush();
      const level = heading[1].length;
      const text = heading[2].trim();
      const idMatch = text.match(/^([A-Za-z]{2,8}-\d{4})\b/);
      const id = idMatch ? idMatch[1].toLowerCase() : (/^Input Index$/i.test(text) ? 'archive-index' : slug(text));
      html += `<h${level} id="${esc(id)}">${inline(text)}</h${level}>`;
      i++;
      continue;
    }

    if (/^\s*(---+|\*\s*\*\s*\*|___+)\s*$/.test(line)) {
      flush(); html += '<hr>'; i++; continue;
    }

    if (/^\s*>/.test(line)) {
      flushParagraph(); flushList();
      quote = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, '').trim());
        i++;
      }
      flushQuote();
      continue;
    }

    const item = line.match(/^\s*([-+*]|\d+[.)])\s+(.+)$/);
    if (item) {
      flushParagraph(); flushQuote();
      const nextType = /^\d/.test(item[1]) ? 'ol' : 'ul';
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push(`<li>${inline(item[2])}</li>`);
      i++;
      continue;
    }

    if (listType) flushList();
    paragraph = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !/^\s*(#{1,6})\s+/.test(lines[i]) && !/^\s*([-+*]|\d+[.)])\s+/.test(lines[i]) && !/^\s*>/.test(lines[i]) && !/^\s*```/.test(lines[i]) && !/^\s*(---+|\*\s*\*\s*\*|___+)\s*$/.test(lines[i])) {
      paragraph.push(lines[i].trim());
      i++;
    }
    flushParagraph();
  }

  flush();
  return html;
}

function enhanceEntries() {
  [...contentEl.querySelectorAll('h2')].forEach(heading => {
    const match = heading.textContent.trim().match(/^([A-Za-z]{2,8}-\d{4})\b/);
    if (!match) return;
    const section = document.createElement('section');
    section.className = 'entry';
    section.id = match[1].toLowerCase();
    heading.parentNode.insertBefore(section, heading);
    let node = heading;
    while (node) {
      const next = node.nextSibling;
      section.appendChild(node);
      if (next && next.nodeType === 1 && next.matches('h2')) break;
      node = next;
    }
    const back = document.createElement('a');
    back.className = 'back-index';
    back.href = '#archive-index';
    back.textContent = '↑ Back to Index';
    section.appendChild(back);
  });

  [...contentEl.querySelectorAll('h3')].forEach(heading => {
    const label = heading.textContent.trim().toUpperCase();
    const className = label === 'USER INPUT' ? 'user-input' : label === 'ASSISTANT RESPONSE' ? 'assistant-response' : label === 'SYNTHESIS' ? 'synthesis' : '';
    if (!className) return;
    const box = document.createElement('div');
    box.className = className;
    heading.parentNode.insertBefore(box, heading);
    let node = heading;
    while (node) {
      const next = node.nextSibling;
      box.appendChild(node);
      if (next && next.nodeType === 1 && next.matches('h3')) break;
      node = next;
    }
    heading.className = 'entry-label';
  });
}

function buildRail() {
  listEl.innerHTML = Object.entries(ARCHIVES).map(([id, archive]) => `<a href="archive.html?doc=${id}" class="${id === key ? 'active' : ''}">${esc(archive.title)}</a>`).join('');
}

function searchableSections() {
  return [...contentEl.querySelectorAll('.entry'), ...[...contentEl.querySelectorAll('h2')].filter(h => !h.closest('.entry'))].map(el => {
    const heading = el.querySelector('h2') || el;
    return { id: el.id || heading.id, title: heading.textContent.trim(), text: el.textContent.toLowerCase() };
  }).filter(item => item.id);
}

function searchArchive(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) { resultsEl.hidden = true; resultsEl.innerHTML = ''; return; }
  const hits = searchableSections().filter(item => terms.every(term => item.text.includes(term) || item.title.toLowerCase().includes(term)));
  resultsEl.innerHTML = hits.slice(0, 30).map(item => `<a class="search-result" href="#${esc(item.id)}"><strong>${esc(item.title)}</strong><span>${esc(item.text.slice(Math.max(0, item.text.indexOf(terms[0]) - 70), Math.max(0, item.text.indexOf(terms[0]) - 70) + 180).replace(/\s+/g, ' '))}</span></a>`).join('') || '<div class="search-empty">No matching passages found.</div>';
  resultsEl.hidden = false;
}

async function loadArchive() {
  titleEl.textContent = config.title;
  subtitleEl.textContent = config.subtitle;
  document.title = `Vimuktam — ${config.title}`;
  buildRail();
  try {
    const path = `Company%20docs/${encodeURIComponent(config.file)}`;
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Source returned ${response.status}`);
    const markdown = await response.text();
    contentEl.innerHTML = renderMarkdown(markdown);
    enhanceEntries();
    statusEl.textContent = `${contentEl.querySelectorAll('.entry').length || 'Long-form'} indexed source entries · rendered from Company docs/${config.file}`;
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1).toLowerCase())?.scrollIntoView());
  } catch (error) {
    statusEl.textContent = 'The source archive could not be loaded.';
    contentEl.innerHTML = `<div class="error"><strong>Archive unavailable.</strong><p>${esc(error.message)}. The permanent Markdown source remains in <em>Company docs/</em>.</p></div>`;
  }
}

searchEl.addEventListener('input', event => searchArchive(event.target.value));
searchEl.addEventListener('keydown', event => {
  if (event.key === 'Escape') { searchEl.value = ''; searchArchive(''); searchEl.blur(); }
});
resultsEl.addEventListener('click', () => { resultsEl.hidden = true; });
document.addEventListener('click', event => { if (!event.target.closest('.archive-search-wrap')) resultsEl.hidden = true; });
loadArchive();
