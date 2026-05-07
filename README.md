# SVG Technical Diagrams Skill

> Reusable skill for creating professional SVG diagrams to replace ASCII art, text-based diagrams, and low-quality images in documentation sites.

## When to Use

- Replace ASCII art (`┌──┐`, `│`, `└──┘`) with proper vector diagrams
- Create architecture diagrams, decision trees, flowcharts, comparison visuals
- Generate responsive, dark-mode compatible illustrations for docs sites (Docusaurus, MkDocs, Hugo, etc.)

## Design System

### Color Palette (Azure-inspired, universally professional)

| Purpose | Fill | Stroke | Use for |
|---------|------|--------|---------|
| Primary containers | `#dae8fc` | `#6c8ebf` | Main groups, cloud zones |
| Success/positive | `#d5e8d4` | `#82b366` | User-owned, healthy, YES |
| Warning/secondary | `#fff2cc` | `#d6b656` | Components, attention |
| Accent/services | `#e1d5e7` | `#9673a6` | Nodes, instances, services |
| Error/negative | `#f8cecc` | `#b85450` | Errors, NO, deprecated |
| Neutral | `#f5f5f5` | `#666666` | Backgrounds, sub-groups |

### Typography

```
font-family="Segoe UI, Arial, sans-serif"
```

- Titles: `font-size="14"`, `font-weight="bold"`
- Labels: `font-size="12"`, `font-weight="bold"`
- Descriptions: `font-size="10"`, `fill="#555"`
- Small text: `font-size="8"` (inside badges/pods)

### Shape Rules

- Rounded rectangles: `rx="8"` for containers, `rx="6"` for components, `rx="4"` for small items
- Minimum padding: 15px inside containers
- Gap between sibling elements: 20-30px
- Stroke width: `2` for main borders, `1.5` for components, `1` for details

### Arrows & Connectors

```xml
<!-- Arrow marker definition (include once per SVG) -->
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" 
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
  </marker>
</defs>

<!-- Solid connection -->
<line x1="..." y1="..." x2="..." y2="..." stroke="#666" stroke-width="1.5" marker-end="url(#arrow)"/>

<!-- Dashed connection (managed/control) -->
<line x1="..." y1="..." x2="..." y2="..." stroke="#666" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
```

### Decision Tree Convention

- YES paths: `stroke="#2e7d32"` (green), go left or down-left
- NO paths: `stroke="#c62828"` (red), go right or down-right
- Question boxes: blue fill (`#dae8fc`)
- Answer boxes: green fill (`#c8e6c9`)
- Intermediate questions: orange fill (`#fff3e0`)

## Templates

### Architecture Diagram

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="Segoe UI, Arial, sans-serif">
  <!-- Outer container (cloud/managed zone) -->
  <rect x="20" y="20" width="560" height="160" rx="12" fill="#dae8fc" stroke="#6c8ebf" stroke-width="2"/>
  <text x="300" y="48" text-anchor="middle" font-weight="bold" font-size="14" fill="#1a3a5c">Zone Title</text>

  <!-- Inner container -->
  <rect x="50" y="60" width="500" height="100" rx="8" fill="#f8f9fa" stroke="#888" stroke-width="1.5"/>
  <text x="300" y="82" text-anchor="middle" font-weight="bold" font-size="12" fill="#333">Component Group</text>

  <!-- Components inside -->
  <rect x="70" y="95" width="100" height="45" rx="6" fill="#fff2cc" stroke="#d6b656" stroke-width="1.5"/>
  <text x="120" y="122" text-anchor="middle" font-size="11" fill="#333">Component A</text>
</svg>
```

### Decision Tree / Flowchart

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 280" font-family="Segoe UI, Arial, sans-serif">
  <!-- Question node -->
  <rect x="130" y="10" width="300" height="50" rx="8" fill="#dae8fc" stroke="#6c8ebf" stroke-width="2"/>
  <text x="280" y="40" text-anchor="middle" font-size="12" fill="#1a3a5c">Your question here?</text>

  <!-- YES branch -->
  <line x1="200" y1="60" x2="120" y2="110" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="140" y="82" font-size="11" fill="#2e7d32" font-weight="bold">YES</text>

  <!-- Answer node -->
  <rect x="30" y="115" width="180" height="45" rx="8" fill="#c8e6c9" stroke="#2e7d32" stroke-width="2"/>
  <text x="120" y="138" text-anchor="middle" font-weight="bold" font-size="12" fill="#1b5e20">Answer</text>
  <text x="120" y="152" text-anchor="middle" font-size="10" fill="#555">Description</text>

  <!-- Arrow marker -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
    </marker>
  </defs>
</svg>
```

### Comparison / Side-by-Side

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" font-family="Segoe UI, Arial, sans-serif">
  <!-- Option A -->
  <rect x="20" y="20" width="260" height="160" rx="10" fill="#d5e8d4" stroke="#82b366" stroke-width="2"/>
  <text x="150" y="50" text-anchor="middle" font-weight="bold" font-size="14" fill="#2d5a1b">Option A</text>
  <text x="150" y="75" text-anchor="middle" font-size="11" fill="#333">Benefit 1</text>
  <text x="150" y="95" text-anchor="middle" font-size="11" fill="#333">Benefit 2</text>

  <!-- VS separator -->
  <text x="300" y="105" text-anchor="middle" font-size="16" fill="#666" font-weight="bold">vs</text>

  <!-- Option B -->
  <rect x="320" y="20" width="260" height="160" rx="10" fill="#fff2cc" stroke="#d6b656" stroke-width="2"/>
  <text x="450" y="50" text-anchor="middle" font-weight="bold" font-size="14" fill="#7a5900">Option B</text>
</svg>
```

## Integration Rules

1. **Save location**: `static/img/` (or equivalent static assets folder)
2. **Reference in Markdown**: `![Alt text](/img/diagram-name.svg)`
3. **Naming**: `kebab-case` — e.g., `aks-architecture.svg`, `cni-decision-tree.svg`
4. **ViewBox**: Always use `viewBox` without fixed `width`/`height` on the root `<svg>` for responsiveness
5. **No external dependencies**: Everything self-contained (no external fonts, no linked images)
6. **Dark mode**: Use fill colors that invert well, or add CSS media queries:

```xml
<style>
  @media (prefers-color-scheme: dark) {
    .bg { fill: #1e1e1e; }
    .text { fill: #e0e0e0; }
  }
</style>
```

## Prompt to Use

When you need diagrams in any project, use this instruction:

> "Replace all ASCII art and text-based diagrams with professional inline SVGs. Follow the SVG Technical Diagrams skill: use the Azure-inspired color palette, Segoe UI font, rounded rectangles, proper arrow markers, and save as responsive SVGs in static/img/. For decision trees use green=YES/red=NO convention. Keep it clean, minimal, and professional."

## Anti-patterns

- ❌ Don't use fixed pixel width/height on root SVG (breaks mobile)
- ❌ Don't use external font links (breaks offline)
- ❌ Don't use complex gradients or shadows (slow rendering, bad in dark mode)
- ❌ Don't put text smaller than 8px (unreadable)
- ❌ Don't use more than 4-5 colors per diagram (visual noise)
- ❌ Don't make diagrams wider than 700px viewBox (overflow on mobile)
