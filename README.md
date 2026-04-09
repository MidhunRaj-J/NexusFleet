# NexusFleet

<p align="center">
  <img src="src/assets/logo-wordmark.svg" alt="NexusFleet wordmark" width="520" />
</p>

NexusFleet is a role-based logistics experience where customers book deliveries, travelers monetize routes, and admins manage trust operations in one modern React + Vite app.

[![Stars](https://img.shields.io/github/stars/MidhunRaj-J/NexusFleet?style=social)](https://github.com/MidhunRaj-J/NexusFleet/stargazers)
![License](https://img.shields.io/github/license/MidhunRaj-J/NexusFleet)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
[![Build](https://img.shields.io/github/actions/workflow/status/MidhunRaj-J/NexusFleet/ci.yml?branch=main&label=build)](https://github.com/MidhunRaj-J/NexusFleet/actions)

## Why NexusFleet Exists

Most local delivery flows break because booking, route intelligence, and trust workflows are scattered across disconnected tools.

NexusFleet combines:

- Customer booking and pricing
- Traveler route publishing and fulfillment
- Admin KYC and dispute operations
- Escrow-inspired payment lifecycle

The goal is simple: make community logistics fast, transparent, and operationally safer.

## Core Capabilities

- Role-based pages for Customer, Traveler, and Admin
- Dynamic pricing based on distance, weight, urgency, and constraints
- Traveler ranking and ETA insights
- Delivery lifecycle tracking from Placed to Delivered
- Escrow and payout handling with wallet movements
- KYC approvals, dispute filing, and dispute resolution
- Rewards tiers, reviews, and support chat signals
- Persistent browser state via local storage

## 60-Second Quick Start

### Prerequisites

- Node.js 18+
- npm

### Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```


## Tech Stack

- React 18
- Vite 5
- React Router 6
- React Transition Group
- Local storage persistence

## Project Layout

```text
src/
  App.jsx
  main.jsx
  styles.css
  components/
    AnimatedNumber.jsx
    PageShell.jsx
    PageTransition.jsx
  config/
    roles.js
  hooks/
    usePersistentState.js
  lib/
    platform.js
    logistics.js
  pages/
    AdminPage.jsx
    CustomerPage.jsx
    LandingPage.jsx
    LoginPage.jsx
    PaymentsPage.jsx
    ProfilePage.jsx
    TrackingPage.jsx
    TravelerPage.jsx
```


## Contributing

Contributions are welcome and encouraged.

See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Setup instructions
- Branch and PR workflow
- Quality checklist before opening a PR

## Roadmap

- Backend APIs for orders, routes, disputes, and payouts
- Real authentication and role permissions
- Maps and live route tracking
- Real payment gateway integration
- Notifications and analytics dashboard
- End-to-end and component test coverage

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
