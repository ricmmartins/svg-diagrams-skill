---
name: svg-diagrams
description: Create professional, responsive, self-contained SVG technical diagrams for documentation and blogs. Use this skill whenever the user asks to replace ASCII art, text diagrams, architecture sketches, flowcharts, decision trees, comparison visuals, or low-quality diagram images with SVG. Use the azure-architecture profile for detailed Azure architecture diagrams with scope boundaries, numbered flows, official icon guidance, and measured text layout.
---

# SVG Technical Diagrams

Create self-contained SVG diagrams that render cleanly in documentation sites such as Hugo, Docusaurus, and MkDocs.

## Prerequisites

Read the source architecture and the destination site's image conventions. No cloud authentication, Azure provisioning, or MCP server is required. Final layout validation requires a browser with SVG support; use available browser automation or browser developer tools.

## Workflow

1. Read the source diagram and surrounding prose to preserve its meaning. Inventory nodes, relationships, direction, and actual scope/network membership; do not infer membership from proximity.
2. Identify the site's static asset directory and existing SVG conventions.
3. Select a profile: keep **simple** (below) for compact flowcharts, decisions, and comparisons. Use **azure-architecture** for detailed Azure topology or when explicitly requested; read [Azure architecture guidance](references/AZURE_ARCHITECTURE.md) and adapt [the structural template](assets/templates/azure-architecture.svg). The template is not a deployable reference architecture.
4. Create a responsive SVG with a `viewBox`, no fixed root width or height, `role="img"`, and unique `<title>`/`<desc>` IDs referenced by `aria-labelledby`.
5. Wrap labels using explicit `<tspan>` lines. Measure rendered `getBBox()` against card bounds after fonts load; adjust wrapping, spacing, or geometry until nothing clips. Character counts alone are insufficient.
6. Replace the source diagram with Markdown image syntax and meaningful alt text. Preserve or improve the original caption separately.
7. Validate XML, IDs, local references, self-containment, and text bounds using [the browser checker](scripts/validate-svg.js). Inspect the rendered output at full and embedded widths, including the actual documentation image context. Recheck the source inventory so every original relationship remains represented.

## Simple Profile (Default)

- Use `font-family="Segoe UI, Arial, sans-serif"`.
- Use rounded rectangles with clear spacing and no external dependencies.
- Keep diagrams at or below a 700px-wide viewBox when practical.
- Use no more than five main colors:
  - Primary: fill `#dae8fc`, stroke `#6c8ebf`
  - Success: fill `#d5e8d4`, stroke `#82b366`
  - Warning: fill `#fff2cc`, stroke `#d6b656`
  - Accent: fill `#e1d5e7`, stroke `#9673a6`
  - Error: fill `#f8cecc`, stroke `#b85450`
- Use proper reusable arrow markers; green for YES and red for NO in decision trees.
- Keep text at 8px or larger, and verify its effective size at the intended embed width.
- Avoid gradients, complex shadows, external fonts, linked images, and fixed root dimensions.

## Azure Architecture Profile

Use a white background, larger viewBox when necessary (for example 1440x1100), readable typography, numbered primary flow, and an explicit five-category connector legend. Blue represents event/HTTPS; green private/data; purple dashed RBAC; orange build/image; grey dashed telemetry. Neutral boundaries and official icon colors are exempt from this semantic palette. Official icons may retain their original gradients.

Draw nested scope, region, virtual-network, and subnet boundaries only when supported by the real architecture. PaaS services reached through private endpoints generally remain outside the subnet; put only the endpoint NIC inside. Do not imply that an identity, global resource, or deployment tool resides in a VNet.

Use labeled icon placeholders until the exact Azure products are known. If icons are needed, embed only the required official, unmodified artwork under Microsoft's terms, with source attribution; follow [icon guidance](references/AZURE_ARCHITECTURE.md#official-icons). Never invent product logos or bundle the entire icon library.

## Output

- Save assets in the site's existing static image directory, normally `static/img/` or `img/`.
- Use kebab-case filenames.
- Reference the asset as `![Descriptive alt text](/img/diagram-name.svg)`.
- Example alt text: "Events reach workload compute over HTTPS; private endpoint traffic reaches the data service; separate paths show authorization, image delivery, and telemetry."
- Report the output path, profile used, and any unverified layout or source assumptions.

## Error Handling

| Problem | Action |
|---|---|
| No static asset directory exists | Follow the site's current image convention; check before inventing a new structure |
| Source architecture is ambiguous | Preserve supported relationships only; flag unresolved scope or networking rather than inventing it |
| SVG validation fails | Fix malformed XML, duplicate IDs, unescaped characters, external dependencies, or missing references |
| Text does not fit | Wrap with tspans, enlarge the card/viewBox, or shorten without changing meaning; measure again |
| Diagram becomes unreadable when embedded | Split into overview/detail diagrams or provide a full-size link; do not keep shrinking text |
| Browser is unavailable | Validate XML and references separately, explicitly report rendered bounds and visual checks as unverified |
| Official icon terms or source are unavailable | Keep neutral labeled placeholders; do not substitute unofficial artwork |

## Post-Run Reflection

Review whether the profile preserved the architecture and whether measured layout exposed reusable improvements. Record only task-relevant improvements with user permission; do not assume an unrelated plugin's shared protocols are installed.

## References (Load on Demand)

| Reference | Purpose |
|---|---|
| [README.md](README.md) | Installation, original simple palette, templates, and usage |
| [Azure architecture guidance](references/AZURE_ARCHITECTURE.md) | Detailed profile, official icon terms, overflow workflow, exemplar |
| [Structural SVG template](assets/templates/azure-architecture.svg) | Adaptable layout with labeled icon placeholders |
| [Browser checker](scripts/validate-svg.js) | Dependency-free rendered geometry and reference checks |
