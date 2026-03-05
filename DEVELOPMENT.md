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
