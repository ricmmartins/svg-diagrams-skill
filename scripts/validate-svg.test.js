/* Load after validate-svg.js into a browser page containing the template. */
async function runSvgValidationTests(original = document.querySelector('svg')) {
  await validateSvg(original);
  const results = [];
  const ns = 'http://www.w3.org/2000/svg';
  const cases = [
    ['duplicate IDs', svg => svg.append(svg.querySelector('[id]').cloneNode(true)), /duplicate ID/],
    ['broken marker', svg => svg.querySelector('path[marker-end]').setAttribute('marker-end', 'url(#missing)'), /missing URL reference/],
    ['broken local icon', svg => {
      const use = document.createElementNS(ns, 'use');
      use.setAttribute('href', '#missing-icon');
      svg.append(use);
    }, /missing href/],
    ['external image', svg => {
      const image = document.createElementNS(ns, 'image');
      image.setAttribute('href', 'https://example.invalid/icon.svg');
      svg.append(image);
    }, /external or missing href/],
    ['external stylesheet', svg => {
      const style = document.createElementNS(ns, 'style');
      style.textContent = '@import "https://example.invalid/font.css";';
      svg.append(style);
    }, /external\/imported font or stylesheet/],
    ['card text overflow', svg => svg.querySelector('text[data-bounds]').textContent = 'Wide label '.repeat(30), /Text overflows/],
    ['canvas text overflow', svg => svg.querySelector('text').setAttribute('x', '-500'), /Text outside viewBox/],
    ['missing declared bounds', svg => svg.querySelector('text[data-bounds]').setAttribute('data-bounds', 'missing-card'), /missing declared text bounds/],
    ['negative padding', svg => svg.querySelector('text[data-bounds]').setAttribute('data-padding', '-1'), /Invalid text padding/],
    ['fixed root width', svg => svg.setAttribute('width', '1440'), /fixed root dimensions/],
    ['invalid viewBox', svg => svg.setAttribute('viewBox', '0 0 0 0'), /Invalid viewBox dimensions/],
    ['incomplete accessible references', svg => svg.setAttribute('aria-labelledby', svg.querySelector('title').id), /Missing accessible role/],
    ['malformed embedded SVG', svg => {
      const image = document.createElementNS(ns, 'image');
      image.setAttribute('href', 'data:image/svg+xml;base64,' + btoa('<svg><broken></svg>'));
      svg.append(image);
    }, /malformed embedded SVG/],
    ['external dependency in embedded SVG', svg => {
      const image = document.createElementNS(ns, 'image');
      const icon = `<svg xmlns="${ns}" viewBox="0 0 10 10"><image href="https://example.invalid/icon.svg"/></svg>`;
      image.setAttribute('href', 'data:image/svg+xml;base64,' + btoa(icon));
      svg.append(image);
    }, /embedded-icon: external or missing href/]
  ];
  for (const [name, mutate, expected] of cases) {
    const svg = original.cloneNode(true);
    original.replaceWith(svg);
    try {
      mutate(svg);
      let caught;
      try {
        await validateSvg(svg);
      } catch (error) {
        caught = error;
      }
      if (!caught || !expected.test(caught.message)) {
        throw new Error(`${name}: expected ${expected}, got ${caught?.message ?? 'success'}`);
      }
      results.push({ name, passed: true });
    } finally {
      svg.replaceWith(original);
    }
  }
  const svg = original.cloneNode(true);
  original.replaceWith(svg);
  try {
    const image = document.createElementNS(ns, 'image');
    image.setAttribute('href', 'data:image/svg+xml;base64,' + btoa(
      `<svg xmlns="${ns}" viewBox="0 0 10 10"><rect width="10" height="10" fill="#0078d4"/></svg>`));
    image.setAttribute('width', '10');
    image.setAttribute('height', '10');
    svg.append(image);
    await validateSvg(svg);
    results.push({ name: 'self-contained embedded SVG accepted', passed: true });
  } finally {
    svg.replaceWith(original);
  }
  return results;
}
