const esc = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug = value => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[`*_~]/g,'').replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');

function inline(raw){
  const stash=[];
  const hold=html => { const id=stash.push(html)-1; return `\u0000${id}\u0000`; };
  let s=String(raw);
  s=s.replace(/`([^`]+)`/g,(_,text)=>hold(`<code>${esc(text)}</code>`));
  s=esc(s);
  s=s.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g,(_,alt,url,title)=>`<img src="${esc(url)}" alt="${esc(alt)}"${title?` title="${esc(title)}"`:''}>`);
  s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,text,url,title)=>`<a href="${esc(url)}" target="_blank" rel="noopener"${title?` title="${title}"`:''}>${text}</a>`);
  s=s.replace(/\[([^\]]+)\]\((#[^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,text,url,title)=>`<a href="${url}"${title?` title="${title}"`:''}>${text}</a>`);
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>');
  s=s.replace(/\*([^*\n]+)\*/g,'<em>$1</em>').replace(/_([^_\n]+)_/g,'<em>$1</em>');
  s=s.replace(/~~([^~]+)~~/g,'<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g,(_,id)=>stash[Number(id)]);
}

function tableRow(line){ return line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(cell=>cell.trim()); }
function isTableSeparator(line){ return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line); }

function renderMarkdown(markdown){
  const lines=markdown.replace(/\r\n?/g,'\n').split('\n');
  let html='', i=0, headingIds=new Set();
  const uniqueId=text=>{let id=slug(text)||'section';let n=2;while(headingIds.has(id))id=`${id}-${n++}`;headingIds.add(id);return id;};

  while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue;}

    if(/^```/.test(line.trim())){
      const language=line.trim().slice(3).trim(); const code=[]; i++;
      while(i<lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
      if(i<lines.length)i++;
      html+=`<pre><code${language?` class="language-${esc(language)}"`:''}>${esc(code.join('\n'))}</code></pre>`; continue;
    }

    const heading=line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if(heading){
      const level=heading[1].length, text=heading[2].trim(), id=uniqueId(text);
      html+=`<h${level} id="${id}">${inline(text)}</h${level}>`; i++; continue;
    }

    if(/^\s*(?:---+|\*\s*\*\s*\*|___+)\s*$/.test(line)){html+='<hr>';i++;continue;}

    if(/^\s*>/.test(line)){
      const quote=[]; while(i<lines.length && /^\s*>/.test(lines[i])){quote.push(lines[i].replace(/^\s*>\s?/,'').trim());i++;}
      html+=`<blockquote>${quote.map(x=>`<p>${inline(x)}</p>`).join('')}</blockquote>`; continue;
    }

    if(/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)){
      const ordered=/^\s*\d+[.)]\s+/.test(line), items=[];
      while(i<lines.length){const match=lines[i].match(ordered?/^\s*\d+[.)]\s+(.+)$/:/^\s*[-*+]\s+(.+)$/);if(!match)break;items.push(`<li>${inline(match[1])}</li>`);i++;}
      html+=`<${ordered?'ol':'ul'}>${items.join('')}</${ordered?'ol':'ul'}>`; continue;
    }

    if(line.includes('|') && i+1<lines.length && isTableSeparator(lines[i+1])){
      const heads=tableRow(line); i+=2; const rows=[];
      while(i<lines.length && lines[i].trim() && lines[i].includes('|')){rows.push(tableRow(lines[i]));i++;}
      html+='<table><thead><tr>'+heads.map(x=>`<th>${inline(x)}</th>`).join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+heads.map((_,n)=>`<td>${inline(row[n]||'')}</td>`).join('')+'</tr>').join('')+'</tbody></table>'; continue;
    }

    const paragraph=[line.trim()]; i++;
    while(i<lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^\s*(?:[-*+]\s+|\d+[.)]\s+|>)/.test(lines[i]) && !/^```/.test(lines[i].trim()) && !/^\s*(?:---+|\*\s*\*\s*\*|___+)\s*$/.test(lines[i])){paragraph.push(lines[i].trim());i++;}
    html+=`<p>${inline(paragraph.join(' '))}</p>`;
  }
  return {html, headingIds:[...headingIds]};
}

const content=document.getElementById('bcp-content');
const toc=document.getElementById('bcp-toc');
const search=document.getElementById('bcp-search');
const results=document.getElementById('bcp-search-results');
const status=document.getElementById('bcp-status');

function buildToc(){
  const headings=[...content.querySelectorAll('h2,h3')];
  toc.innerHTML=headings.map(h=>`<a class="toc-${h.tagName.toLowerCase()}" href="#${h.id}">${esc(h.textContent)}</a>`).join('');
}

function setupSearch(){
  const sections=[...content.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>{
    const parts=[]; let node=h.nextElementSibling;
    while(node && !/^H[1-6]$/.test(node.tagName)){parts.push(node.textContent);node=node.nextElementSibling;}
    return {id:h.id,title:h.textContent.trim(),text:(h.textContent+' '+parts.join(' ')).replace(/\s+/g,' ').trim()};
  });
  search.addEventListener('input',()=>{
    const q=search.value.trim().toLowerCase();
    if(q.length<2){results.hidden=true;results.innerHTML='';return;}
    const hits=sections.filter(x=>x.text.toLowerCase().includes(q)).slice(0,20);
    results.innerHTML=hits.length?hits.map(x=>`<a class="search-result" href="#${x.id}"><strong>${esc(x.title)}</strong><span>${esc(x.text.slice(0,190))}${x.text.length>190?'…':''}</span></a>`).join(''):'<div class="search-result"><span>No matching section.</span></div>';
    results.hidden=false;
    results.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{results.hidden=true;search.value='';}));
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.bcp-search-wrap'))results.hidden=true;});
}

async function load(){
  try{
    const response=await fetch('Company%20docs/Vimuktam_BCP_v1.1.md',{cache:'no-store'});
    if(!response.ok)throw new Error(`Could not load Company docs/Vimuktam_BCP_v1.1.md (${response.status})`);
    const markdown=await response.text();
    const rendered=renderMarkdown(markdown);
    content.innerHTML=rendered.html;
    buildToc();
    setupSearch();
    status.textContent='Living source: Company docs/Vimuktam_BCP_v1.1.md · rendered at reading time · search indexes the current document';
    if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
  }catch(error){
    status.textContent='The BCP could not be loaded.';
    content.innerHTML=`<div class="error"><strong>Document unavailable.</strong><p>${esc(error.message)}</p><p>The Company Documents copy remains the permanent source of truth in the repository.</p></div>`;
  }
}
load();
