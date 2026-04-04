# ElveBooking — Demo fishing sites for Norwegian beat owners

A collection of demo websites built for salmon beat owners in the Trøndelag region. Each demo showcases direct online booking capability as an alternative to third-party platforms.


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

- 👉 **Live:** [orkla-lakse-gård](https://orkla-fiske-booking.vercel.app)
- **Pages:** Home, About, Booking
- **Tone:** Luxury, sleek, exclusive
- **Features:** Beat selector, live price calculator, Vipps demo modal, NO/EN language toggle


<div align="center">
  <video src="https://github.com/user-attachments/assets/bd61a198-016f-42d8-a160-78083fc41a17" width="100%" controls autoplay loop muted></video>
</div>


---

### Demo 2 — Elveside Familiefiske (`demo-family-beat`)

Warm, personal aesthetic targeting small family-owned beat owners.

- 👉 **Live:** [orkla-elve-fiske-booking](https://orkla-elve-fiske-booking.vercel.app)
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
| Orkla Laksegård | `demo-premium-lodge` | Netlify | [orkla-lakse-gård](https://orkla-fiske-booking.vercel.app) |
| Elveside Familiefiske | `demo-family-beat` | Vercel | [orkla-elve-fiske-booking](https://orkla-elve-fiske-booking.vercel.app) |

---

© [Bithun](https://goldenbutter.github.io/Portfolio_EN/)
