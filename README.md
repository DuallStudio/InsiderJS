# InsiderJS

Custom JavaScript for the **Insider Madeira** Webflow site. Injected via Webflow's custom code panel.

## What it does

| Feature | Details |
|---|---|
| Loading screen | GSAP counter from 0→100 (3s first visit, 1s on return via sessionStorage) |
| Page transitions | Barba-style GSAP slide — `.transition` element animates on link click |
| Hover text effect | SplitType splits chars, GSAP staggers opacity randomly on `mouseenter` |
| Form modal | Open/close/reset — clears all fields, checkboxes, custom classes |
| Email modal | Pre-fills `#emailTo` with `info@insidermadeira.com` (read-only) |
| Insider Tips | Injects cloned `.tip-content` elements between blog cards every 2 posts |
| Arrow icon fix | Stacks `.white-arrow` / `.black-arrow` in CSS grid so they overlay correctly |

## Dependencies (loaded via Webflow / CDN)

- **GSAP** — animations and timelines
- **jQuery** (`$`) — DOM helpers and event binding
- **SplitType** — splits text into chars for hover animation
- **Lottie** — arrow icon animations (`.arrow-icon`)
- **Webflow** — `Webflow.push()` lifecycle hook

## Usage

Paste `script.js` into Webflow → Site Settings → Custom Code → Footer Code (or per-page).

## Notes

- Loading screen uses `sessionStorage` to detect return visits and skip most of the animation.
- Page transitions intercept same-host `<a>` clicks, excluding `#` anchors and `target="_blank"` links.
- The hover text effect only runs on viewports ≥ 991px.
- The arrow icon fix injects a `<style>` tag at runtime — no class changes needed in Webflow.
