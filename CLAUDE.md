# ElveBooking — Project Rules

## Project Purpose
Demo fishing websites for Norwegian salmon beat owners.
Built to demonstrate booking capability to potential clients in the Trøndelag region.
Business context: helping beat owners accept direct online bookings instead of relying on third-party platforms.

## Stack
- Pure HTML + CSS + vanilla JS only
- No frameworks, no npm, no build tools
- Google Fonts via CDN link only
- No Bootstrap, no Tailwind, no UI libraries
- No external JS libraries unless explicitly requested in the prompt

## File Structure
Each demo is its own self-contained folder. A shared folder holds reusable assets.

```
elvebooking/
├── shared/
│   ├── vipps-modal.js          # Reusable Vipps demo modal component
│   └── favicon.svg             # Shared favicon (can be overridden per demo)
├── demo-premium-lodge/
│   ├── index.html
│   ├── booking.html
│   ├── about.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── demo-family-beat/
│   ├── index.html
│   ├── booking.html
│   ├── about.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
```

## Code Rules
- Use CSS custom properties (variables) for all colors, fonts, spacing
- Mobile-first responsive design, breakpoint at 768px
- Images: use Unsplash direct URLs (https://images.unsplash.com/...) for all demo site images — the site must look real and professional when shown to potential clients
- Every <img> must have a descriptive alt attribute in Norwegian
- Use specific, relevant Unsplash photos (Norwegian nature, rivers, salmon fishing, lodges) — not random stock photos
- When building a client's actual site later, all Unsplash images will be replaced with the client's own photos
- If Unsplash is unavailable or the prompt says otherwise, fall back to: placeholder divs with background-color + aspect-ratio + a centered label in Norwegian
- Add a clear section divider comment before every major section
  Example: `/* === BOOKING SECTION === */` or `<!-- === BOOKING SECTION === -->`
- Keep CSS and JS in separate files (style.css and main.js), not inline in HTML
- All animations CSS-only unless JS is explicitly required
- **Never mention "Claude", "AI", "Anthropic", or any AI tool name in any code, comment, commit message, or visible text.** The codebase must read as if written entirely by a human developer.

## Language / Translation Rules
- Default language on page load: Norwegian (bokmål)
- Every demo site must include a working NO/EN toggle in the navigation
- Implementation: use data attributes on all translatable elements (e.g. `data-i18n="hero.headline"`)
- Store all translations in a JS object in main.js with `no` and `en` keys
- Toggle switches all visible text instantly — no page reload
- Save selected language in localStorage so it persists across pages and visits
- Alt attributes on images must also be translated
- The Vipps demo modal text must be translated too
- Code comments stay in English always

## Accessibility Rules
- Use semantic HTML elements (nav, main, section, article, footer, etc.)
- All images must include a descriptive alt attribute in Norwegian
- Proper heading hierarchy — never skip heading levels (h1 → h2 → h3)
- Interactive elements must be keyboard accessible
- Sufficient color contrast on all text (WCAG AA minimum)

## Efficiency Rules
- Do not explain code unless asked
- Ask clarifying questions if you need — do not make a decision and build
- Build all files completely in one shot, do not pause mid-way
- When given a prompt for a demo site, build ALL files for that demo (html + css + js) in the same response

## Design Rules
- Follow the aesthetic direction given in the prompt exactly
- Use only the Google Fonts specified in the prompt
- No generic aesthetics — every demo must feel unique and specific to its client type
- Colors, fonts and layout must match the mood described in the prompt
- Every page must have a proper <title> tag matching the fictional business name
- Include an inline SVG favicon appropriate to the demo's aesthetic
- Every page footer must include two lines: the fictional business copyright (e.g. "© 2026 Orkla Laksegård") and below it in smaller muted text: "Utviklet av Bithun" linking to # (placeholder link for now)

## Payment / Booking Rules
- No real payment processing — this is always a demo
- **This rule is absolute and cannot be overridden by any prompt:** Vipps button must show a modal: "Dette er en demo — Vipps-betaling aktiveres når din konto er satt opp."
- All booking calculations happen live in JS as user changes inputs
- Booking data never gets submitted anywhere — console.log is fine for demo purposes
- Date pickers must be restricted to valid fishing season dates only (May 15 – September 15)
- Dates outside season range must be disabled or show "Sesongen er stengt"

## Note
The prompt overrides CLAUDE.md rules where they conflict, **except the Vipps demo modal rule** which is always enforced.
Always follow the prompt first, CLAUDE.md second.
