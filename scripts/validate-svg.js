/* Load into a browser test page, never into the deliverable SVG. */
async function validateSvg(svg = document.querySelector('svg')) {
  const errors = [];
  const fail = message => errors.push(message);
  if (!svg || svg.localName !== 'svg') throw new Error('No SVG root found');

  function checkStructure(root, context, responsive) {
    const nodes = [root, ...root.querySelectorAll('*')];
    const ids = new Map();
    if (root.querySelector('parsererror')) fail(`${context}: malformed SVG XML`);
    if (responsive && (root.hasAttribute('width') || root.hasAttribute('height'))) {
      fail(`${context}: fixed root dimensions`);
    }
    if (!root.hasAttribute('viewBox')) fail(`${context}: missing viewBox`);
    for (const node of nodes) {
      if (node.id) {
        if (ids.has(node.id)) fail(`${context}: duplicate ID ${node.id}`);
        ids.set(node.id, node);
      }
    }
    const localReference = (value, label) => {
      if (!value.startsWith('#') || !ids.has(value.slice(1))) {
        fail(`${context}: external or missing ${label}: ${value}`);
      }
    };
    for (const node of nodes) {
      if (['script', 'foreignObject', 'link', 'animate', 'animateTransform', 'set'].includes(node.localName)) {
        fail(`${context}: unsupported active/external element ${node.localName}`);
      }
      for (const attr of node.attributes) {
        if (/^on/i.test(attr.name)) fail(`${context}: event handler ${attr.name}`);
        if (attr.localName === 'href') {
          if (node.localName === 'image' && /^data:image\/svg\+xml;base64,/i.test(attr.value)) {
            try {
              const bytes = Uint8Array.from(atob(attr.value.split(',')[1]), c => c.charCodeAt(0));
              const xml = new TextDecoder().decode(bytes);
              const doc = new DOMParser().parseFromString(xml, 'image/svg+xml');
              if (doc.documentElement.localName !== 'svg' || doc.querySelector('parsererror')) {
                fail(`${context}: malformed embedded SVG`);
              } else {
                checkStructure(doc.documentElement, `${context}/embedded-icon`, false);
              }
            } catch (error) {
              fail(`${context}: invalid embedded SVG: ${error.message}`);
            }
          } else if (node.localName === 'image' && /^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(attr.value)) {
            // Raster data is self-contained; inspect image quality separately.
          } else {
            localReference(attr.value, 'href');
          }
        }
        if (['aria-labelledby', 'aria-describedby'].includes(attr.name)) {
          for (const id of attr.value.trim().split(/\s+/)) localReference(`#${id}`, attr.name);
        }
        if (attr.name === 'data-bounds' && !ids.has(attr.value)) {
          fail(`${context}: missing declared text bounds ${attr.value}`);
        }
      }
      const cssValues = [...node.attributes].map(attr => attr.value).join(' ') +
        (node.localName === 'style' ? node.textContent : '');
      if (/@import|@font-face/i.test(cssValues)) fail(`${context}: external/imported font or stylesheet`);
      for (const match of cssValues.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
        localReference(match[2].trim(), 'URL reference');
      }
    }
    return ids;
  }

  const parsed = new DOMParser().parseFromString(new XMLSerializer().serializeToString(svg), 'image/svg+xml');
  if (parsed.querySelector('parsererror')) fail('Malformed SVG XML');
  const ids = checkStructure(svg, 'diagram', true);
  const accessibleIds = (svg.getAttribute('aria-labelledby') ?? '').trim().split(/\s+/);
  if (svg.getAttribute('role') !== 'img' || !svg.querySelector('title')?.textContent.trim() ||
      !svg.querySelector('desc')?.textContent.trim() ||
      !['title', 'desc'].every(tag => accessibleIds.includes(svg.querySelector(tag)?.id))) {
    fail('Missing accessible role, title, description, or label references');
  }
  await document.fonts.ready;
  const viewBox = svg.viewBox.baseVal;
  if (viewBox.width <= 0 || viewBox.height <= 0) fail('Invalid viewBox dimensions');
  const screenBox = (element, box = element.getBBox()) => {
    const matrix = element.getScreenCTM();
    if (!matrix) throw new Error('SVG is not rendered');
    const points = [
      [box.x, box.y], [box.x + box.width, box.y],
      [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]
    ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
    return {
      left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)),
      top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y))
    };
  };
  const canvas = screenBox(svg, viewBox);
  const fits = (inner, outer) => inner.left >= outer.left - 0.25 &&
    inner.right <= outer.right + 0.25 && inner.top >= outer.top - 0.25 &&
    inner.bottom <= outer.bottom + 0.25;
  let minimumRenderedFontPx = Infinity;
  let measuredLabels = 0;
  for (const text of svg.querySelectorAll('text')) {
    if (text.closest('defs, symbol') || getComputedStyle(text).display === 'none') continue;
    const box = screenBox(text);
    const matrix = text.getScreenCTM();
    minimumRenderedFontPx = Math.min(minimumRenderedFontPx,
      parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.c, matrix.d));
    if (!fits(box, canvas)) fail(`Text outside viewBox: ${text.textContent.trim()}`);
    if (text.hasAttribute('data-bounds') && ids.has(text.dataset.bounds)) {
      const card = ids.get(text.dataset.bounds);
      const padding = Number(text.dataset.padding ?? 12);
      const bounds = card.getBBox();
      if (!Number.isFinite(padding) || padding < 0 ||
          bounds.width <= padding * 2 || bounds.height <= padding * 2) {
        fail(`Invalid text padding/bounds: ${text.dataset.bounds}`);
        continue;
      }
      const padded = screenBox(card, {
        x: bounds.x + padding, y: bounds.y + padding,
        width: bounds.width - 2 * padding, height: bounds.height - 2 * padding
      });
      if (!fits(box, padded)) fail(`Text overflows ${text.dataset.bounds}: ${text.textContent.trim()}`);
      measuredLabels++;
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return {
    ids: ids.size, textElements: svg.querySelectorAll('text').length, measuredLabels,
    minimumRenderedFontPx: Number.isFinite(minimumRenderedFontPx) ?
      Number(minimumRenderedFontPx.toFixed(2)) : null
  };
}
