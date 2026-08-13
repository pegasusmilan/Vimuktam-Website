/* Presentation-only normalization for legacy archive structures. The Markdown source remains untouched. */
(() => {
  const originalFetch = window.fetch.bind(window);

  function normalize(markdown) {
    let text = markdown.replace(/^\uFEFF/, '');

    // The Purāṇa dump historically stored its Input Index as a Markdown table.
    // Philosophical Overview uses the preferred bullet-list index. Convert only
    // an Input Index table at render time so both archives present identically.
    text = text.replace(
      /(##\s+Input Index\s*\n\n)(\| ID \| Short title \| Date \| Major themes \| Anchor \|\n\|[-| :]+\|\n)((?:\|[^\n]+\|\n)+)/i,
      (_, heading, separator, rows) => {
        const links = rows.split('\n').filter(Boolean).map(row => {
          const cells = row.replace(/^\|\s*/, '').replace(/\s*\|\s*$/, '').split('|').map(cell => cell.trim());
          if (cells.length < 5) return null;
          const id = cells[0];
          const title = cells[1];
          const anchor = (cells[4].match(/\(#([^)]*)\)/) || [null, id.toLowerCase()])[1];
          return `- [${id} — ${title}](#${anchor})`;
        }).filter(Boolean);
        return `${heading}${links.join('\n')}\n`;
      }
    );

    // Entry anchors are redundant once the viewer assigns the stable PN-/PO-
    // identifier to the heading. Hide them from the presentation layer rather
    // than allowing raw HTML to appear as prose.
    text = text.replace(/^\s*<a\s+id=["'][^"']+["']\s*><\/a>\s*$/gmi, '');
    return text;
  }

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    if (!/Company%20docs|Company%20docs\//i.test(url)) return response;
    const contentType = response.headers.get('content-type') || '';
    if (contentType && !/text|markdown/i.test(contentType)) return response;

    const markdown = await response.text();
    return new Response(normalize(markdown), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  };
})();
