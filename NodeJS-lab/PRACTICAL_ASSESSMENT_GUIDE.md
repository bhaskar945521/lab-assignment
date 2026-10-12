# Node.js Practical Lab Manual & Viva Handbook
**Candidate:** Bhaskar Mall | **Scholar No:** 23145005  
**Course & Semester:** BCA VII Semester | **Subject:** CS403NOD — Node.js Architecture & Backend Development  
**Institution:** Dev Sanskriti Vishwavidyalaya (DSVV), Haridwar  

---

## 1. Core Node.js Architecture & Execution Model (Viva Essentials)

### Q1. What exactly is Node.js, and what are its two core internal dependencies?
- **Answer:** Node.js is **not a language or framework**; it is an open-source, cross-platform **JavaScript runtime environment** built on Google Chrome's **V8 JavaScript Engine** and written in C++.
- **Two Core Dependencies:**
  1. **Google V8 Engine:** Compiles JavaScript source code directly into native machine code (Just-In-Time compilation).
  2. **libuv (C library):** Provides the **Event Loop**, non-blocking asynchronous I/O polling, and a background **Thread Pool** (default 4 threads) for blocking system tasks (file I/O, DNS, crypto).

### Q2. How does Node.js handle thousands of concurrent requests if JavaScript is single-threaded?
- Node.js executes JavaScript on a **single main thread**, but achieves high concurrency using an **Event-Driven, Non-Blocking I/O model**.
- When an I/O request (file read, DB query, network) arrives, Node.js delegates it to the OS kernel or libuv thread pool and registers a callback.
- The main thread is immediately freed up to accept new incoming connections. When the I/O finishes, its callback is queued in the Event Loop and executed when the main stack is empty.

### Q3. What are the six phases of the Node.js Event Loop in order of execution?
1. **Timers Phase:** Callbacks from `setTimeout()` and `setInterval()`.
2. **Pending / I/O Callbacks:** Deferred system callbacks (e.g. TCP errors).
3. **Idle, Prepare:** Internal libuv bookkeeping.
4. **Poll Phase:** Retrieves new I/O events; executes I/O callbacks; blocks and waits when empty.
5. **Check Phase:** Callbacks from `setImmediate()`.
6. **Close Callbacks:** Cleanup callbacks, e.g. `socket.on('close', ...)`.
- *Microtasks Queue:* `process.nextTick()` executes immediately after the current operation, before the loop advances.

---

## 2. Lab-by-Lab Viva & Practical Breakdown (Labs 01 to 08)

### LAB 01 — Setup, Variables, Data Types & Base HTTP Server
- **Files:** `Lab-01/app.js`, `Lab-01/server.js`
- **Core Code:** `http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/plain'}); res.end('Hello'); }).listen(3000);`
- **Why `res.end()` is mandatory:** `res` is a writable stream. `res.end()` signals that all headers and body data have been sent. Without it, the client connection hangs indefinitely until timeout.

### LAB 02 — HTTP Web Server & Custom Routing
- **Files:** `Lab-02/server.js`
- **Core Concept:** Routing without Express by inspecting `req.url` and `req.method`.
- **Status Codes:** 200 (OK), 404 (Not Found for unhandled paths).
- **Header:** `res.writeHead(200, { 'Content-Type': 'application/json' })` to return JSON strings via `JSON.stringify()`.

### LAB 03 & 04 — Dynamic REST API, Query Parameters & Modules
- **Files:** `Lab-03/student-server.js`, `Lab-04/advanced-server.js`
- **URL Parsing:** `url.parse(req.url, true).query` converts query string into object (e.g. `?course=BCA&minMarks=70`).
- **Data Filtering:** Uses JavaScript `filter()` with validation (`parseFloat(query.minMarks)`, `!isNaN()`).
- **Module Types:**
  - *Core Modules:* Built into Node (`http`, `fs`, `path`, `events`, `os`).
  - *Local Modules:* Written in project (`./modules/logger.js`).
  - *Third-Party:* Installed from npm (`slugify`).

### LAB 05 — Asynchronous Paradigms: Callbacks, Promises, Async/Await
- **Files:** `Lab-05/callback-version.js`, `Lab-05/promise-version.js`, `Lab-05/async-await-version.js`, `Lab-05/concurrent-orders.js`
- **Evolution:**
  - *Callback Hell:* Nested pyramids with inversion of control and messy error handling.
  - *Promises:* States: Pending, Fulfilled, Rejected. Handled via `.then()` and `.catch()`.
  - *Async/Await:* Syntactic sugar over Promises. Sequential synchronous-looking code with `try...catch`.
  - *`Promise.all()` Concurrency:* Executes independent promises in parallel. Finishes in `max(time)` instead of `sum(time)`.

### LAB 06 — File System (fs) Module & CLI Notes App
- **Files:** `Lab-06/fs-demo.js`, `Lab-06/read-async.js`, `Lab-06/read-sync.js`, `Lab-06/add-note.js`, `Lab-06/read-notes.js`
- **Why async `readFile()` does not block:** It delegates disk I/O to libuv thread pool, freeing the main thread immediately. Sync `readFileSync()` blocks the single thread completely.
- **Race Condition Warning:** If two users write to `notes.txt` simultaneously, file writes may interleave or corrupt data. Databases provide atomic transactions to solve this.
- **CLI Arguments:** Accessed via `process.argv.slice(2)`.

### LAB 07 — EventEmitter Architecture
- **Files:** `Lab-07/emitter.js`, `Lab-07/07-practical-example/app.js`
- **Methods:**
  - `emitter.on(event, listener)`: Registers permanent listener.
  - `emitter.emit(event, ...args)`: Triggers event synchronously.
  - `emitter.once(event, listener)`: Triggers only once and auto-removes.
  - `emitter.removeListener(event, listener)`: Removes listener to prevent memory leaks.
- **Error Event Rule:** Always handle `emitter.on('error', ...)`, otherwise an unhandled `'error'` event will crash the entire Node.js process!

### LAB 08 — Integrated Monolithic Server (Local + Live Cloud)
- **Files:** `Lab-08/server.js`, `Lab-08/labs.js`, `Lab-08/modules/logger.js`
- **Server Labs Integration:** Uses `module.exports = handler` and request URL rewrites (`req.url = remainder + query`).
- **Script Labs Integration:** Executes files safely with `child_process.execFile(process.execPath, [file], { timeout: 5000 })`.
- **Event-Driven Logging:** Custom `Logger` class extends `EventEmitter` emitting `"request"` on each hit, writing asynchronously to `logs/server.log`.
- **Environment Agnostic:** Checks `process.env.RENDER ? "live (Render)" : "local"`.

---

## 3. Top 15 Quick Viva Answers

1. **require vs import:** require is CommonJS and synchronous; import is ES Modules and static/asynchronous.
2. **module.exports vs exports:** module.exports is the actual exported object; exports is only a variable reference pointing to it.
3. **package.json vs package-lock.json:** package.json defines version ranges; package-lock.json locks exact installed versions and hashes.
4. **process.nextTick vs setImmediate:** process.nextTick runs immediately after current operation; setImmediate runs in the Check phase.
5. **Stream:** An interface for reading/writing data chunk-by-chunk without loading entire file into RAM.
6. **Buffer:** Handles raw binary memory outside the V8 heap.
7. **EADDRINUSE:** Port is already in use by another process. Fix with `npx kill-port <port>` or specify another port.
8. **path.join vs path.resolve:** path.join concatenates segments; path.resolve resolves to an absolute path.
9. **util.promisify:** Converts callback-based functions into Promise-returning functions.
10. **Single-threaded limitation:** Heavy CPU loops block all clients; offload CPU tasks to Worker Threads or microservices.

---

## 4. Practical Terminal Running Cheatsheet

- **Start Portfolio:** `node portfolio-server.js` (Runs on http://localhost:5050)
- **Start Lab-08:** `cd Lab-08 && npm start` (Runs on http://localhost:3000)
- **Health Check:** http://localhost:3000/health
- **Lab 01 Server:** http://localhost:3000/labs/01/app/
- **Lab 02 Server Filter:** http://localhost:3000/labs/02/app/students?course=BCA
- **Lab 05 Script Execution:** http://localhost:3000/labs/05/run
- **Dashboard Metrics:** http://localhost:3000/api/dashboard
