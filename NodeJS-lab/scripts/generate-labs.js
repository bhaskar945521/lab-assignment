const fs = require('fs');
const path = require('path');

// Target directory is NodeJS-lab directory
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'labs.json');

console.log('Generating labs dataset for portfolio...');
console.log('Root Directory:', ROOT_DIR);

/**
 * Format string to title case
 */
function cleanTitle(str) {
  return str
    .replace(/^Lab[-_]?\d+[:_\-\s]*/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Convert filename to readable caption
 */
function filenameToCaption(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Parse markdown headings and content
 */
function parseReadme(content) {
  const meta = {
    title: '',
    objective: '',
    concepts: [],
    implementation: '',
    howItWorks: '',
    howToRun: '',
    output: '',
    student: {}
  };

  if (!content) return meta;

  const lines = content.split(/\r?\n/);
  let currentSection = '';
  let currentBuffer = [];

  function flushBuffer() {
    if (!currentSection) return;
    const text = currentBuffer.join('\n').trim();
    if (currentSection === 'title') meta.title = text.replace(/^#\s*/, '');
    else if (currentSection === 'objective') meta.objective = text;
    else if (currentSection === 'concepts') {
      meta.concepts = text
        .split('\n')
        .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter(Boolean);
    } else if (currentSection === 'implementation') meta.implementation = text;
    else if (currentSection === 'howitworks') meta.howItWorks = text;
    else if (currentSection === 'howtorun') meta.howToRun = text;
    else if (currentSection === 'output') meta.output = text;
    currentBuffer = [];
  }

  lines.forEach(line => {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/i);
    if (headingMatch) {
      flushBuffer();
      const hText = headingMatch[1].toLowerCase();
      if (hText.includes('title') || line.startsWith('# ')) currentSection = 'title';
      else if (hText.includes('objective') || hText.includes('purpose')) currentSection = 'objective';
      else if (hText.includes('concept') || hText.includes('theory') || hText.includes('topics')) currentSection = 'concepts';
      else if (hText.includes('implement') || hText.includes('practical') || hText.includes('work')) currentSection = 'implementation';
      else if (hText.includes('how it works') || hText.includes('explanation')) currentSection = 'howitworks';
      else if (hText.includes('run') || hText.includes('execution')) currentSection = 'howtorun';
      else if (hText.includes('output')) currentSection = 'output';
      else currentSection = hText.replace(/[^a-z]/g, '');
    } else {
      currentBuffer.push(line);
      // Student details extraction
      if (line.includes('Name:')) meta.student.name = line.split('Name:')[1].trim().replace(/\*/g, '');
      if (line.includes('Scholar Number:')) meta.student.scholarNo = line.split('Scholar Number:')[1].trim().replace(/\*/g, '');
      if (line.includes('Course:')) meta.student.course = line.split('Course:')[1].trim().replace(/\*/g, '');
      if (line.includes('Semester:')) meta.student.semester = line.split('Semester:')[1].trim().replace(/\*/g, '');
    }
  });

  flushBuffer();
  return meta;
}

/**
 * Scan Lab directory
 */
function processLabDir(dirName) {
  const labPath = path.join(ROOT_DIR, dirName);
  const match = dirName.match(/^Lab[-_]?(\d+)$/i);
  if (!match) return null;

  const labNo = parseInt(match[1], 10);
  const formattedLabNo = `LAB ${String(labNo).padStart(2, '0')}`;

  const allDirFiles = fs.readdirSync(labPath);

  // Look for README
  let readmeFile = allDirFiles.find(f => /^readme\.md$/i.test(f));
  let readmeContent = '';
  let readmeMeta = {};
  if (readmeFile) {
    readmeContent = fs.readFileSync(path.join(labPath, readmeFile), 'utf8');
    readmeMeta = parseReadme(readmeContent);
  }

  // Look for lab.json metadata override if available
  let jsonMeta = {};
  const labJsonPath = path.join(labPath, 'lab.json');
  if (fs.existsSync(labJsonPath)) {
    try {
      jsonMeta = JSON.parse(fs.readFileSync(labJsonPath, 'utf8'));
    } catch (e) {
      console.warn(`Error reading ${labJsonPath}:`, e.message);
    }
  }

  // Find screenshots / images
  const screenshotExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  let screenshots = [];

  function collectImages(folderRelative) {
    const fullFolderPath = path.join(labPath, folderRelative);
    if (fs.existsSync(fullFolderPath) && fs.statSync(fullFolderPath).isDirectory()) {
      const files = fs.readdirSync(fullFolderPath);
      files.forEach(f => {
        const ext = path.extname(f).toLowerCase();
        if (screenshotExts.includes(ext)) {
          const relPath = path.join(dirName, folderRelative, f).replace(/\\/g, '/');
          screenshots.push({
            filename: f,
            path: relPath,
            caption: filenameToCaption(f)
          });
        }
      });
    }
  }

  // Direct images in lab folder
  allDirFiles.forEach(f => {
    const ext = path.extname(f).toLowerCase();
    if (screenshotExts.includes(ext)) {
      screenshots.push({
        filename: f,
        path: `${dirName}/${f}`,
        caption: filenameToCaption(f)
      });
    }
  });

  // Check subdirectories like screenshots/ or images/
  collectImages('screenshots');
  collectImages('images');

  // Collect source files
  const codeExts = ['.js', '.json', '.txt', '.html', '.css', '.md'];
  const sourceFiles = [];
  let totalLines = 0;
  const techSet = new Set(['Node.js', 'JavaScript']);

  allDirFiles.forEach(f => {
    if (f.startsWith('.') || f === 'node_modules' || f === 'screenshots' || f === 'images') return;
    const fullPath = path.join(labPath, f);
    if (!fs.statSync(fullPath).isFile()) return;

    const ext = path.extname(f).toLowerCase();
    if (screenshotExts.includes(ext)) return;

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n').length;
    totalLines += lines;

    // Detect technologies from code keywords
    if (content.includes("require('http')") || content.includes('require("http")')) {
      techSet.add('HTTP Module');
    }
    if (content.includes("require('fs')") || content.includes('require("fs")')) {
      techSet.add('File System (fs)');
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

    sourceFiles.push({
      filename: f,
      relativePath: `${dirName}/${f}`,
      ext: ext.replace('.', ''),
      sizeBytes: fs.statSync(fullPath).size,
      lines: lines,
      content: content
    });
  });

  // Default title and description fallbacks per lab if missing
  let title = jsonMeta.title || readmeMeta.title || `Lab ${labNo}`;
  let description = jsonMeta.description || readmeMeta.objective || 'Node.js laboratory practical implementation.';
  let objective = jsonMeta.objective || readmeMeta.objective || 'Practical implementation of Node.js concepts.';
  let concepts = jsonMeta.concepts || ((readmeMeta.concepts && readmeMeta.concepts.length) ? readmeMeta.concepts : ['Node.js Fundamentals']);
  let howToRun = jsonMeta.howToRun || readmeMeta.howToRun || '';
  let entryFile = jsonMeta.entryFile || '';

  // Specific lab enrichments based on real project code
  if (labNo === 1) {
    title = 'Node.js Setup, Variables & Data Types';
    description = 'Introduction to Node.js environment, project initialization with npm, variable scopes, JS data types, and Browser vs Node.js execution differences.';
    objective = 'Demonstrate Node.js installation, running JS files outside browser, using typeof for data types, and understanding runtime environment differences.';
    concepts = ['Node.js Architecture', 'V8 JavaScript Engine', 'Variables & Scope', 'Data Types (typeof)', 'Browser vs Node.js'];
    techSet.add('CLI');
    entryFile = 'app.js';
    howToRun = 'node app.js';
  } else if (labNo === 2) {
    title = 'HTTP Web Server & Custom Routing';
    description = 'Building a custom HTTP web server using Node.js core http module, creating multiple endpoints (/about, /college, /profile), and learning Event Loop concepts.';
    objective = 'Understand how Node.js http module handles incoming requests, sets HTTP headers, routes request URLs, and returns plain text or JSON output.';
    concepts = ['HTTP Server Architecture', 'Custom Routing (req.url)', 'HTTP Status Codes', 'JSON Response Headers', 'Event Loop & libuv'];
    techSet.add('HTTP Module');
    entryFile = 'server.js';
    howToRun = 'node server.js';
  } else if (labNo === 3) {
    title = 'Multi-Route Student Information Server';
    description = 'HTTP server serving student database records. Features an index page listing all 12 BCA students and dynamic lookup routes by ID (/01, /03) or student name.';
    objective = 'Implement dynamic route parameter handling in plain Node.js to filter and return student profile objects in clean text formatting.';
    concepts = ['HTTP Web Server', 'Dynamic Route Matching', 'Array Searching & Filtering', 'String Normalization', 'Plain Text Formatting'];
    techSet.add('HTTP Module');
    entryFile = 'student-server.js';
    howToRun = 'node student-server.js';
  } else if (labNo === 4) {
    title = 'Advanced Student REST API with Query Filtering & Sorting';
    description = 'Full-featured HTTP REST API supporting URL query parameters (minMarks, sort, order, search), endpoint routing (/students/course/BCA), and strict HTTP error responses.';
    objective = 'Create a robust HTTP API with query parsing, input validation, case-insensitive searching, multi-field sorting, and proper HTTP status codes (200, 400, 404, 405).';
    concepts = ['RESTful API Architecture', 'URL Query Parameters', 'Input Validation', 'Array Sorting & Filtering', 'HTTP Error Handling (400, 404, 405)'];
    techSet.add('REST API');
    techSet.add('URL Module');
    entryFile = 'advanced-server.js';
    howToRun = 'node advanced-server.js';
  } else if (labNo === 5) {
    title = 'Asynchronous JavaScript & Food Delivery Tracker';
    description = 'Comprehensive comparison of asynchronous paradigms in Node.js: Callbacks, Promises, Promise Chaining, Async/Await, and Promise.all() concurrent order processing.';
    objective = 'Master non-blocking asynchronous programming patterns in Node.js through a practical Food Delivery Tracking simulation.';
    concepts = ['Callbacks & Callback Hell', 'Promises (resolve/reject)', 'Promise Chaining', 'Async/Await & try/catch', 'Promise.all() Concurrency', 'Event Loop Async Execution'];
    techSet.add('Promises');
    techSet.add('Async/Await');
    entryFile = 'async-await-version.js';
    howToRun = 'node callback-version.js\nnode promise-version.js\nnode chaining-version.js\nnode async-await-version.js\nnode concurrent-orders.js';
  } else if (labNo === 6) {
    title = 'File System (fs) Module & CLI Notes App';
    description = 'Working with Node.js fs module for synchronous & asynchronous file I/O, writing, appending, unlinking files, fs.promises with Async/Await, and building a CLI Notes App.';
    objective = 'Learn file manipulation in Node.js using both sync/async methods, error handling, file promises, and persistent storage via command-line arguments.';
    concepts = ['File System (fs) Module', 'Synchronous vs Asynchronous I/O', 'fs.promises API', 'CLI Arguments (process.argv)', 'File Append & Unlink'];
    techSet.add('File System (fs)');
    entryFile = 'add-note.js';
    howToRun = 'node add-note.js "Study Node.js"\nnode read-notes.js';
  }

  // Tech list array
  const technologies = Array.from(techSet);

  return {
    folder: dirName,
    labNo: labNo,
    formattedLabNo: formattedLabNo,
    title: title,
    description: description,
    objective: objective,
    concepts: concepts,
    technologies: technologies,
    status: 'Completed',
    date: readmeMeta.student ? readmeMeta.student.date || '2026-08-01' : '2026-08-01',
    student: {
      name: (readmeMeta.student && readmeMeta.student.name) || 'Bhaskar Mall',
      scholarNo: (readmeMeta.student && readmeMeta.student.scholarNo) || '23145005',
      course: (readmeMeta.student && readmeMeta.student.course) || 'BCA',
      semester: (readmeMeta.student && readmeMeta.student.semester) || 'VII'
    },
    entryFile: entryFile || (sourceFiles[0] ? sourceFiles[0].filename : ''),
    howToRun: howToRun || `node ${entryFile || 'index.js'}`,
    files: sourceFiles,
    screenshots: screenshots,
    totalLines: totalLines
  };
}

// Main execution
const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
const labDirs = entries
  .filter(e => e.isDirectory() && /^Lab[-_]?\d+$/i.test(e.name))
  .map(e => e.name)
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB;
  });

console.log(`Discovered ${labDirs.length} Lab folders: ${labDirs.join(', ')}`);

const labs = labDirs.map(processLabDir).filter(Boolean);

// Calculate Global Portfolio Stats
const stats = {
  totalLabs: labs.length,
  totalJsFiles: labs.reduce((acc, l) => acc + l.files.filter(f => f.ext === 'js').length, 0),
  totalProjects: labs.filter(l => l.technologies.includes('HTTP Module') || l.technologies.includes('REST API')).length,
  totalScreenshots: labs.reduce((acc, l) => acc + l.screenshots.length, 0),
  totalFiles: labs.reduce((acc, l) => acc + l.files.length, 0),
  totalLinesOfCode: labs.reduce((acc, l) => acc + l.totalLines, 0),
  allTechnologies: Array.from(new Set(labs.flatMap(l => l.technologies)))
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
