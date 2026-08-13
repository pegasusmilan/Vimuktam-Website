const ARCHIVES = {
  'DNC Niyam CSE Dump.md': {
    title: 'DNC / Niyam / CSE Source Dump',
    subtitle: 'Living source archive of the Digital Niyam Companion, Niyam, People’s Log, Cultural Systems Engineering and related ideas.',
    source: 'Company docs/DNC Niyam CSE Dump.md'
  },
  'Philosophical Overview Dump.md': {
    title: 'Philosophical Overview Dump',
    subtitle: 'Living indexed archive of Vimuktam’s philosophical development.',
    source: 'Company docs/Philosophical Overview Dump.md'
  },
  'Balaram System Dump.md': {
    title: 'Balaram System Dump',
    subtitle: 'Living source archive of Vimuktam’s system architecture and the evolution of its organising intelligence.',
    source: 'Company docs/Balaram System Dump.md'
  },
  'Purana Narration Dump.md': {
    title: 'Vimuktam Purāṇa — Purāṇa Narration Dump',
    subtitle: 'Living source archive of the Vimuktam Purāṇa and its evolving narrative world.',
    source: 'Company docs/Purana Narration Dump.md'
  }
};

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug = s => s.toLowerCase().trim().replace(/[`*_~]/g,'').replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s+/g,'-');
const inline = raw => {
  let s = esc(raw);
  s = s.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g, (_,a,u,t) => `<img src="${esc(u)}" alt="${a}"${t?` title="${esc(t)}"`:''}>`);
  s = s.replace(/\[([^\]]+)\]\((#[^)]+)\)/g, (_,t,u) => `<a href="${u}">${t}</a>`);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_,t,u) => `<a href="${esc(u)}">${t}</a>`);
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/_([^_]+)_/g,'<em>$1</em>');
  return s;
};

function renderMarkdown(md){
  const lines = md.replace(/\r\n?/g,'\n').split('\n');
  let html='', i=0, inEntry=null;
  const closeEntry=()=>{ if(inEntry){ html += '<a class="back-index" href="#archive-index">↑ Back to Index</a></section>'; inEntry=null; } };
  const isTableSep = line => /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(line);
  const roleClass = text => {
    const clean=text.replace(/^#+\s*/,'').trim().toUpperCase();
    if(clean==='USER INPUT') return 'user-input';
    if(clean==='ASSISTANT RESPONSE') return 'assistant-response';
    if(clean==='SYNTHESIS') return 'synthesis';
    return '';
  };
  while(i<lines.length){
    const line=lines[i];
    if(/^```/.test(line)){ const lang=line.slice(3).trim(); const buf=[]; i++; while(i<lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; html+=`<pre><code${lang?` class="language-${esc(lang)}"`:''}>${esc(buf.join('\n'))}</code></pre>`; continue; }
    const h=line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if(h){
      const level=h[1].length, text=h[2].trim(), id=slug(text), role=roleClass(text);
      if(/^PN-\d{4}\b/i.test(text)){
        closeEntry(); inEntry=id; html += `<section class="entry" id="${id}"><div class="entry-label">${esc(text.match(/^PN-\d{4}/i)[0])}</div><h${Math.min(level+1,6)} id="${id}-heading">${inline(text.replace(/^PN-\d{4}\s*[—:-]?\s*/i,''))}</h${Math.min(level+1,6)}>`;
      } else {
        if(level<=1) closeEntry();
        html += `<h${level}${role?` class="archive-role ${role}"`:''} id="${id}">${inline(text)}</h${level}>`;
      }
      i++; continue;
    }
    if(/^\s*---+\s*$/.test(line)){ closeEntry(); html+='<hr>'; i++; continue; }
    if(/^\s*>/.test(line)){
      const buf=[]; while(i<lines.length && /^\s*>/.test(lines[i])){buf.push(lines[i].replace(/^\s*>\s?/,'').trim());i++;} html+=`<blockquote>${buf.map(inline).join('<br>')}</blockquote>`; continue;
    }
    if(/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)){
      const ordered=/^\s*\d+[.)]\s+/.test(line), items=[]; while(i<lines.length){const m=lines[i].match(ordered?/^\s*\d+[.)]\s+(.+)$/:/^\s*[-*+]\s+(.+)$/); if(!m) break; items.push(`<li>${inline(m[1])}</li>`); i++;} html+=`<${ordered?'ol':'ul'}>${items.join('')}</${ordered?'ol':'ul'}>`; continue;
    }
    if(line.includes('|') && i+1<lines.length && isTableSep(lines[i+1])){
      const parseRow=x=>x.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim()); const heads=parseRow(line); i+=2; const rows=[]; while(i<lines.length && lines[i].includes('|') && lines[i].trim()){rows.push(parseRow(lines[i]));i++;} html+='<table><thead><tr>'+heads.map(x=>`<th>${inline(x)}</th>`).join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+heads.map((_,n)=>`<td>${inline(r[n]||'')}</td>`).join('')+'</tr>').join('')+'</tbody></table>'; continue;
    }
    if(!line.trim()){i++;continue;}
    const buf=[line.trim()]; i++; while(i<lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^\s*[-*+]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) && !/^\s*>/.test(lines[i]) && !/^```/.test(lines[i]) && !/^\s*---+\s*$/.test(lines[i])){buf.push(lines[i].trim());i++;}
    const p=buf.join(' '); html+=`<p>${inline(p)}</p>`;
  }
  closeEntry();
  return html;
}

function sourceUrl(path){ return path.split('/').map(encodeURIComponent).join('/'); }
const params=new URLSearchParams(location.search);
const key=params.get('source') || 'DNC Niyam CSE Dump.md';
const current=ARCHIVES[key] || Object.values(ARCHIVES)[0];
const title=document.getElementById('archive-title'), subtitle=document.getElementById('archive-subtitle'), content=document.getElementById('archive-content'), status=document.getElementById('archive-status'), search=document.getElementById('archive-search'), results=document.getElementById('search-results'), list=document.getElementById('archive-list');

title.textContent=current.title; subtitle.textContent=current.subtitle; document.title=`Vimuktam — ${current.title}`;
Object.entries(ARCHIVES).forEach(([k,a])=>{const link=document.createElement('a');link.href=`archive.html?source=${encodeURIComponent(k)}`;link.textContent=a.title; if(k===key)link.className='active';list.appendChild(link);});

fetch(sourceUrl(current.source),{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(`Could not read ${current.source} (${r.status})`);return r.text();}).then(md=>{
  content.innerHTML=renderMarkdown(md);
  const index=document.getElementById('input-index');
  if(index) index.id='archive-index';
  const entries=[...document.querySelectorAll('.entry')].map(el=>({id:el.id,text:el.innerText,heading:(el.querySelector('h2,h3,h4,h5,h6')||{}).innerText||el.id}));
  status.textContent=`Source: ${current.source} · ${entries.length ? `${entries.length} indexed entries` : 'Long-form archive'} · Markdown rendered at reading time`;
  setupSearch(entries);
}).catch(err=>{status.textContent='The archive could not be loaded.';content.innerHTML=`<div class="error"><strong>Archive unavailable.</strong><br>${esc(err.message)}<br><br>The Markdown source remains the permanent source of truth in <em>Company docs/</em>.</div>`;});

function setupSearch(entries){
  search.addEventListener('input',()=>{
    const q=search.value.trim().toLowerCase(); if(q.length<2){results.hidden=true;results.innerHTML='';return;}
    const hits=entries.filter(e=>(e.id+' '+e.heading+' '+e.text).toLowerCase().includes(q)).slice(0,20);
    results.innerHTML=hits.length?hits.map(e=>`<a class="search-result" href="#${e.id}"><strong>${esc(e.id)} — ${esc(e.heading)}</strong><span>${esc(e.text.replace(/\s+/g,' ').slice(0,150))}…</span></a>`).join(''):'<div class="search-result"><span>No matching archive entry.</span></div>';
    results.hidden=false;
    results.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{results.hidden=true;search.value='';}));
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.archive-search-wrap'))results.hidden=true;});
}
