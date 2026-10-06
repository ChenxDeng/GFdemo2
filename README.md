# QIQC Challenge website

Public English event site for GaugeForge. No registration backend, analytics, external fonts or model credentials. Participation links open an email draft; nothing is submitted automatically.

## Run locally

Requires Node.js 20 or newer. No package installation is necessary.

```bash
npm run build
npm start
```

Open http://127.0.0.1:4173. To use a different port in PowerShell, set `$env:PORT='4174'` before `npm start`.

## Content and build

`generate.mjs` and `src/` are the complete editable public website source. `src/facts.json` is its public fact snapshot; `npm run build` regenerates the HTML from this configuration. In the founder delivery workspace, the authoritative `event-facts.json` and `tools/build.mjs` regenerate the public snapshot, documents and posters together. Synchronize any standalone fact change back to the founder master before the next complete release. Edit page copy in `generate.mjs`, not in generated `src/index.html`.

Build output is `dist/`. Only `dist/` may be deployed. It contains no internal execution manual, research checkout, hidden benchmark materials or test answers. `build.mjs` uses an explicit source allowlist and does not traverse parent folders.

## GitHub demo

The `main` branch contains the complete source and the current built `dist/` snapshot. GitHub Pages publishes only `dist/` through `.github/workflows/pages.yml`. The repository Pages source must be GitHub Actions. Before pushing any future edits, run `npm run build` to update that snapshot.

## Cloudflare Pages

Connect this repository to Pages; build command `npm run build`; output directory `dist`; Node 20 or newer. Alternatively use the official Wrangler CLI for direct upload: `npx wrangler pages deploy dist --project-name qiqc-challenge` after authenticating and creating the project. Keep the project and custom-domain operation within the authorized GaugeForge event scope.

Add `challenge.r-era.ai` in Pages Custom domains before creating the corresponding CNAME at the current DNS provider. Use the actual assigned Pages hostname; never guess it. Preserve all unrelated DNS and email records. Verify DNS, HTTPS, page content and links before switching poster QR codes to the challenge domain.

## Source attribution

Original analytical Rabi calibration illustration, generated for this event. It shows a dimensionless driven two-level model, not measured data or benchmark performance. Quantum-Harbor technical interfaces checked at `1f03d78e959cf02469568250f61f9af88a53146f`; repository code remains MIT. Event AGPL requirements apply to entrant harnesses, not automatically to all website content or upstream assets.

## Design targets

Mobile 4G and desktop; public indexable static HTML. Targets: WCAG 2.2 AA, mobile p75 LCP <= 2.0 s, INP <= 200 ms, CLS <= 0.1; JS <= 30 KB uncompressed; Lighthouse accessibility >= 95 and performance >= 90. These are targets, not field measurements. Accessibility owner: event frontend maintainer. Keyboard navigation, mobile layout and link behavior are covered in the delivered Playwright verification.

## Homepage background and guided examples

The homepage introduces Agentic Quantum Coding Challenge by name, then a description and subordinate slogan. One essentials area groups the timeline, eligibility, team size, participation steps and Register now button alongside a decorative Rabi field anchored to the upper-right corner. The field occupies at most 60vw × 370px on desktop and fades toward its left and bottom edges; it does not extend beneath the timeline. Prize amounts and conditions are in the homepage participation area. The next section contains detailed rules and interactive examples. The registration CTA uses the configured URL when available; otherwise it opens an accessible dialog explaining that the form is coming soon, with an organizer email link. Opening the dialog or an email draft does not register a team. The header Task link leads to task details in the next section; there is no Rules teaser at the bottom of the homepage. Navigation aligns each target section’s top boundary with the live sticky-header bottom, retaining the section’s divider and natural spacing above its heading. Negative section offsets are removed. Clicks, direct hashes and browser history share this positioning; the menu closes before measurement. Content wraps naturally instead of using clipped fixed-height panels.

The canvas recomputes the ideal two-level probability as drive amplitude sweeps between 0.7 and 1.3 times a fixed reference every 20 presentation seconds. Each frame is a separate constant-amplitude experiment, not a varying drive within one pulse. With `a = Ω/Ωref`, `u = duration/Tref`, `d = detuning/Ωref`, and `Tref = 2π/Ωref`, the model is `P = a²/(a²+d²) × sin²(π × sqrt(a²+d²) × u)`. At `a=1` this matches the original static map. Pointer coordinates are relative to the corner illustration, and reveal interaction stops outside it. The full canvas spans u=0…3.5 and d=+2.4…−2.4.

The ambient layer is 42% opacity; a feathered pointer lens reaches full opacity at its center. These are decorative display opacities, not a probability scale. A broad elliptical page wash and glyph-shaped text shadows protect text without rectangular backplates; pointing directly at protected content suppresses the lens. Title lines use the reference page’s bounded 8px / 4.8px pointer shift with a 350ms easing transition. Dragging a text selection suspends title motion; selected text uses the reference lime #b4f889 background and forest #122d20 ink. No axes, numerical probability tooltip or scientific measurement claim is shown on the decorative background. Reduced-motion preferences disable autoplay. Rendering stops offscreen and in hidden tabs.

Task opens with the shared HY4 model and the goal of improving the harness. Task descriptions and public/hidden task counts sit on the left; four directly selectable circles on the right explain Understand, Plan, Experiment and Verify. There is no surrounding demo card, Next step, Reset or simulated attempt counter. The circles are accessible tabs with arrow-key, Home and End navigation. The separate Evaluation section explains Rules and Results, including the real three-evaluation allowance, evidence checks, award conditions and explicitly proposed scoring/review details. These illustrative explanations make no model calls or submissions. The header links to Task and Evaluation; legacy Rules and Challenge Journey hashes resolve to their replacement sections.

Edit markup in `generate.mjs` and behavior/styles in `src/`, then run `npm run build`.

The desktop hero follows the supplied reference image: two large title lines, a short introduction, a permanently lime-highlighted slogan, a shallow upper-right field, and an open, borderless participation area with a connected three-date timeline. The participation area has no divider between Who can join and How to join; later sections use white backgrounds. Caption hover behavior and title motion remain active.

The latest homepage reference uses a full-width desktop content area: title and introduction on the left, timeline at 80% of the content width, Who/How columns aligned with their prize columns, and the registration CTA at the far right. Existing interactive title, Rabi field, caption reveal and prize count-up behavior are preserved.

The homepage uses a single set of title, introduction and slogan elements. A sticky scroll stage smoothly moves and scales that same text from the center into the original upper-left layout; the background field begins across the full opening viewport and shrinks into its original upper-right position as the participation details appear. Reverse scrolling reverses the movement. Prize counters start only once the opening-to-overview transition has finished and at least 75% of the amount is in the unobstructed viewport. They wait at zero beforehand and pause their elapsed animation time whenever scrolled out of view, returned to the opening, or in a hidden tab. Completed counters do not replay. Reduced-motion shows the complete static layout. Native scrolling and section navigation remain available; no wheel events are intercepted.

Key labels, timeline dates, prizes and section headings use GFdemo1-style bounded pointer movement on inner text surfaces (4px horizontal, 2.4px vertical), preserving the outer scroll layout and selection. Buttons and navigation have matching forest/lime hover feedback. Task explanations use a 110ms exit followed by a 380ms entry; rapid choices resolve to the latest selected content. Registration and FAQ disclosure animate gently. Reduced-motion preferences skip these effects.

The TIMELINE rail is a date-driven progress bar with one current-date marker. Hovering or focusing that marker shows an English status tooltip; before the start it reads “The competition has not started yet.” Escape dismisses the tooltip. It uses the current UTC+8 calendar date from November 8 (0%) to November 12 (100%), with November 10 at 50%. Before the start it remains at 0% and shows a countdown; after Demo Day it remains at 100%. The bar updates once per minute and when the page becomes visible. It describes calendar-date progress, not the unpublished exact event times.

The opening and overview share one Rabi canvas and one animation phase. Scroll progress scales its visual layer from the available viewport to the original corner size without reallocating the simulation. Pointer coordinates follow the transformed bounds, while protected text continues to suppress the full-opacity lens. A feathered mask and broad text wash follow the transition.
