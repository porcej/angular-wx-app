# Development

## Running the app

### Option A: With dev proxy (recommended – API key not in client)

1. In one terminal, start the weather proxy (set your key):
   ```bash
   WEATHERSTACK_API_KEY=your_key_here npm run proxy
   ```
2. In another terminal, start the Angular app:
   ```bash
   npm start
   ```
3. Open http://localhost:4200. The app will call `/api/current`, which the dev server proxies to the local proxy; the proxy adds the API key and forwards to Weatherstack.

### Option B: Without proxy (key in environment)

1. Set `weatherstackApiKey` in `src/environments/environment.ts` to your Weatherstack API key.
2. Run `npm start` and open http://localhost:4200.

## Build

- **Production build:** `npm run build`
- **Node 17+:** If you see `Error: error:0308010C:digital envelope routines::unsupported`, use:
  ```bash
  NODE_OPTIONS=--openssl-legacy-provider npm run build
  ```
  Or set `NODE_OPTIONS=--openssl-legacy-provider` in your environment.

## Linting and formatting

- **TSLint (Angular):** `npm run lint`
- **ESLint:** `npm run lint:eslint`
- **Prettier:** `npm run format`

## Tests

- **Unit tests:** `npm test`
- **E2E:** `npm run e2e`

---

## Updating Node and reducing vulnerabilities

### Updating Node (and npm/npx)

**Node** and **npx** are installed together: npm (and npx) ship with Node.js, so updating Node updates both.

**Option 1 – Version manager (recommended)**  
Use [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or [n](https://github.com/tj/n) so you can switch Node versions per project:

```bash
# With nvm (install from https://github.com/nvm-sh/nvm first)
nvm install --lts
nvm use --lts

# With fnm
fnm install --lts
fnm use lts-latest
```

Then run `node -v` and `npx -v` to confirm.

**Option 2 – Direct install**  
Download the latest **LTS** from [nodejs.org](https://nodejs.org/) and run the installer. Your system Node and npx will be updated.

This project currently works on **Node 18 LTS** or **Node 20 LTS**. Very new Node (e.g. 24) may need `NODE_OPTIONS=--openssl-legacy-provider` for `npm start` / `npm run build` (already set in `package.json`).

### About the npm audit vulnerabilities

- **Safe fixes:** Run `npm audit fix` (no flags). That was already run and fixed what it could without breaking changes.
- **What’s left:** Most remaining issues are in **Angular 12** and its build tools (webpack, protractor, etc.). Fixing them “properly” means upgrading Angular step by step (e.g. 12 → 13 → 14 → … → 18+). Each step: `npx ng update @angular/core@N @angular/cli@N`, then `npm install` (or `npm install --legacy-peer-deps` if install fails).
- **Do not run** `npm audit fix --force` for this project: it would jump to Angular 21 and almost certainly break the app. Prefer incremental `ng update` and then re-run `npm audit` as you go; the count will drop as you reach newer Angular versions.
- **Protractor** (E2E) is deprecated; many of the remaining advisories are in its dependencies. When you’re on Angular 15+, consider switching E2E to [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/) and removing Protractor.
