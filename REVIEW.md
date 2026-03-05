# Project Review: Angular Weather App

## Security (addressed and recommendations)

### Fixed in this review

1. **API key exposure (critical)**  
   The Weatherstack API key was hardcoded in `apixu.service.ts` and would be shipped in the client bundle and live in git history.  
   - **Change:** Key is now read from `environment.weatherstackApiKey` in both `environment.ts` and `environment.prod.ts`.  
   - **You must:** Set `YOUR_WEATHERSTACK_API_KEY` to your real key locally. For production, prefer a **backend proxy** so the key is only on the server and never in the client.

2. **HTTP and query injection**  
   - **Change:** API calls now use **HTTPS** (`https://api.weatherstack.com/current`).  
   - **Change:** The location is sent via `HttpParams`, so the query is properly encoded and not concatenated into the URL.

3. **.gitignore**  
   - **Change:** Added `.env`, `.env.local`, and `.env.*.local` so local env overrides with secrets are not committed.

### Further security recommendations

- **Rotate the exposed API key**  
  The key that was in the repo should be rotated in the Weatherstack dashboard; assume it may have been compromised if the repo was ever public or shared.

- **Production API key**  
  For production, do not put the real key in `environment.prod.ts` in the repo. Use a backend that calls Weatherstack with the key and expose your own API to the Angular app, or inject the key at build time via CI (e.g. env var) and keep prod builds out of public repos.

- **Content Security Policy (CSP)**  
  Consider adding CSP headers when you deploy (e.g. in the server or CDN config) to reduce XSS impact.

- **No dangerous patterns found**  
  No `innerHTML`, `bypassSecurityTrust*`, or `eval` usage was found; Angular’s default sanitization is in use.

---

## Improvements made in code

1. **Subscribe bug (weather.component.ts)**  
   `console.log` was outside the `subscribe` callback due to a missing semicolon/brace. The subscription is now correct and includes error handling so failed requests don’t leave the UI in a broken state.

2. **Input validation**  
   `sendToAPIXU` now trims the location and skips the request if it’s empty.

3. **Typing**  
   Added types where it was easy (e.g. `formValues`, `location`, service return type) for better safety and editor support.

4. **Redundant provider**  
   `ApixuService` was both `providedIn: 'root'` and listed in `AppModule.providers`. It’s now only provided via `providedIn: 'root'`.

---

## Implemented in follow-up

- **Routing** – Single source of truth: all routes are in `AppRoutingModule`; `routes.ts` was removed.
- **Template** – “Feels like” and location are wired to `weatherData`; empty state and placeholders cleaned up.
- **Loading and error UI** – Loading state and user-visible error message when the weather request fails.
- **Prettier** – `.prettierrc` and `npm run format` added; `src` formatted.
- **Dev proxy** – Optional local proxy so the API key is not in the client: run `npm run proxy` (with `WEATHERSTACK_API_KEY` set), then `npm start`; in dev the app calls `/api/current` and the proxy adds the key.
- **ESLint** – ESLint + TypeScript plugin added; run `npm run lint:eslint`. TSLint is still used by `ng lint`; after upgrading to Angular 12+, you can switch to [angular-eslint](https://github.com/angular-eslint/angular-eslint) and remove TSLint.
- **Angular upgrade** – Project upgraded from Angular 9 to **Angular 11** (incremental 9→10→11). You can continue with `ng update @angular/core@12 @angular/cli@12` and then adopt full angular-eslint.

### Remaining suggestions

- **Upgrade to Angular 12+** – Enables angular-eslint and removes legacy TSLint. Use the [Angular Update Guide](https://update.angular.io/).
- **Node 17+ and build** – If `ng build` fails with `ERR_OSSL_EVP_UNSUPPORTED`, run with `NODE_OPTIONS=--openssl-legacy-provider` (e.g. `NODE_OPTIONS=--openssl-legacy-provider npm run build`).
- **Tests** – Update and run unit tests so they match the current service and component behavior.

---

## Summary

Critical security issues addressed: API key moved to environment (with placeholder), HTTPS and safe query encoding for the weather API, and `.gitignore` updated for env files. A subscribe bug was fixed and basic error handling and validation were added. Follow-up work: consolidated routing, loading/error UI, Prettier, dev proxy, ESLint, and Angular 9→11 upgrade. Rotate the previously exposed API key; for production use a backend proxy or inject the key at build time.
