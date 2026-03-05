/**
 * Dev-only proxy: forwards /current?query=X to Weatherstack and adds API key from env.
 * Run: WEATHERSTACK_API_KEY=yourkey node scripts/weather-proxy.js
 * Then in Angular use proxyConfig so /api -> this server (key never in client).
 */
const http = require('http');
const https = require('https');

const PORT = Number(process.env.PROXY_PORT) || 3001;
const KEY = process.env.WEATHERSTACK_API_KEY;
if (!KEY) {
  console.error('Set WEATHERSTACK_API_KEY to run the weather proxy.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/current' || req.method !== 'GET') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const query = url.searchParams.get('query');
  if (!query) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing query' }));
    return;
  }
  const target = `https://api.weatherstack.com/current?access_key=${encodeURIComponent(KEY)}&query=${encodeURIComponent(query)}`;
  https
    .get(target, (upstream) => {
      res.writeHead(upstream.statusCode || 200, upstream.headers);
      upstream.pipe(res);
    })
    .on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
});

server.listen(PORT, () => {
  console.log(`Weather proxy listening on http://localhost:${PORT}`);
});
