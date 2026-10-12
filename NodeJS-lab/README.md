# Node.js Practical Lab Portfolio — Bhaskar Mall

A complete, professional, responsive Node.js laboratory portfolio created for BCA VII Semester practical work (**CS403NOD — Node.js Architecture & Backend Engineering**).

This website showcases real source code, HTTP web servers, REST APIs, asynchronous JavaScript workflows, file system applications, terminal outputs, and screenshots.

---

## Student Details

- **Name:** Bhaskar Mall
- **Scholar Number:** 23145005
- **Course:** BCA (Bachelor of Computer Applications)
- **Semester:** VII
- **Subject:** CS403NOD — Node.js
- **Institution:** Dev Sanskriti Vishwavidyalaya (DSVV)
- **GitHub Repository:** [bhaskar945521/lab-assignment](https://github.com/bhaskar945521/lab-assignment)

---

## Discovered Labs Summary

| Lab | Title | Key Technologies & Concepts | Entry Point |
|---|---|---|---|
| **Lab 01** | Node.js Setup, Variables & Simple HTTP Server | Node.js, V8 Engine, typeof Data Types, HTTP Module | `node app.js` / `node server.js` |
| **Lab 02** | HTTP Web Server & Custom Routing | HTTP Module, Routing (`/about`, `/profile`, `/students`), Event Loop | `node server.js` |
| **Lab 03** | Multi-Route Student Server & Async Food Delivery | HTTP Server, 12 Student Database Records, Promises | `node student-server.js` / `node food.js` |
| **Lab 04** | Advanced Student REST API & Node.js Modules | RESTful API, Query Filters (`course`, `minMarks`, `sort`), Core Modules | `node advanced-server.js` / `node app.js` |
| **Lab 05** | Asynchronous JS & Food Delivery Tracker | Callbacks, Promises, Promise Chaining, Async/Await, `Promise.all()` | `node async-await-version.js` |
| **Lab 06** | File System (`fs`) Module & CLI Notes App | `fs.readFile`, `fs.writeFile`, `fs.unlink`, `fs.promises`, CLI Notes App | `node fs-demo.js` / `node add-note.js` |
| **Lab 07** | Events & EventEmitter Architecture | `events` Module, Custom Events, Multiple Listeners, Order System | `node emitter.js` |
| **Lab 08** | Integrated Lab Server (Local + Live) | Monolithic Server, Handler Delegation, Child Process Execution, Logger | `node server.js` |

---

## Automated Build & Deployment
This portfolio is built to be deployed seamlessly:
- **Netlify**: Builds via `npm run build` (`scripts/generate-labs.js`) and serves the static portfolio.
- **Render / Local**: `Lab-08/server.js` unifies all previous labs under one live port.

---

## Local Development & Testing

To test the generator script locally:
```bash
npm run build
```

To run the portfolio preview:
- Open `index.html` in any web browser, OR
- Run `npm start` (`node portfolio-server.js`) to open http://localhost:5050.