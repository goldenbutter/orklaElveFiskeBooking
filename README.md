# ElveBooking — Demo fishing sites for Norwegian beat owners

A collection of demo websites built for salmon beat owners in the Trøndelag region. Each demo showcases direct online booking capability as an alternative to third-party platforms.


## Purpose

These demos are shown to potential clients to demonstrate what a professional booking website can look like for their beat. When a client signs up, their demo becomes their real site — with their own photos, prices, and branding.

## Tech Stack

- Pure HTML, CSS, and vanilla JavaScript
- No frameworks, no build tools, no dependencies
- Google Fonts via CDN
- Deployed on Vercel

## Project Structure

```
orklaElveFiskeBooking/
├── README.md
├── demo-premium-lodge/              # Demo 1 — Orkla Laksegård
│   ├── index.html
│   ├── booking.html
│   ├── about.html
│   ├── dashboard.html               # Owner-only dashboard (admin gated)
│   ├── 404.html
│   ├── favicon.svg                  # Gold fish hook (Vercel project icon)
│   ├── css/
│   │   ├── style.css                # Imports only
│   │   ├── base.css                 # Variables, reset, typography
│   │   ├── nav.css                  # Navigation + sticky booking bar
│   │   ├── hero.css                 # Hero section
│   │   ├── sections.css             # All content sections + footer
│   │   ├── booking.css              # Booking form + stepper
│   │   ├── modal.css                # Vipps demo modal
│   │   ├── auth.css                 # Login/register modal
│   │   ├── dashboard.css            # Owner dashboard layout + charts
│   │   └── responsive.css           # Media queries
│   ├── js/
│   │   ├── app.js                   # Init entry point
│   │   ├── translations.js          # NO/EN translation strings
│   │   ├── language.js              # Language toggle logic
│   │   ├── nav.js                   # Navigation + hamburger
│   │   ├── animations.js            # Scroll animations + stats counter
│   │   ├── booking.js               # Beat data, pricing, booking logic
│   │   ├── modal.js                 # Vipps demo modal + checkout gate
│   │   ├── auth.js                  # Simulated auth (customer + admin roles)
│   │   ├── data-store.js            # Async data layer (Supabase-ready)
│   │   ├── mock-data.js             # 40 demo bookings
│   │   └── dashboard.js             # KPIs + SVG charts + bookings table
│   └── assets/
│       ├── images/                  # 11 local jpg files
│       └── videos/                  # Hero video (mp4) + preview gifs
│
└── demo-family-beat/                # Demo 2 — Elveside Familiefiske
    ├── index.html
    ├── booking.html
    ├── about.html
    ├── gallery.html
    ├── 404.html
    ├── favicon.svg                  # Green fish (Vercel project icon)
    ├── css/
    │   └── style.css                # All styles in one file
    ├── js/
    │   └── main.js                  # All JS in one file
    └── assets/
        └── images/                  # 17 local jpg files
```

---

## Demos

### Demo 1 — Orkla Laksegård (`demo-premium-lodge`)

Dark, premium aesthetic targeting high-end salmon fishing lodge clients.

- 👉 **Live:** [demo-premium-lodge.ibithun.com](https://demo-premium-lodge.ibithun.com)
- **Pages:** Home, About, Booking, Dashboard (owner-only)
- **Tone:** Luxury, sleek, exclusive
- **Features:** Beat selector, live price calculator, Vipps demo modal, NO/EN language toggle, customer login/registration, owner dashboard with KPIs and SVG charts
- **Demo owner login:** `owner` / `lodge2026`


<div align="center">
  <video src="https://github.com/user-attachments/assets/bd61a198-016f-42d8-a160-78083fc41a17" width="100%" controls autoplay loop muted></video>
</div>


---

### Demo 2 — Elveside Familiefiske (`demo-family-beat`)

Warm, personal aesthetic targeting small family-owned beat owners.

- 👉 **Live:** [demo-family-beat.ibithun.com](https://demo-family-beat.ibithun.com)
- **Pages:** Home, Booking, About, Gallery
- **Tone:** Warm, approachable, personal — "come fish with us"
- **Features:** Availability calendar, pricing cards, FAQ accordion, lightbox gallery, Vipps demo modal, NO/EN language toggle


<div align="center">
  <video src="https://github.com/user-attachments/assets/03b1a2b1-b792-4506-8858-2de37a90f801" width="100%" controls autoplay loop muted></video>
</div>


---

## Development

No build step required. Open any `index.html` directly in a browser, or use a local server:

```bash
# Demo 1
npx serve demo-premium-lodge

# Demo 2
npx serve demo-family-beat
```

## Deployment

Each demo deploys as a separate site pointing to its own subfolder as the publish directory.

| Demo | Folder | Platform | Live URL |
|---|---|---|---|
| Orkla Laksegård | `demo-premium-lodge` | Vercel | [demo-premium-lodge.ibithun.com](https://demo-premium-lodge.ibithun.com) |
| Elveside Familiefiske | `demo-family-beat` | Vercel | [demo-family-beat.ibithun.com](https://demo-family-beat.ibithun.com) |

---

© [Bithun](https://portfolio.ibithun.com/)
