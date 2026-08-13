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

const esc = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug = value => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[`*_~]/g,'').replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');

function inline(raw){
  const stash=[];
  const hold=html => { const id=stash.push(html)-1; return `\u0000${id}\u0000`; };
  let s=String(raw);
  s=s.replace(/`([^`]+)`/g,(_,text)=>hold(`<code>${esc(text)}</code>`));
  s=esc(s);
  s=s.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g,(_,alt,url,title)=>`<img src="${esc(url)}" alt="${esc(alt)}"${title?` title="${esc(title)}"`:''}>`);
  s=s.replace(/\[([^\]]+)\]\((#[^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,text,url,title)=>`<a href="${url}"${title?` title="${esc(title)}"`:''}>${text}</a>`);
  s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,text,url,title)=>`<a href="${esc(url)}" target="_blank" rel="noopener"${title?` title="${esc(title)}"`:''}>${text}</a>`);
  s=s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,text,url,title)=>`<a href="${esc(url)}"${title?` title="${esc(title)}"`:''}>${text}</a>`);
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
  s=s.replace(/\*([^*\n]+)\*/g,'<em>$1</em>').replace(/_([^_\n]+)_/g,'<em>$1</em>');
  s=s.replace(/~~([^~]+)~~/g,'<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g,(_,id)=>stash[Number(id)]);
}

function tableRow(line){ return line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(cell=>cell.trim()); }
function isTableSeparator(line){ return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line); }
function isEntryHeading(text){ return /^PN-\d{4}\b/i.test(text.trim()); }
function roleName(text){ const value=text.trim().toUpperCase(); return ['USER INPUT','ASSISTANT RESPONSE','SYNTHESIS'].includes(value) ? value : null; }

function renderMarkdown(markdown){
  const lines=markdown.replace(/\r\n?/g,'\n').split('\n');
  let html='', i=0, entryOpen=false, roleOpen=false;
  const closeRole=()=>{ if(roleOpen){ html+='</section>'; roleOpen=false; } };
  const closeEntry=()=>{ closeRole(); if(entryOpen){ html+='<a class="back-index" href="#archive-index">↑ Back to Index</a></section>'; entryOpen=false; } };

  while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue;}

    const explicit=line.trim().match(/^<a\s+id=["']([^"']+)["']\s*><\/a>$/i);
    if(explicit){ html+=`<span id="${esc(explicit[1])}" class="explicit-anchor"></span>`; i++; continue; }

    if(/^```/.test(line.trim())){
      closeRole(); const language=line.trim().slice(3).trim(); const code=[]; i++;
      while(i<lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
      if(i<lines.length)i++;
      html+=`<pre><code${language?` class="language-${esc(language)}"`:''}>${esc(code.join('\n'))}</code></pre>`; continue;
    }

    const heading=line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if(heading){
      const level=heading[1].length, text=heading[2].trim(), role=roleName(text);
      if(role){ closeRole(); const cls=role.toLowerCase().replace(/ /g,'-'); html+=`<section class="role-block ${cls}"><h${level} class="entry-label role-heading">${esc(role)}</h${level}>`; roleOpen=true; i++; continue; }
      if(isEntryHeading(text)){
        closeEntry(); const id=slug(text); const match=text.match(/^(PN-\d{4})\s*[—:-]?\s*(.*)$/i); const entryId=match[1].toUpperCase(); const title=match[2]||text;
        html+=`<section class="entry" id="${id}"><div class="entry-label">${esc(entryId)}</div><h${Math.min(level+1,6)} id="${id}-heading">${inline(title)}</h${Math.min(level+1,6)}>`; entryOpen=true; i++; continue;
      }
      closeRole(); const id=/^Input Index$/i.test(text)?'archive-index':slug(text); html+=`<h${level} id="${id}">${inline(text)}</h${level}>`; i++; continue;
    }

    if(/^\s*(?:---+|\*\s*\*\s*\*|___+)\s*$/.test(line)){closeRole();html+='<hr>';i++;continue;}

    if(/^\s*>/.test(line)){
      closeRole(); const quote=[]; while(i<lines.length && /^\s*>/.test(lines[i])){quote.push(lines[i].replace(/^\s*>\s?/,'').trim());i++;}
      html+=`<blockquote>${quote.map(x=>`<p>${inline(x)}</p>`).join('')}</blockquote>`; continue;
    }

    if(/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)){
      closeRole(); const ordered=/^\s*\d+[.)]\s+/.test(line), items=[];
      while(i<lines.length){const match=lines[i].match(ordered?/^\s*\d+[.)]\s+(.+)$/:/^\s*[-*+]\s+(.+)$/);if(!match)break;items.push(`<li>${inline(match[1])}</li>`);i++;}
      html+=`<${ordered?'ol':'ul'}>${items.join('')}</${ordered?'ol':'ul'}>`; continue;
    }

    if(line.includes('|') && i+1<lines.length && isTableSeparator(lines[i+1])){
      closeRole(); const heads=tableRow(line); i+=2; const rows=[];
      while(i<lines.length && lines[i].trim() && lines[i].includes('|')){rows.push(tableRow(lines[i]));i++;}
      html+='<table><thead><tr>'+heads.map(x=>`<th>${inline(x)}</th>`).join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+heads.map((_,n)=>`<td>${inline(row[n]||'')}</td>`).join('')+'</tr>').join('')+'</tbody></table>'; continue;
    }

    const paragraph=[line.trim()]; i++;
    while(i<lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^\s*(?:[-*+]\s+|\d+[.)]\s+|>)/.test(lines[i]) && !/^```/.test(lines[i].trim()) && !/^\s*(?:---+|\*\s*\*\s*\*|___+)\s*$/.test(lines[i])){paragraph.push(lines[i].trim());i++;}
    html+=`<p>${inline(paragraph.join(' '))}</p>`;
  }
  closeEntry(); return html;
}

function sourceUrl(path){ return path.split('/').map(encodeURIComponent).join('/'); }
const params=new URLSearchParams(location.search);
const key=params.get('source') || 'Purana Narration Dump.md';
const current=ARCHIVES[key] || ARCHIVES['Purana Narration Dump.md'];
const title=document.getElementById('archive-title'), subtitle=document.getElementById('archive-subtitle'), content=document.getElementById('archive-content'), status=document.getElementById('archive-status'), search=document.getElementById('archive-search'), results=document.getElementById('search-results'), list=document.getElementById('archive-list');

title.textContent=current.title; subtitle.textContent=current.subtitle; document.title=`Vimuktam — ${current.title}`;
Object.entries(ARCHIVES).forEach(([name,archive])=>{const link=document.createElement('a');link.href=`archive.html?source=${encodeURIComponent(name)}`;link.textContent=archive.title;if(name===key)link.className='active';list.appendChild(link);});

async function loadSource(){
  try{
    const local=await fetch(sourceUrl(current.source),{cache:'no-store'});
    if(local.ok)return local.text();
  }catch(_){ }
  const rawUrl='https://raw.githubusercontent.com/pegasusmilan/Vimuktam-Website/main/'+sourceUrl(current.source);
  const raw=await fetch(rawUrl,{cache:'no-store'});
  if(!raw.ok)throw new Error(`Could not read ${current.source} (${raw.status})`);
  return raw.text();
}

loadSource().then(markdown=>{
  content.innerHTML=renderMarkdown(markdown);
  const entries=[...content.querySelectorAll('.entry')].map(entry=>({id:entry.querySelector('.entry-label')?.textContent.trim()||entry.id,anchor:entry.id,title:entry.querySelector('h2,h3,h4,h5,h6')?.textContent.trim()||entry.id,text:entry.textContent.replace(/\s+/g,' ').trim()}));
  status.textContent=`Source: ${current.source} · ${entries.length ? `${entries.length} indexed entries` : 'Long-form archive'} · rendered from Markdown at reading time`;
  setupSearch(entries);
  if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
}).catch(error=>{status.textContent='The archive could not be loaded.';content.innerHTML=`<div class="error"><strong>Archive unavailable.</strong><p>${esc(error.message)}</p><p>The Markdown source remains the permanent source of truth in <em>Company docs/</em>.</p></div>`;});

function setupSearch(entries){
  search.addEventListener('input',()=>{
    const query=search.value.trim().toLowerCase(); if(query.length<2){results.hidden=true;results.innerHTML='';return;}
    const hits=entries.filter(entry=>(entry.id+' '+entry.title+' '+entry.text).toLowerCase().includes(query)).slice(0,25);
    results.innerHTML=hits.length?hits.map(entry=>`<a class="search-result" href="#${entry.anchor}"><strong>${esc(entry.id)} — ${esc(entry.title)}</strong><span>${esc(entry.text.slice(0,180))}${entry.text.length>180?'…':''}</span></a>`).join(''):'<div class="search-result"><span>No matching archive entry.</span></div>';
    results.hidden=false; results.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{results.hidden=true;search.value='';}));
  });
  document.addEventListener('click',event=>{if(!event.target.closest('.archive-search-wrap'))results.hidden=true;});
}
