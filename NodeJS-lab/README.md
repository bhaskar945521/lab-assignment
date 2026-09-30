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
| **Lab 01** | Node.js Setup, Variables & Data Types | Node.js, V8 Engine, typeof Data Types, Browser vs Node.js | `node app.js` |
| **Lab 02** | HTTP Web Server & Custom Routing | HTTP Module, Routing (`/about`, `/profile`), Event Loop, libuv | `node server.js` |
| **Lab 03** | Multi-Route Student Information Server | HTTP Server, 12 Student Database Records, Dynamic Search by ID/Name | `node student-server.js` |
| **Lab 04** | Advanced Student REST API | RESTful API, Query Filters (`minMarks`, `sort`, `order`), URL Module | `node advanced-server.js` |
| **Lab 05** | Asynchronous JS & Food Delivery Tracker | Callbacks, Promises, Promise Chaining, Async/Await, `Promise.all()` | `node async-await-version.js` |
| **Lab 06** | File System (`fs`) Module & CLI Notes App | `fs.readFile`, `fs.writeFile`, `fs.unlink`, `fs.promises`, CLI Notes App | `node add-note.js` |

---

## Automated Build & Netlify Deployment

This portfolio is built to be deployed **statically on Netlify** without requiring a live Node.js/Express backend server or MongoDB database.

### Build Script (`scripts/generate-labs.js`)
When deployed or built locally, `npm run build` runs `scripts/generate-labs.js`. This script automatically:
1. Scans all `Lab-01`, `Lab-02`, ... `Lab-XX` directories.
2. Extracts code metadata, file contents, concepts, and image screenshots.
3. Generates `labs.json`.
4. Prepares the static portfolio site for Netlify.

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "."
```

---

## Adding Future Labs (Workflow)

When creating future lab assignments (e.g. `Lab-07`, `Lab-08`):

1. Create a new directory named `Lab-07/` inside `NodeJS-lab/`.
2. Add your JavaScript files, `README.md` (template available in `Lab-Template/`), and terminal output images in `screenshots/`.
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Add Lab 07"
   git push
   ```
4. **Netlify automatically triggers a new deployment**, runs `npm run build`, and `Lab-07` immediately appears on the live portfolio homepage with full search, syntax highlighting, and screenshot lightbox support!

---

## Local Development & Testing

To test the generator script locally:
```bash
npm run build
```

To run the portfolio preview:
- Open `index.html` in any web browser, OR
- Run `npm start` (`node portfolio-server.js`) to open http://localhost:5050.