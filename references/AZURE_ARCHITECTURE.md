# Azure Architecture Profile

Use this profile for a detailed Azure architecture diagram, not as a replacement for the simple flowcharts and comparison templates in README.md.

## Intent and Source

The visual exemplar is the public [Service Health operator architecture](https://github.com/ricmmartins/azure-service-health-slack-bot/blob/main/img/architecture-flow.svg). Its useful patterns are the generous canvas, numbered request path, nested boundaries, separated supporting flows, and explicit legend. Do not copy its Service Health/Slack resources, identities, RBAC assignments, or network topology into unrelated architectures.

The reusable template describes an **illustrative assumption**: workload compute in a subnet accesses a regional data service through a private endpoint in a different subnet. Identity, image delivery, telemetry, and the external source are shown separately. It is not an Azure deployment recommendation. Replace every placeholder and remove any boundary or connection not evidenced by the real source.

## Profile Contract

| Element | Rule |
|---|---|
| Canvas | Responsive root `viewBox`, no root width/height; 1440x1100 is valid. White background stays white in dark documentation themes |
| Font | `Segoe UI, Arial, sans-serif`; roughly 30-36 units for the title, 22-26 for card names, 18-22 for supporting text on the large canvas |
| Readability | At a 700px embed, 18 viewBox units on a 1440-wide diagram become 8.75px. Treat 8px as an absolute floor, not a preferred reading size; aim for 10-12px or split the diagram |
| Spacing | Reserve card padding and connector corridors; do not route lines through labels or icons |
| Boundaries | Name the actual scope (tenant/subscription/resource group), global or regional placement, VNet, and subnet. Nest only real membership |
| Main flow | Number primary steps in reading order. Supporting RBAC, delivery, and telemetry are not request-path steps |
| Accessibility | Unique title/desc IDs, `role="img"`, `aria-labelledby`; meaningful external Markdown alt text describing the main path |
| Portability | No scripts, external CSS/fonts/images, remote `<use>`, or `foreignObject` in the deliverable SVG |

### Connector Semantics

| Meaning | Color | Pattern |
|---|---|---|
| Event / HTTPS request | `#0078d4` | Solid arrow |
| Private network / data access | `#107c10` | Solid arrow |
| RBAC authorization | `#8661c5` | Dashed arrow |
| Build / image delivery | `#d47c00` | Solid arrow |
| Telemetry | `#5f6b7a` | Dashed arrow |

Include all used meanings in a visible legend and label important connectors. Color alone must not carry meaning. Neutral surfaces/boundaries/text and **official icon colors/gradients are exempt** from the five-color semantic palette. The simple profile's YES/NO convention remains unchanged.

RBAC arrows describe a named principal's authorization at a target scope, not packets or runtime traffic. Label the real role and scope when known. Green does not prove a service is private: verify private endpoints, DNS, ingress/egress, and public-access configuration from the source. Global services do not belong inside a selected-region boundary merely because they serve a regional workload. Resource-group membership is not a network boundary.

## Official Icons

Source icons only from the [Azure Architecture Center official collection](https://learn.microsoft.com/en-us/azure/architecture/icons/). Read the current [icon terms](https://learn.microsoft.com/en-us/azure/architecture/icons/#icon-terms) before reuse: Microsoft permits architectural diagrams, training materials, and documentation; other rights are reserved. Do not claim the icons are covered by this repository's license.

1. Identify the exact product and use its official name next to the icon. Leave the neutral `icon` placeholder when unknown; it is not an imitation Azure icon.
2. Download the official collection for selection, but do not commit the archive or library. Embed only the icons actually used.
3. Prefer an `<image href="data:image/svg+xml;base64,...">` containing the **unchanged original SVG bytes**, with a square viewport and `preserveAspectRatio="xMidYMid meet"`. This keeps artwork, gradients, IDs, and internal references intact and isolated. The original icon must itself be self-contained. Do not crop, flip, rotate, recolor, distort, or simplify it.
4. An inline nested SVG/symbol is an alternative only if artwork remains unmodified and all IDs/references can be isolated without visual change. Repeated gradient IDs can corrupt unrelated icons; prefer the data-URI method when uncertain.
5. Do not let diagram CSS override icon fills or strokes. Official embedded gradients are allowed even though decorative diagram gradients are discouraged.
6. Add an SVG `<metadata>` attribution listing Microsoft, the official collection URL, downloaded version/date, original filenames, and the terms URL. Keep an adjacent documentation attribution as well. The template contains no official artwork and makes no claim otherwise.
7. Never use a Microsoft product icon as the logo for your own product.

Example attribution after embedding real icons (replace the bracketed fields):

```xml
<metadata>Icons: Microsoft Azure Architecture Icons, [version/date].
Source: https://learn.microsoft.com/azure/architecture/icons/
Files: [exact original filenames].
Terms: https://learn.microsoft.com/azure/architecture/icons/#icon-terms.
Original artwork embedded unmodified and uniformly scaled.</metadata>
```

## Overflow Prevention and Validation

1. Inventory the actual resources and edges first. Adapt the template's assumptions, names, and title/desc. Keep a gutter for every connection; do not use geometry to invent relationships.
2. Wrap long titles/descriptions with `<tspan x="..." dy="...">` lines. Avoid character-count-only heuristics, `textLength` compression, and shrinking text to force a fit: Segoe UI and Arial have different glyph widths.
3. Give each text-bearing card/boundary rectangle a unique ID. Attach `data-bounds="that-id"` and optional `data-padding="12"` to its `<text>` labels. Include equivalent bounds for free-standing connector labels when close to other objects. Keep these harmless attributes in the SVG for repeatable checks.
4. Parse XML with a real parser before rendering. Example with Python's standard library:

   ```powershell
   python -c "import xml.etree.ElementTree as E; E.parse(r'assets\templates\azure-architecture.svg'); print('XML OK')"
   ```

5. Render the actual SVG in a browser, wait for `document.fonts.ready`, and load `scripts/validate-svg.js` **into the test page only**, not the SVG asset. Call `await validateSvg(document.querySelector('svg'))`. The checker throws on parser errors, duplicate IDs, missing local URL/href/ARIA targets, external dependencies, missing text bounds, and measured overflow. It uses rendered `getBBox()` with screen transforms to compare text to the padded card, not string length. Embedded base64 SVG icons are recursively checked for XML, IDs, references, and self-containment; manually inspect their artwork too.
6. For browser automation that supports Playwright, a minimal harness is:

   ```javascript
   // Run in the automation process; paths refer to your local checkout.
   const fs = await import('node:fs/promises');
   const svg = await fs.readFile(svgPath, 'utf8');
   await page.setContent(`<body style="margin:0;background:#fff">${svg}</body>`);
   await page.addScriptTag({ path: checkerPath });
   await page.setViewportSize({ width: 1440, height: 1100 });
   console.log(await page.evaluate(() => validateSvg(document.querySelector('svg'))));
   ```

   If your browser tool cannot read local files or import Node modules, serve the checkout with `python -m http.server 18879 --bind 127.0.0.1 --directory "<absolute-checkout-path>"`. Fetch the SVG/checker from that server into an HTML test page; a standalone SVG document has no HTML head for `addScriptTag`. Stop the helper server afterward. Use an unused port and verify its response belongs to this checkout.

   For regression coverage, also load `scripts/validate-svg.test.js` into the same page and call `await runSvgValidationTests(document.querySelector('svg'))`. It verifies the baseline plus intentional overflow, broken references, external resources, invalid accessibility/dimensions, and embedded-icon cases without dependencies or a package install.

7. Repeat at 700px and the site's actual embed widths (including 375px mobile), and with the available fallback font. Capture and inspect full-canvas and embedded screenshots. Also test the SVG as an `<img>` as documentation normally embeds it, including a dark page background. Check connector crossings, arrow direction, label collisions, whitespace, and no clipping; the checker does not prove topology or catch every visual overlap.
8. Review reported `minimumRenderedFontPx`. If the embed is too small to read, split into overview/detail assets or provide a full-size link and caption explaining zoom. A large viewBox prevents layout cramming but does not magically make mobile text readable.
9. Rerun checks after every label, font, icon, or geometry change. Verify no missing/broken marker references or duplicate IDs. Report browser-unavailable or otherwise incomplete checks honestly.

## Delivery Examples

```markdown
![Events enter workload compute over HTTPS, then reach a data service through a private endpoint; separate arrows show authorization, delivery, and telemetry.](/img/workload-architecture.svg)

Detailed architecture; [open full-size diagram](/img/workload-architecture.svg) to read labels on narrow screens.
```

Representative prompts:

- "Replace this ASCII decision tree with SVG." Use the existing simple profile; no network nesting or Azure icon assumptions.
- "Draw our Azure topology with private endpoints and numbered flows." Select this profile, verify actual membership, adapt the template, and measure all text bounds.
- "Use the Service Health diagram's style for this different workload." Reuse visual conventions only, not the exemplar's resources or connections.
