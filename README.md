# ElveBooking — Demo fishing sites for Norwegian beat owners

A collection of demo websites built for salmon beat owners in the Trøndelag region. Each demo showcases direct online booking capability as an alternative to third-party platforms.


<div align="center">
  <video src="https://github.com/user-attachments/assets/dc058982-5105-4f6b-ad56-6a33dd15e043" width="100%" controls autoplay loop muted></video>
</div>


## Purpose

These demos are shown to potential clients to demonstrate what a professional booking website can look like for their beat. When a client signs up, their demo becomes their real site — with their own photos, prices, and branding.

## Tech Stack

- Pure HTML, CSS, and vanilla JavaScript
- No frameworks, no build tools, no dependencies
- Google Fonts via CDN
- Deployed on Netlify (one site per demo)

## Project Structure

```
orklaElveFiskeBooking/
├── shared/                  # Shared assets (Vipps modal, favicon)
├── demo-premium-lodge/      # Demo 1 — Orkla Laksegård (premium lodge)
└── demo-family-beat/        # Demo 2 — Elveside Familiefiske (family beat)
```

---

## Demos

### Demo 1 — Orkla Laksegård (`demo-premium-lodge`)

Dark, premium aesthetic targeting high-end salmon fishing lodge clients.

- 👉 **Live:** [orklaelvefiskebooking.netlify.app](https://orklaelvefiskebooking.netlify.app)
- **Pages:** Home, About, Booking
- **Tone:** Luxury, sleek, exclusive
- **Features:** Beat selector, live price calculator, Vipps demo modal, NO/EN language toggle

---

### Demo 2 — Elveside Familiefiske (`demo-family-beat`)

Warm, personal aesthetic targeting small family-owned beat owners.

- 👉 **Live:** `<!-- ADD VERCEL URL HERE -->`
- **Pages:** Home, Booking, About, Gallery
- **Tone:** Warm, approachable, personal — "come fish with us"
- **Features:** Availability calendar, pricing cards, FAQ accordion, lightbox gallery, Vipps demo modal, NO/EN language toggle

#### Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, welcome section, offer cards, season strip, testimonial |
| Booking | `booking.html` | 6 pricing cards, JS availability calendar (May 15–Sep 15), FAQ |
| About | `about.html` | Family story, photo grid, river info, values |
| Gallery | `gallery.html` | 12-image masonry grid with lightbox |
| 404 | `404.html` | Custom friendly error page |

#### Design

| Property | Value |
|---|---|
| Fonts | Playfair Display (headings) + Source Sans 3 (body) |
| Primary colour | `#5B7F4A` (forest green) |
| Accent colour | `#C17F3E` (warm amber) |
| Background | `#FAF7F2` (warm off-white) |
| Max width | 1100px |
| Breakpoint | 768px (mobile) |

#### Local images (`demo-family-beat/assets/images/`)

| File | Used in |
|---|---|
| `fishing-norway.jpg` | Homepage hero, gallery |
| `welcome-fishing.jpg` | Homepage welcome section, gallery |
| `village-river.jpg` | Homepage welcome section (desktop), gallery |
| `cabin-exterior.jpg` | About photo grid, gallery |
| `river-evening.jpg` | About page banner, gallery |
| `river-morning.jpg` | About river section, gallery |
| `rod-autumn.jpg` | About photo grid, gallery |
| `rod-sunset.jpg` | Gallery |
| `salmon-on-grass.jpg` | Gallery |
| `trout-hands.jpg` | Gallery |
| `river-aerial.jpg` | Gallery banner, gallery |
| `norwegian-nature.jpg` | Gallery |

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
| Orkla Laksegård | `demo-premium-lodge` | Netlify | [orklaelvefiskebooking.netlify.app](https://orklaelvefiskebooking.netlify.app) |
| Elveside Familiefiske | `demo-family-beat` | Vercel | `<!-- ADD VERCEL URL HERE -->` |

---

© [Bithun](https://goldenbutter.github.io/Portfolio_EN/)
