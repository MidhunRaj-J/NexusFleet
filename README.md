# NexusFleet

NexusFleet is a community-driven logistics platform rebuilt as a modern React + Vite application with routed pages. It simulates a real delivery marketplace where customers create orders, travelers publish routes and earn from trips, and admins manage trust, disputes, and platform health.

## What It Does

- Dedicated landing page with clear role entry points
- Customer page for creating delivery requests with dynamic pricing and match scoring
- Traveler page for publishing routes, accepting jobs, and simulating earnings
- Admin page for KYC review, dispute handling, and platform moderation
- Escrow-style delivery lifecycle with staged status updates
- Gamification features like rewards points, loyalty tiers, and traveler leaderboard
- Persistent browser-based state using local storage

## Tech Stack

- React 18
- Vite
- React Router for page-level navigation
- Vanilla state and hooks
- Local storage for persistence
- CSS-driven animated UI with route-specific layouts

## Core Features

### Customer
- Open the customer page directly or from the landing page
- Create delivery orders
- Set pickup, drop, weight, distance, capacity, and urgency
- See dynamic price calculation
- See AI-style traveler match score
- Review recent shipments and delivery state

### Traveler
- Open the traveler page directly or from the landing page
- Publish travel routes
- Accept the latest order
- Track earnings-style gamification
- View route board and leaderboard context

### Admin
- Open the admin page directly or from the landing page
- Review KYC queue
- Approve users
- Open and resolve disputes
- View operational platform signals

### Platform Intelligence
- Dynamic pricing simulation
- Escrow lock/release simulation
- Route matching score
- Loyalty tier progression
- Notifications feed

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
  App.jsx              Main application UI and workflow logic
  main.jsx             React entry point
  styles.css           Global design system and animations
  assets/logo.svg      Branding logo
  config/roles.js      Role definitions and seed data
  hooks/usePersistentState.js  Local storage state helper
```

## Notes

- The app currently runs as a frontend demo with persistent browser state.
- It is ready to be extended into a full backend-driven product using Node.js, Express, MongoDB, Socket.io, and payments integration.
- Legacy static HTML files still exist in the repository, but the React app in `src/` is the active implementation.

## Roadmap Ideas

- Real authentication and user accounts
- MongoDB-backed orders, routes, disputes, and payouts
- Socket-based live tracking updates
- Razorpay or Stripe integration
- Maps and route visualization
- Notifications and admin analytics dashboards

## License

No license has been specified for this project.
