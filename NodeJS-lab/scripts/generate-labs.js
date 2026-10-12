/**
 * Dynamic Lab Scanner & Metadata Generator
 * Generates labs.json with comprehensive details for all Lab-01 through Lab-08
 * Author: Bhaskar Mall | Dev Sanskriti Vishwavidyalaya (DSVV)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'labs.json');

function filenameToCaption(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper to recursively collect files from a directory
function collectFilesRecursively(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === 'logs') {
      continue;
    }
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (item.isDirectory()) {
      results = results.concat(collectFilesRecursively(fullPath, baseDir));
    } else {
      results.push({
        fullPath,
        relPath,
        name: item.name
      });
    }
  }

  return results;
}

// Process single lab folder
function processLab(dirName) {
  const labDir = path.join(ROOT_DIR, dirName);
  if (!fs.existsSync(labDir) || !fs.statSync(labDir).isDirectory()) return null;

  const match = dirName.match(/\d+/);
  if (!match) return null;
  const labNo = parseInt(match[0], 10);
  const formattedLabNo = `LAB ${String(labNo).padStart(2, '0')}`;

  const allFiles = collectFilesRecursively(labDir);
  const sourceFiles = [];
  const screenshots = [];
  let totalLines = 0;
  const techSet = new Set(['Node.js', 'JavaScript']);

  allFiles.forEach(({ fullPath, relPath, name }) => {
    const ext = path.extname(name).toLowerCase();

    // Check if screenshot
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      screenshots.push({
        filename: name,
        path: `${dirName}/${relPath}`,
        caption: filenameToCaption(name)
      });
      return;
    }

    // Skip non-code binaries
    if (['.pdf', '.zip', '.tar', '.gz'].includes(ext)) return;

    let content = '';
    try {
      content = fs.readFileSync(fullPath, 'utf8');
    } catch (_) {
      return;
    }

    const lines = content.split('\n').length;
    totalLines += lines;

    // Detect technologies
    if (content.includes("require('http')") || content.includes('require("http")')) {
      techSet.add('HTTP Module');
    }
    if (content.includes("require('fs')") || content.includes('require("fs")')) {
      techSet.add('File System (fs)');
    }
    if (content.includes('EventEmitter') || content.includes("require('events')") || content.includes('require("events")')) {
      techSet.add('EventEmitter');
    }
    if (content.includes("require('url')") || content.includes('require("url")')) {
      techSet.add('URL Module');
    }
    if (content.includes('Promise') || content.includes('resolve(')) {
      techSet.add('Promises');
    }
    if (content.includes('async ') && content.includes('await ')) {
      techSet.add('Async/Await');
    }
    if (content.includes('req.url') || content.includes('statusCode')) {
      techSet.add('REST API');
    }
    if (content.includes('child_process') || content.includes('execFile')) {
      techSet.add('child_process');
    }
    if (content.includes('slugify')) {
      techSet.add('NPM (slugify)');
    }

    sourceFiles.push({
      filename: relPath,
      name: name,
      ext: ext.replace('.', ''),
      sizeBytes: fs.statSync(fullPath).size,
      lines: lines,
      content: content
    });
  });

  // Metadata presets per lab
  let meta = {
    title: `Lab ${labNo}`,
    description: 'Node.js laboratory practical implementation.',
    objective: 'Practical implementation of Node.js concepts.',
    concepts: ['Node.js Architecture'],
    howToRun: `node index.js`,
    entryFile: sourceFiles[0] ? sourceFiles[0].filename : ''
  };

  if (labNo === 1) {
    meta = {
      title: 'Node.js Setup, Variables & Simple HTTP Server',
      description: 'Introduction to Node.js runtime, project initialization with npm, variables, data types, console outputs, and base HTTP server initialization.',
      objective: 'Demonstrate Node.js installation, running JS outside the browser, data types inspection with typeof, and establishing a basic HTTP listener.',
      concepts: ['Node.js Architecture', 'V8 JavaScript Engine', 'Variables & Scope', 'Data Types (typeof)', 'HTTP Module', 'Browser vs Node.js'],
      howToRun: 'node app.js\nnode server.js',
      entryFile: 'server.js'
    };
    techSet.add('CLI');
    techSet.add('HTTP Module');
  } else if (labNo === 2) {
    meta = {
      title: 'HTTP Web Server & Custom Routing',
      description: 'Building custom HTTP web servers using Node.js core http module, creating multiple endpoints (/about, /college, /profile, /students), and exploring the Event Loop.',
      objective: 'Understand how Node.js handles incoming requests, sets HTTP headers, routes request URLs, and returns plain text or JSON output.',
      concepts: ['HTTP Server Architecture', 'Custom Routing (req.url)', 'HTTP Status Codes', 'JSON Response Headers', 'Event Loop & libuv'],
      howToRun: 'node server.js',
      entryFile: 'server.js'
    };
    techSet.add('HTTP Module');
    techSet.add('REST API');
  } else if (labNo === 3) {
    meta = {
      title: 'Student Information Server & Async Food Delivery',
      description: 'Multi-route HTTP server serving student database records with dynamic search, and asynchronous food delivery process simulation.',
      objective: 'Implement dynamic route parameter handling in Node.js and master asynchronous execution with Promises & async/await.',
      concepts: ['HTTP Web Server', 'Dynamic Route Matching', 'Array Searching & Filtering', 'Asynchronous Execution', 'Promises'],
      howToRun: 'node student-server.js\nnode food.js',
      entryFile: 'student-server.js'
    };
    techSet.add('HTTP Module');
    techSet.add('Promises');
    techSet.add('Async/Await');
  } else if (labNo === 4) {
    meta = {
      title: 'Advanced Student REST API & Node.js Modules',
      description: 'Full-featured REST API supporting URL query parameters (course, minMarks, sort, order), endpoint routing, and Node.js module resolution.',
      objective: 'Create a robust HTTP API with query parsing, input validation, multi-field sorting, status codes, and explore Node.js module architecture.',
      concepts: ['RESTful API Architecture', 'URL Query Parameters', 'Input Validation', 'Core Modules (path, os, url)', 'Third-Party Modules'],
      howToRun: 'node advanced-server.js\nnode app.js',
      entryFile: 'advanced-server.js'
    };
    techSet.add('REST API');
    techSet.add('URL Module');
  } else if (labNo === 5) {
    meta = {
      title: 'Asynchronous JavaScript & Food Delivery Tracker',
      description: 'Comprehensive comparison of asynchronous paradigms: Callbacks, Promises, Promise Chaining, Async/Await, and Promise.all() concurrency.',
      objective: 'Master non-blocking asynchronous programming patterns in Node.js through a practical Food Delivery Tracking simulation.',
      concepts: ['Callbacks & Callback Hell', 'Promises (resolve/reject)', 'Promise Chaining', 'Async/Await & try/catch', 'Promise.all() Concurrency', 'Event Loop Async Execution'],
      howToRun: 'node callback-version.js\nnode promise-version.js\nnode chaining-version.js\nnode async-await-version.js\nnode concurrent-orders.js',
      entryFile: 'async-await-version.js'
    };
    techSet.add('Promises');
    techSet.add('Async/Await');
  } else if (labNo === 6) {
    meta = {
      title: 'File System (fs) Module & CLI Notes App',
      description: 'Working with Node.js fs module for synchronous & asynchronous file I/O, writing, appending, unlinking files, fs.promises with Async/Await, and building a CLI Notes App.',
      objective: 'Learn file manipulation in Node.js using both sync/async methods, error handling, file promises, and persistent storage via command-line arguments.',
      concepts: ['File System (fs) Module', 'Synchronous vs Asynchronous I/O', 'fs.promises API', 'CLI Arguments (process.argv)', 'File Append & Unlink'],
      howToRun: 'node fs-demo.js\nnode add-note.js "Study Node.js"\nnode read-notes.js',
      entryFile: 'fs-demo.js'
    };
    techSet.add('File System (fs)');
  } else if (labNo === 7) {
    meta = {
      title: 'EventEmitter Architecture & Custom Event Systems',
      description: 'Deep dive into Node.js events module: EventEmitter class, custom events, event arguments, multiple listeners, once() listeners, listener removal, and practical order tracking.',
      objective: 'Master Node.js event-driven architecture, decoupled publisher/subscriber communication, and lifecycle management with EventEmitter.',
      concepts: ['Event-Driven Architecture', 'EventEmitter Class', 'Custom Events & Payloads', 'Multiple Listeners Execution', 'once() vs on()', 'Order Lifecycle Management'],
      howToRun: 'node emitter.js\nnode 07-practical-example/app.js',
      entryFile: 'emitter.js'
    };
    techSet.add('EventEmitter');
  } else if (labNo === 8) {
    meta = {
      title: 'Integrated Lab Server: All Previous Labs in One Server (Local + Live)',
      description: 'A master monolithic server that brings all previous labs (Lab 01 to Lab 07) together into ONE Node.js server without rewriting them. Reuses server handlers via module.exports and runs script labs via child_process.execFile. Features EventEmitter logging to server.log, dynamic routing, health check, slugified registry, and Render cloud readiness.',
      objective: 'Unify decoupled Node.js applications into a singular integrated server, implement event-driven file logging, execute child processes with timeout guards, and prepare for local and cloud (Render) deployments.',
      concepts: ['Monolithic Integration Architecture', 'module.exports & require() Delegation', 'child_process.execFile() Sandbox Execution', 'EventEmitter Logging System', 'fs.promises & Stream Pipeline', 'Slugify URL Formatting', 'Environment-Adaptive Configuration (PORT, RENDER)'],
      howToRun: 'cd Lab-08\nnpm install\nnpm start',
      entryFile: 'server.js'
    };
    techSet.add('HTTP Module');
    techSet.add('EventEmitter');
    techSet.add('File System (fs)');
    techSet.add('child_process');
    techSet.add('NPM (slugify)');
    techSet.add('REST API');
  }

  return {
    folder: dirName,
    labNo: labNo,
    formattedLabNo: formattedLabNo,
    title: meta.title,
    description: meta.description,
    objective: meta.objective,
    concepts: meta.concepts,
    technologies: Array.from(techSet),
    status: 'Completed',
    date: '2026-10-12',
    student: {
      name: 'Bhaskar Mall',
      scholarNo: '23145005',
      course: 'BCA (VII Semester)',
      semester: 'VII',
      college: 'Dev Sanskriti Vishwavidyalaya (DSVV)'
    },
    entryFile: meta.entryFile,
    howToRun: meta.howToRun,
    files: sourceFiles,
    screenshots: screenshots,
    totalLines: totalLines
  };
}

// Find all lab directories
const dirEntries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
const labDirs = dirEntries
  .filter((e) => e.isDirectory() && /^Lab-\d+$/i.test(e.name))
  .map((e) => e.name)
  .sort((a, b) => {
    const nA = parseInt(a.match(/\d+/)[0], 10);
    const nB = parseInt(b.match(/\d+/)[0], 10);
    return nA - nB;
  });

console.log(`Found ${labDirs.length} Lab folders: ${labDirs.join(', ')}`);

const labs = labDirs.map(processLab).filter(Boolean);

// Calculate Global Stats
const allTechnologies = Array.from(new Set(labs.flatMap((l) => l.technologies)));
const stats = {
  totalLabs: labs.length,
  totalJsFiles: labs.reduce((acc, l) => acc + l.files.filter((f) => f.ext === 'js').length, 0),
  totalProjects: labs.filter((l) => l.technologies.includes('HTTP Module') || l.technologies.includes('REST API')).length,
  totalScreenshots: labs.reduce((acc, l) => acc + l.screenshots.length, 0),
  totalFiles: labs.reduce((acc, l) => acc + l.files.length, 0),
  totalLinesOfCode: labs.reduce((acc, l) => acc + l.totalLines, 0),
  allTechnologies: allTechnologies
};

const output = {
  generatedAt: new Date().toISOString(),
  student: {
    name: 'Bhaskar Mall',
    course: 'BCA (Bachelor of Computer Applications)',
    semester: 'VII Semester',
    scholarNo: '23145005',
    subject: 'CS403NOD - Node.js Architecture & Backend Development',
    college: 'Dev Sanskriti Vishwavidyalaya (DSVV)',
    githubUrl: 'https://github.com/bhaskar945521/lab-assignment'
  },
  stats: stats,
  labs: labs
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
console.log(`Successfully generated ${OUTPUT_FILE} with ${labs.length} labs!`);
