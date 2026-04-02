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
├── demo-premium-lodge/     # Orkla Laksegård — premium lodge aesthetic
└── (more demos coming)
```

## Demos

### demo-premium-lodge — Orkla Laksegård
Dark, premium aesthetic targeting high-end salmon fishing clients.

- 👉 **LIVE website :**  [orklaelvefiskebooking](https://orklaelvefiskebooking.netlify.app)
- **Pages:** Home, About, Booking
- **Features:** Season date picker, live price calculator, Vipps demo modal, NO/EN language toggle

<!-- Add demo video here -->

---

## Development

No build step required. Open any `index.html` directly in a browser or use a local server:

```bash
npx serve demo-premium-lodge
```

## Deployment

Each demo is deployed as a separate Netlify site from this repo, pointing to its own subfolder as the publish directory.

| Demo | Publish Directory | Live URL |
|---|---|---|
| demo-premium-lodge | `demo-premium-lodge` | [orklaelvefiskebooking](https://orklaelvefiskebooking.netlify.app) |

---

© [Bithun](https://goldenbutter.github.io/Portfolio_EN/)
