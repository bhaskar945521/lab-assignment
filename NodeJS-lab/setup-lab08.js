const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const LAB08 = path.join(ROOT, "Lab-08");

console.log("\n========================================");
console.log(" CS403NOD - LAB 08 SETUP");
console.log("========================================\n");

function findFolder(names) {
  for (const name of names) {
    const folder = path.join(ROOT, name);
    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
      return folder;
    }
  }
  return null;
}

function findFile(folder, names) {
  if (!folder) return null;

  for (const name of names) {
    const file = path.join(folder, name);
    if (fs.existsSync(file)) {
      return file;
    }
  }

  return null;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("Created:", path.relative(ROOT, file));
}

/* ---------------------------------------
   FIND EXISTING LABS
--------------------------------------- */

const lab01Folder = findFolder([
  "Lab-01-Simple-Server",
  "Lab-01",
  "Lab01",
  "Lab1"
]);

const lab02Folder = findFolder([
  "Lab-02-Student-Directory",
  "Lab-02",
  "Lab02",
  "Lab2"
]);

const lab03Folder = findFolder([
  "Lab-03-Async-Food-Delivery",
  "Lab-03",
  "Lab03",
  "Lab3"
]);

const lab04Folder = findFolder([
  "Lab-04-Modules-npm",
  "Lab-04-Modules-NPM",
  "Lab-04",
  "Lab04",
  "Lab4"
]);

const lab06Folder = findFolder([
  "Lab-06-File-System",
  "Lab-06",
  "Lab06",
  "Lab6"
]);

const lab07Folder = findFolder([
  "Lab-07-EventEmitter",
  "Lab-07-Event-Emitter",
  "Lab-07",
  "Lab07",
  "Lab7"
]);

const lab01File = findFile(lab01Folder, [
  "server.js",
  "app.js",
  "index.js"
]);

const lab02File = findFile(lab02Folder, [
  "server.js",
  "app.js",
  "index.js"
]);

const lab03File = findFile(lab03Folder, [
  "food.js",
  "app.js",
  "index.js"
]);

const lab04File = findFile(lab04Folder, [
  "app.js",
  "index.js",
  "server.js"
]);

const lab06File = findFile(lab06Folder, [
  "fs-demo.js",
  "app.js",
  "index.js"
]);

const lab07File = findFile(lab07Folder, [
  "emitter.js",
  "app.js",
  "index.js"
]);

console.log("Lab 01:", lab01File || "NOT FOUND");
console.log("Lab 02:", lab02File || "NOT FOUND");
console.log("Lab 03:", lab03File || "NOT FOUND");
console.log("Lab 04:", lab04File || "NOT FOUND");
console.log("Lab 06:", lab06File || "NOT FOUND");
console.log("Lab 07:", lab07File || "NOT FOUND");

/* ---------------------------------------
   CREATE FOLDERS
--------------------------------------- */

console.log("\nCreating Lab-08 folders...");

fs.mkdirSync(LAB08, { recursive: true });
fs.mkdirSync(path.join(LAB08, "modules"), { recursive: true });
fs.mkdirSync(path.join(LAB08, "public", "screenshots"), {
  recursive: true
});

/* ---------------------------------------
   RELATIVE FILE PATH
--------------------------------------- */

function relativeFile(file) {
  if (!file) return "";
  return path.relative(LAB08, file).replace(/\\/g, "/");
}

/* ---------------------------------------
   LABS.JS
--------------------------------------- */

const labsData = [
  {
    id: "01",
    title: "Simple HTTP Server",
    topic: "http module, routing",
    type: "server",
    file: relativeFile(lab01File),
    try: "/"
  },
  {
    id: "02",
    title: "Student Directory",
    topic: "JSON, query parameters",
    type: "server",
    file: relativeFile(lab02File),
    try: "/students?course=BCA"
  },
  {
    id: "03",
    title: "Async Food Delivery",
    topic: "Promise, async/await",
    type: "script",
    file: relativeFile(lab03File)
  },
  {
    id: "04",
    title: "Modules and npm",
    topic: "modules, npm packages",
    type: "script",
    file: relativeFile(lab04File)
  },
  {
    id: "06",
    title: "File System",
    topic: "fs module, file operations",
    type: "script",
    file: relativeFile(lab06File)
  },
  {
    id: "07",
    title: "EventEmitter",
    topic: "events module, EventEmitter",
    type: "script",
    file: relativeFile(lab07File)
  }
];

write(
  path.join(LAB08, "labs.js"),
  "module.exports = " +
    JSON.stringify(labsData, null, 2) +
    ";\n"
);

/* ---------------------------------------
   LOGGER.JS
--------------------------------------- */

const loggerCode = [
  'const fs = require("fs");',
  'const path = require("path");',
  'const EventEmitter = require("events");',
  "",
  'const LOG_DIR = path.join(__dirname, "..", "logs");',
  'const LOG_FILE = path.join(LOG_DIR, "server.log");',
  "",
  'fs.mkdirSync(LOG_DIR, { recursive: true });',
  "",
  "class Logger extends EventEmitter {}",
  "",
  "const logger = new Logger();",
  "",
  'logger.on("request", (method, requestUrl) => {',
  "  const line =",
  "    new Date().toISOString() +",
  '    " " +',
  "    method +",
  '    " " +',
  "    requestUrl;",
  "",
  "  console.log(line);",
  "",
  "  fs.appendFile(",
  "    LOG_FILE,",
  '    line + "\\n",',
  "    (err) => {",
  "      if (err) {",
  "        logger.emit(\"error\", err);",
  "      }",
  "    }",
  "  );",
  "});",
  "",
  'logger.on("error", (err) => {',
  '  console.error("Logger error:", err.message);',
  "});",
  "",
  "module.exports = {",
  "  logger,",
  "  LOG_FILE",
  "};",
  ""
].join("\n");

write(
  path.join(LAB08, "modules", "logger.js"),
  loggerCode
);

/* ---------------------------------------
   SERVER.JS
--------------------------------------- */

const serverCode = [
  'const http = require("http");',
  'const url = require("url");',
  'const path = require("path");',
  'const fs = require("fs");',
  'const { execFile } = require("child_process");',
  'const { promisify } = require("util");',
  'const slugify = require("slugify");',
  "",
  'const labs = require("./labs");',
  'const { logger, LOG_FILE } = require("./modules/logger");',
  "",
  "const execFileAsync = promisify(execFile);",
  "",
  "const PORT = process.env.PORT || 3000;",
  "const ROOT = __dirname;",
  "",
  "const ENVIRONMENT = process.env.RENDER",
  '  ? "live (Render)"',
  '  : "local";',
  "",
  "function send(res, status, data) {",
  "  res.statusCode = status;",
  '  res.setHeader("Content-Type", "application/json; charset=utf-8");',
  "  res.end(JSON.stringify(data, null, 2));",
  "}",
  "",
  "function sendHtml(res, status, html) {",
  "  res.statusCode = status;",
  '  res.setHeader("Content-Type", "text/html; charset=utf-8");',
  "  res.end(html);",
  "}",
  "",
  "function escapeHtml(value) {",
  "  return String(value)",
  '    .replace(/&/g, "&amp;")',
  '    .replace(/</g, "&lt;")',
  '    .replace(/>/g, "&gt;")',
  '    .replace(/"/g, "&quot;");',
  "}",
  "",
  "function getLab(id) {",
  "  return labs.find(function (lab) {",
  "    return lab.id === id;",
  "  });",
  "}",
  "",
  "function resolveLabFile(lab) {",
  "  return path.resolve(ROOT, lab.file);",
  "}",
  "",
  "function page(title, body) {",
  "  return [",
  '    "<!DOCTYPE html>",',
  '    "<html lang=\\"en\\">",',
  "    "<head>
  '    <meta charset=\\"UTF-8\\">',
  '    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">',
  "    <title>" + escapeHtml(title) + "</title>",
  "    <style>",
  "    body {",
  "      font-family: Arial, sans-serif;",
  "      max-width: 1100px;",
  "      margin: 40px auto;",
  "      padding: 0 20px;",
  "      line-height: 1.6;",
  "    }",
  "    a { margin-right: 15px; }",
  "    .card {",
  "      border: 1px solid #ddd;",
  "      border-radius: 10px;",
  "      padding: 20px;",
  "      margin: 15px 0;",
  "    }",
  "    pre {",
  "      background: #f4f4f4;",
  "      padding: 20px;",
  "      overflow-x: auto;",
  "      border-radius: 8px;",
  "    }",
  "    img {",
  "      max-width: 100%;",
  "      border: 1px solid #ddd;",
  "      margin: 10px 0;",
  "    }",
  "    </style>",
  "    </head>",
  "    <body>",
  '    <nav><a href="/">Home</a><a href="/labs">Labs</a><a href="/health">Health</a><a href="/api/dashboard">Dashboard</a></nav>',
  "    <hr>",
  "    " + body,
  "    </body>",
  "    </html>"
  ].join("\n");
  
  "}",
  "",
  "async function handleLabPage(res, lab) {",
  "  const file = resolveLabFile(lab);",
  "  const source = await fs.promises.readFile(file, 'utf8');",
  "",
  "  let screenshots = [];",
  "",
  "  try {",
  "    screenshots = await fs.promises.readdir(",
  '      path.join(ROOT, "public", "screenshots")',
  "    );",
  "    screenshots = screenshots.filter(function (name) {",
  "      return name.indexOf('lab' + lab.id + '-') === 0 &&",
  "        /\\.(png|jpg)$/i.test(name);",
  "    });",
  "  } catch (error) {",
  "    screenshots = [];",
  "  }",
  "",
  "  let images = '';",
  "",
  "  if (screenshots.length === 0) {",
  "    images = '<p>No screenshots uploaded yet.</p>';",
  "  } else {",
  "    images = screenshots.map(function (name) {",
  "      return '<div><p>' + escapeHtml(name) + '</p>' +",
  "        '<img src=\"/screenshots/' + encodeURIComponent(name) +",
  "        '\" alt=\"' + escapeHtml(name) + '\"></div>';",
  "    }).join('');",
  "  }",
  "",
  "  let runLink;",
  "",
  "  if (lab.type === 'script') {",
  "    runLink = '/labs/' + lab.id + '/run';",
  "  } else {",
  "    runLink = '/labs/' + lab.id + '/app' + (lab.try || '/');",
  "  }",
  "",
  "  const body =",
  "    '<h1>' + escapeHtml(lab.title) + '</h1>' +",
  "    '<p><strong>Topic:</strong> ' + escapeHtml(lab.topic) + '</p>' +",
  "    '<p><strong>Type:</strong> ' + escapeHtml(lab.type) + '</p>' +",
  "    '<p><a href=\"' + runLink + '\">Run / Open Lab</a></p>' +",
  "    '<h2>Source Code</h2>' +",
  "    '<pre><code>' + escapeHtml(source) + '</code></pre>' +",
  "    '<h2>Screenshots</h2>' +",
  "    images;",
  "",
  "  sendHtml(res, 200, page(lab.title, body));",
  "}",
  "",
  "async function handleRun(res, lab) {",
  "  if (lab.type !== 'script') {",
  "    return send(res, 400, {",
  "      error: 'This is a server lab. Use /labs/:id/app/... instead.'",
  "    });",
  "  }",
  "",
  "  try {",
  "    const result = await execFileAsync(",
  "      process.execPath,",
  "      [resolveLabFile(lab)],",
  "      {",
  "        timeout: 5000,",
  "        maxBuffer: 1024 * 1024",
  "      }",
  "    );",
  "",
  "    return send(res, 200, {",
  "      ok: true,",
  "      output: result.stdout,",
  "      error: result.stderr || ''",
  "    });",
  "  } catch (error) {",
  "    return send(res, 200, {",
  "      ok: false,",
  "      output: error.stdout || '',",
  "      error: error.stderr || error.message",
  "    });",
  "  }",
  "}",
  "",
  "async function handleServerLab(req, res, lab, pathname) {",
  "  if (lab.type !== 'server') {",
  "    return send(res, 400, {",
  "      error: 'This is a script lab. Use /labs/:id/run instead.'",
  "    });",
  "  }",
  "",
  "  const prefix = '/labs/' + lab.id + '/app';",
  "  const remainder = pathname.slice(prefix.length) || '/';",
  "  const queryIndex = req.url.indexOf('?');",
  "  const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';",
  "",
  "  req.url = remainder + query;",
  "",
  "  let handler;",
  "",
  "  try {",
  "    handler = require(resolveLabFile(lab));",
  "  } catch (error) {",
  "    return send(res, 500, {",
  "      error: 'Could not load lab handler',",
  "      message: error.message",
  "    });",
  "  }",
  "",
  "  if (typeof handler !== 'function') {",
  "    return send(res, 500, {",
  "      error: 'Lab handler is not a function. Export the handler function.'",
  "    });",
  "  }",
  "",
  "  return handler(req, res);",
  "}",
  "",
  "async function handler(req, res) {",
  "  logger.emit('request', req.method, req.url);",
  "",
  "  try {",
  "    const parsed = url.parse(req.url, true);",
  "    const pathname = parsed.pathname;",
  "",
  "    if (req.method !== 'GET') {",
  "      return send(res, 405, { error: 'Method not allowed' });",
  "    }",
  "",
  "    if (pathname === '/') {",
  "      const list = labs.map(function (lab) {",
  "        return '<li><a href=\"/labs/' + lab.id + '\">Lab ' +",
  "          lab.id + ' - ' + escapeHtml(lab.title) + '</a></li>';",
  "      }).join('');",
  "",
  "      return sendHtml(",
  "        res,",
  "        200,",
  "        page(",
  "          'Lab 08 - Integrated Server',",
  "          '<h1>CS403NOD - Lab 08</h1>' +",
  "          '<p><strong>Environment:</strong> ' + ENVIRONMENT + '</p>' +",
  "          '<p>Integrated Node.js server for previous labs.</p>' +",
  "          '<h2>All Labs</h2><ul>' + list + '</ul>'",
  "        )",
  "      );",
  "    }",
  "",
  "    if (pathname === '/about') {",
  "      return send(res, 200, {",
  "        projectName: 'Lab 08 - Integrated Lab Server',",
  "        name: process.env.STUDENT_NAME || 'Not set',",
  "        labs: labs.length",
  "      });",
  "    }",
  "",
  "    if (pathname === '/health') {",
  "      return send(res, 200, {",
  "        status: 'ok',",
  "        environment: ENVIRONMENT,",
  "        uptimeSeconds: Math.floor(process.uptime())",
  "      });",
  "    }",
  "",
  "    if (pathname === '/labs') {",
  "      return send(res, 200, labs.map(function (lab) {",
  "        return Object.assign({}, lab, {",
  "          slug: slugify(lab.title, { lower: true, strict: true })",
  "        });",
  "      }));",
  "    }",
  "",
  "    const match = pathname.match(/^\\/labs\\/([^/]+)(?:\\/(.*))?$/);",
  "",
  "    if (match) {",
  "      const id = match[1];",
  "      const tail = match[2] || '';",
  "      const lab = getLab(id);",
  "",
  "      if (!lab) {",
  "        return send(res, 404, {",
  "          error: 'Lab not found',",
  "          id: id",
  "        });",
  "      }",
  "",
  "      if (!tail) {",
  "        return handleLabPage(res, lab);",
  "      }",
  "",
  "      if (tail === 'run') {",
  "        return handleRun(res, lab);",
  "      }",
  "",
  "      if (tail === 'app' || tail.indexOf('app/') === 0) {",
  "        return handleServerLab(req, res, lab, pathname);",
  "      }",
  "    }",
  "",
  "    const screenshotMatch = pathname.match(/^\\/screenshots\\/(.+)$/);",
  "",
  "    if (screenshotMatch) {",
  "      const filename = path.basename(screenshotMatch[1]);",
  "",
  "      if (!/\\.(png|jpg)$/i.test(filename)) {",
  "        return send(res, 400, {",
  "          error: 'Only .png and .jpg files are allowed.'",
  "        });",
  "      }",
  "",
  "      const file = path.join(",
  "        ROOT,",
  "        'public',",
  "        'screenshots',",
  "        filename",
  "      );",
  "",
  "      try {",
  "        await fs.promises.access(file);",
  "      } catch (error) {",
  "        return send(res, 404, {",
  "          error: 'Screenshot not found'",
  "        });",
  "      }",
  "",
  "      res.statusCode = 200;",
  "      res.setHeader(",
  "        'Content-Type',",
  "        filename.toLowerCase().endsWith('.png')",
  "          ? 'image/png'",
  "          : 'image/jpeg'",
  "      );",
  "",
  "      return fs.createReadStream(file).pipe(res);",
  "    }",
  "",
  "    if (pathname === '/api/dashboard') {",
  "      const result = await Promise.all([",
  "        fs.promises.readFile(LOG_FILE, 'utf8').catch(function () {",
  "          return '';",
  "        }),",
  "        fs.promises.readdir(",
  "          path.join(ROOT, 'public', 'screenshots')",
  "        ).catch(function () {",
  "          return [];",
  "        })",
  "      ]);",
  "",
  "      const logText = result[0];",
  "      const screenshotNames = result[1].filter(function (name) {",
  "        return /\\.(png|jpg)$/i.test(name);",
  "      });",
  "",
  "      const requestsLogged = logText.trim()",
  "        ? logText.trim().split('\\n').length",
  "        : 0;",
  "",
  "      return send(res, 200, {",
  "        labs: labs,",
  "        screenshots: screenshotNames,",
  "        requestsLogged: requestsLogged",
  "      });",
  "    }",
  "",
  "    return send(res, 404, {",
  "      error: 'Route not found',",
  "      path: pathname",
  "    });",
  "",
  "  } catch (error) {",
  "    console.error('SERVER ERROR:', error);",
  "",
  "    return send(res, 500, {",
  "      error: 'Internal Server Error'",
  "    });",
  "  }",
  "}",
  "",
  "const server = http.createServer(handler);",
  "",
  "server.listen(PORT, '0.0.0.0', function () {",
  "  console.log('Server running on port ' + PORT);",
  "  console.log('Environment: ' + ENVIRONMENT);",
  "});",
  "",
  "module.exports = {",
  "  handler: handler,",
  "  server: server",
  "};",
  ""
.join("\n");

write(
  path.join(LAB08, "server.js"),
  serverCode
);

/* ---------------------------------------
   PACKAGE.JSON
--------------------------------------- */

const packageJson = {
  name: "lab-08-integrated-server",
  version: "1.0.0",
  description: "CS403NOD Lab 08 Integrated Node.js Server",
  main: "server.js",
  scripts: {
    start: "node server.js"
  },
  dependencies: {
    slugify: "^1.6.6"
  }
};

write(
  path.join(LAB08, "package.json"),
  JSON.stringify(packageJson, null, 2) + "\n"
);

/* ---------------------------------------
   GITIGNORE
--------------------------------------- */

write(
  path.join(LAB08, ".gitignore"),
  "node_modules/\nlogs/\n*.env*\n"
);

/* ---------------------------------------
   README
--------------------------------------- */

const readme = [
  "# CS403NOD - Lab 08",
  "",
  "## Integrated Lab Server",
  "",
  "Name: YOUR NAME",
  "",
  "Roll No.: YOUR ROLL NUMBER",
  "",
  "Class: BCA VII",
  "",
  "## Description",
  "",
  "This project integrates previous Node.js labs into one server.",
  "",
  "## Included Labs",
  "",
  "| Lab | Topic | Type |",
  "|---|---|---|",
  "| 01 | HTTP module, routing | Server |",
  "| 02 | JSON, query parameters | Server |",
  "| 03 | Promise, async/await | Script |",
  "| 04 | Modules and npm | Script |",
  "| 06 | File System | Script |",
  "| 07 | EventEmitter | Script |",
  "",
  "## Local Run",
  "",
  "```bash",
  "cd Lab-08",
  "npm install",
  "npm start",
  "```",
  "",
  "Open: http://localhost:3000",
  "",
  "## Routes",
  "",
  "GET /",
  "",
  "GET /about",
  "",
  "GET /health",
  "",
  "GET /labs",
  "",
  "GET /labs/:id",
  "",
  "GET /labs/:id/run",
  "",
  "GET /labs/:id/app/...",
  "",
  "GET /screenshots/:name",
  "",
  "GET /api/dashboard",
  "",
  "## Screenshots",
  "",
  "Put screenshots inside public/screenshots/",
  "",
  "## Render",
  "",
  "Start Command:",
  "",
  "node Lab-08/server.js",
  "",
  "Environment Variable:",
  "",
  "STUDENT_NAME=YOUR NAME",
  "",
  "## What I Learned",
  "",
  "I learned how to integrate multiple Node.js labs into one server.",
  "I learned how to use modules, EventEmitter, child_process and file system operations."
].join("\n");

write(
  path.join(LAB08, "README.md"),
  readme + "\n"
);

/* ---------------------------------------
   GITKEEP
--------------------------------------- */

write(
  path.join(LAB08, "public", "screenshots", ".gitkeep"),
  ""
);

/* ---------------------------------------
   FINISHED
--------------------------------------- */

console.log("\n========================================");
console.log(" LAB 08 SETUP COMPLETED");
console.log("========================================");

console.log("\nNext steps:");
console.log("1. cd Lab-08");
console.log("2. npm install");
console.log("3. npm start");
console.log("4. Open http://localhost:3000");
console.log("\nTest:");
console.log("http://localhost:3000/health");
console.log("http://localhost:3000/labs");
console.log("http://localhost:3000/api/dashboard");
console.log("");