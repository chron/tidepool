# Tidepool

Async standups for small teams. A demo app: sign in as one of the seeded users, read your team's updates and post your own.

- React + Vite front end in `src/`
- Cloudflare Worker API in `worker/` with a cookie session (`/api/session`, `/api/login`, `/api/logout`)
- Deployed to https://tidepool.prestidge.dev

```sh
bun install
bun run dev      # local dev with the Worker
bun run deploy   # build and deploy to Cloudflare
```
