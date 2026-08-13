/* Presentation-only normalization for legacy archive structures. The Markdown source remains untouched. */
(() => {
  const originalFetch = window.fetch.bind(window);

  function normalize(markdown) {
    let text = markdown.replace(/^\uFEFF/, '');

    // Archive sources have evolved different Input Index formats. The
    // Philosophical Overview establishes the preferred presentation: a clean
    // clickable list of ID — title entries. Normalize legacy Markdown tables
    // into that same structure without changing the source Markdown.
    text = text.replace(
      /(^#{1,6}\s*INPUT\s+INDEX\s*$)(\n+)(\|\s*ID\s*\|[^\n]*\n\|[-| :]+\|\n)((?:\|[^\n]+\|\n?)+)/gim,
      (_, heading, spacing, separator, rows) => {
        const links = rows.split('\n').filter(Boolean).map(row => {
          const cells = row
            .replace(/^\|\s*/, '')
            .replace(/\s*\|\s*$/, '')
            .split('|')
            .map(cell => cell.trim());
          if (cells.length < 2) return null;

          const id = cells[0];
          const title = cells[1];
          if (!/^[A-Za-z]{2,8}-\d{4}$/.test(id)) return null;

          // Prefer an explicit anchor from the source table. Otherwise the
          // viewer will assign the stable entry ID as its presentation anchor.
          const anchorCell = cells.find(cell => /\(#([^)]*)\)/.test(cell));
          const anchor = anchorCell
            ? (anchorCell.match(/\(#([^)]*)\)/) || [null, id.toLowerCase()])[1]
            : id.toLowerCase();

          return `- [${id} — ${title}](#${anchor})`;
        }).filter(Boolean);

        return `${heading}${spacing}${links.join('\n')}\n`;
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
