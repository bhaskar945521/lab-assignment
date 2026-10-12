/**
 * Node.js Lab Portfolio Server
 * Serves the rich interactive frontend application, auto-discovered labs, and REST APIs
 * Author: Bhaskar Mall | Dev Sanskriti Vishwavidyalaya (DSVV)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;
const PORT = process.env.PORT || 5050;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

function sendJson(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendFile(res, filePath, contentType) {
  if (!fs.existsSync(filePath)) {
    return sendJson(res, { error: 'File not found', file: path.basename(filePath) }, 404);
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = contentType || MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': 'public, max-age=3600'
  });
  fs.createReadStream(filePath).pipe(res);
}

function getLabsJson() {
  const jsonPath = path.join(ROOT, 'labs.json');
  if (fs.existsSync(jsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.error('Error reading labs.json:', e.message);
    }
  }
  return { stats: { totalLabs: 0 }, labs: [] };
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsed.pathname);

  // Normalize root path to index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // API: GET /api/labs
  if (pathname === '/api/labs') {
    return sendJson(res, getLabsJson());
  }

  // API: GET /health or /api/health
  if (pathname === '/health' || pathname === '/api/health') {
    return sendJson(res, {
      status: 'ok',
      environment: process.env.RENDER ? 'live (Render)' : 'local',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  // API: GET /api/about
  if (pathname === '/api/about' || pathname === '/about') {
    return sendJson(res, {
      projectName: 'Node.js Practical Lab Portfolio',
      student: 'Bhaskar Mall',
      scholarNo: '23145005',
      course: 'BCA (VII Semester)',
      college: 'Dev Sanskriti Vishwavidyalaya (DSVV)',
      subject: 'CS403NOD - Node.js'
    });
  }

  // Assessment Guide routes
  if (pathname === '/guide.pdf' || pathname === '/assessment-guide.pdf' || pathname === '/assessment.pdf') {
    const pdfPath = path.join(ROOT, 'NodeJS_Practical_Assessment_Guide.pdf');
    if (fs.existsSync(pdfPath)) {
      return sendFile(res, pdfPath, 'application/pdf');
    }
  }

  if (pathname === '/guide' || pathname === '/assessment' || pathname === '/assessment-guide') {
    const htmlGuide = path.join(ROOT, 'assessment-guide.html');
    if (fs.existsSync(htmlGuide)) {
      return sendFile(res, htmlGuide, 'text/html; charset=utf-8');
    }
  }

  // Direct check for DSVV Logo in root or current folder
  if (pathname === '/dsvvlogo.png' || pathname === '/dsvvlogo.ong') {
    const candidates = [
      path.join(ROOT, 'dsvvlogo.png'),
      path.join(ROOT, '..', 'dsvvlogo.png'),
      path.join(ROOT, 'Lab-08', 'public', 'dsvvlogo.png')
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return sendFile(res, c, 'image/png');
      }
    }
  }

  // Serve static files from ROOT
  const safePath = path.resolve(path.join(ROOT, pathname.replace(/^\//, '')));
  if (safePath.startsWith(path.resolve(ROOT))) {
    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      return sendFile(res, safePath);
    }
  }

  // Serve assets from parent directory if needed (e.g., logo or root files)
  const parentSafePath = path.resolve(path.join(ROOT, '..', pathname.replace(/^\//, '')));
  if (parentSafePath.startsWith(path.resolve(path.join(ROOT, '..')))) {
    if (fs.existsSync(parentSafePath) && fs.statSync(parentSafePath).isFile()) {
      return sendFile(res, parentSafePath);
    }
  }

  return sendJson(res, { error: 'Route not found', path: pathname }, 404);
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` Node.js Lab Portfolio Server Running`);
    console.log(` Student: Bhaskar Mall | BCA VII (23145005)`);
    console.log(` Dev Sanskriti Vishwavidyalaya (DSVV)`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = server;
