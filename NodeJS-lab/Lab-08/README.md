# CS403NOD - Lab Assignment 08
## Integrated Lab Server: All Previous Labs in One Server (Local + Live)

- **Student Name:** Bhaskar Mall
- **Scholar / Roll Number:** 23145005
- **Course & Semester:** BCA VII Semester
- **Subject:** CS403NOD – Node.js Architecture & Backend Development
- **Department:** Department of Computer Science
- **Institution:** Dev Sanskriti Vishwavidyalaya (DSVV), Haridwar
- **Lab Number:** 08

---

## 1. Project Description
This project brings all previous Node.js practical labs (Lab 01 to Lab 07) together into a single, cohesive Node.js server without rewriting the original assignments. It directly reuses the existing lab code using `module.exports` and `require()` for HTTP server labs, and executes standalone script labs via Node.js `child_process.execFile()`. It provides source code viewers, live execution endpoints, screenshot previews, request logging via `EventEmitter`, and a live dashboard.

---

## 2. List of Labs Included

| Lab No. | Title | Topic / Concepts | Type | Primary File |
|---|---|---|---|---|
| **01** | Simple HTTP Server | `http` module, request routing, headers | Server | `../Lab-01/server.js` |
| **02** | Student Directory API | JSON response, query parameters (`/students?course=BCA`) | Server | `../Lab-02/server.js` |
| **03** | Async JS Food Delivery | Promises, async/await delivery simulation | Script | `../Lab-03/food.js` |
| **04** | Modules and npm | Core modules (`path`, `os`, `url`) & `slugify` | Script | `../Lab-04/app.js` |
| **05** | Async Food Delivery Tracker | Callbacks, Promises, async/await comparison | Script | `../Lab-05/async-await-version.js` |
| **06** | File System (fs) | `fs` module, sync & async file operations | Script | `../Lab-06/fs-demo.js` |
| **07** | EventEmitter | `events` module, custom events & listeners | Script | `../Lab-07/emitter.js` |
| **08** | Integrated Lab Server | Full portal, logger, dynamic routing, child_process | Server | `server.js` |

---

## 3. Route Table

| Method | Route | Description & Expected Behavior |
|---|---|---|
| `GET` | `/` | Portal page (HTML): displays environment status (`local` or `live (Render)`) and all labs with direct links to `/labs/<id>` |
| `GET` | `/about` | JSON response with project details, student name (`process.env.STUDENT_NAME || 'Bhaskar Mall'`), and total labs count |
| `GET` | `/health` | JSON response `{ status: 'ok', environment, uptimeSeconds }` (environment is `live (Render)` when `process.env.RENDER` exists) |
| `GET` | `/labs` | JSON array of all labs from `labs.js` with slugified URL titles generated via the `slugify` package |
| `GET` | `/labs/:id` | HTML page for a specific lab showing title, topic, run/open link, escaped source code, and screenshots |
| `GET` | `/labs/:id/run` | Script labs: executes file with `child_process.execFile(process.execPath, [file], { timeout: 5000 })` returning `{ ok, output, error }` |
| `GET` | `/labs/:id/app/...` | Server labs: strips `/labs/<id>/app` prefix from `req.url` and invokes the exported `handler(req, res)` |
| `GET` | `/screenshots/<name>` | Safely streams `.png` / `.jpg` images from `public/screenshots` using `fs.createReadStream` and `path.basename` |
| `GET` | `/api/dashboard` | Uses `Promise.all` to read `logs/server.log` and `public/screenshots/` concurrently, returning `{ labs, screenshots, requestsLogged }` |
| `*` | Any other route | Returns 404 JSON `{ error: 'Route not found', path }` |

---

## 4. Technologies Used
- **Node.js Core Modules:** `http`, `fs`, `fs.promises`, `path`, `url`, `events` (`EventEmitter`), `child_process` (`execFile`), `util` (`promisify`)
- **NPM Package:** `slugify` (for semantic URL slugs in `/labs`)
- **Hosting Platforms:** Local Node.js runtime, Render (Cloud deployment)

---

## 5. How to Run Locally

```bash
# Navigate to Lab-08 folder
cd Lab-08

# Install dependencies (slugify)
npm install

# Start the integrated server
npm start
```

Once running, visit:
- **Home Portal:** http://localhost:3000/
- **Health Check:** http://localhost:3000/health
- **About Info:** http://localhost:3000/about
- **Labs JSON Registry:** http://localhost:3000/labs
- **Lab 01 Server:** http://localhost:3000/labs/01/app/
- **Lab 02 Server (Filtered):** http://localhost:3000/labs/02/app/students?course=BCA
- **Lab 03 Script Execution:** http://localhost:3000/labs/03/run
- **Lab 04 Script Execution:** http://localhost:3000/labs/04/run
- **Lab 06 Script Execution:** http://localhost:3000/labs/06/run
- **Lab 07 Script Execution:** http://localhost:3000/labs/07/run
- **Live Dashboard API:** http://localhost:3000/api/dashboard
- **404 Route Verification:** http://localhost:3000/labs/99

---

## 6. Live Deployment (Render Free Tier)
- **Deployment Platform:** [Render](https://render.com)
- **Runtime:** Node.js
- **Root Directory:** *(leave blank — repository root)*
- **Build Command:**
  ```bash
  for d in */; do if [ -f "$d/package.json" ]; then (cd "$d" && npm install); fi; done
  ```
- **Start Command:**
  ```bash
  node NodeJS-lab/Lab-08/server.js
  ```
  *(or `node Lab-08/server.js` if deploying from NodeJS-lab directory)*
- **Environment Variables:**
  - `STUDENT_NAME`: `Bhaskar Mall`
  - `RENDER`: `true`

---

## 7. Screenshots
All local and live screenshots are stored in `public/screenshots/`:
- `lab01-local.png`, `lab02-local.png`, `lab03-local.png`, `lab04-local.png`, `lab05-local.png`, `lab06-local.png`, `lab07-local.png`, `lab08-local.png`

---

## 8. What I Learned
Through this lab assignment, I learned:
1. How to architecturalize a monolithic integrated server that unifies decoupled modules without modifying legacy source implementations.
2. How to leverage `EventEmitter` for non-blocking asynchronous request logging to disk while protecting the runtime from fatal crashes with defensive error handling.
3. How to execute standalone scripts safely using `child_process.execFile` with explicit execution timeouts and buffer management.
4. How to seamlessly handle URL prefix rewrites and delegate HTTP requests dynamically between multiple exported request handlers.
