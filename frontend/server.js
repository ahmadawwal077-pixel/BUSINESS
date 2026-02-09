const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// Simple proxy for API requests so the static server can forward to backend
// Usage: set API_TARGET to backend base (e.g. http://localhost:5000)
const API_TARGET = process.env.API_TARGET || 'http://localhost:5000';

app.use('/api', (req, res) => {
  try {
    const targetUrl = new URL(API_TARGET + req.originalUrl);
    const proxyModule = targetUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: Object.assign({}, req.headers),
    };

    // Remove host header to avoid conflicts
    delete options.headers.host;

    const proxyReq = proxyModule.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('API proxy error:', err.message);
      res.status(502).send('Bad Gateway');
    });

    req.pipe(proxyReq, { end: true });
  } catch (err) {
    console.error('API proxy exception:', err.message);
    res.status(500).send('Proxy configuration error');
  }
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// SPA routing: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`📍 Serving from: ${path.join(__dirname, 'build')}`);
  console.log(`🔁 Proxying /api -> ${API_TARGET}`);
});
