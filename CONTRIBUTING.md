# Contributing to NexusFleet

Thanks for your interest in improving NexusFleet.

## Development Setup

1. Fork the repository.
2. Clone your fork.
3. Install dependencies.

```bash
npm install
```

4. Start development server.

```bash
npm run dev
```

5. Open the local URL shown in the terminal.

## Branching Strategy

- Create a feature branch from `main`.
- Use a clear branch name, for example:
  - `feature/customer-filter`
  - `fix/tracking-status-bug`
  - `docs/readme-improvements`

## Commit Guidelines

- Keep commits focused and small.
- Use imperative commit messages.
  - `feat: add traveler route validation`
  - `fix: handle empty pickup in order form`
  - `docs: improve quick start section`

## Pull Request Checklist

Before opening a PR, verify:

- `npm run build` passes locally
- Changes are scoped to one concern
- UI changes include updated screenshots or GIFs when relevant
- New logic is explained clearly in the PR description
- Related issue is linked (if applicable)

## Issue Labels

If you are a maintainer, use consistent labels:

- `good first issue` for beginner-friendly tasks
- `bug` for defects
- `enhancement` for improvements
- `ui` for design and UX changes
- `customer-flow`, `traveler-flow`, `admin-flow` for domain-scoped issues

## Code Style

- Keep components readable and single-purpose.
- Prefer explicit naming for state and handlers.
- Avoid unrelated refactors in feature/fix PRs.

## Community Expectations

- Be respectful and constructive in reviews.
- Ask clarifying questions before large changes.
- Assume positive intent.
