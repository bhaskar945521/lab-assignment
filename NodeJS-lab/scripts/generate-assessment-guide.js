const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_HTML = path.join(ROOT, 'assessment-guide.html');
const OUTPUT_PDF = path.join(ROOT, 'NodeJS_Complete_Lab_Manual_and_Viva_Guide.pdf');
const LEGACY_PDF = path.join(ROOT, 'NodeJS_Practical_Assessment_Guide.pdf');
const OUTPUT_MD = path.join(ROOT, 'PRACTICAL_ASSESSMENT_GUIDE.md');

console.log('Generating comprehensive Node.js Practical Lab Manual & Viva Guide...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node.js Practical Lab Manual &amp; Viva Handbook — Bhaskar Mall (23145005)</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 9pt;
        color: #64748b;
      }
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.55;
      font-size: 10.5pt;
    }

    .cover {
      page-break-after: always;
      padding: 40px 20px 20px;
      text-align: center;
      border: 3px double #0284c7;
      border-radius: 12px;
      background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
      margin-bottom: 20px;
    }

    .cover-header {
      font-size: 13pt;
      font-weight: 800;
      color: #0369a1;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .cover-sub {
      font-size: 11pt;
      color: #475569;
      margin-bottom: 25px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #0c4a6e;
      line-height: 1.25;
      margin-bottom: 12px;
    }

    .cover-tagline {
      font-size: 13pt;
      color: #0284c7;
      font-weight: 600;
      margin-bottom: 30px;
    }

    .student-badge-box {
      display: inline-block;
      text-align: left;
      background: #ffffff;
      border: 2px solid #bae6fd;
      border-radius: 10px;
      padding: 18px 28px;
      box-shadow: 0 4px 15px rgba(2, 132, 199, 0.08);
      margin-bottom: 30px;
    }

    .student-badge-box table {
      width: 100%;
      border-collapse: collapse;
    }

    .student-badge-box td {
      padding: 4px 12px 4px 0;
      font-size: 11pt;
    }

    .student-badge-box td.label {
      font-weight: 700;
      color: #334155;
    }

    .student-badge-box td.val {
      color: #0369a1;
      font-weight: 600;
    }

    .cover-highlights {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 15px;
    }

    .highlight-pill {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #7dd3fc;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 9.5pt;
      font-weight: 700;
    }

    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 800;
      line-height: 1.3;
    }

    h1 {
      font-size: 18pt;
      border-bottom: 2.5px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 16px;
      color: #0369a1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h2 {
      font-size: 14pt;
      color: #0c4a6e;
      margin-top: 20px;
      margin-bottom: 10px;
      border-left: 4px solid #0284c7;
      padding-left: 10px;
    }

    h3 {
      font-size: 11.5pt;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-bottom: 10px;
      text-align: justify;
    }

    ul, ol {
      margin: 8px 0 14px 22px;
    }

    li {
      margin-bottom: 5px;
    }

    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 18px;
      font-size: 9.5pt;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }

    table.data-table th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }

    table.data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .qa-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0284c7;
      border-radius: 6px;
      padding: 12px 14px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .qa-box.critical {
      border-left-color: #ef4444;
      background: #fff5f5;
    }

    .qa-q {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 5px;
      font-size: 10.5pt;
    }

    .qa-a {
      color: #334155;
      font-size: 10pt;
    }

    .qa-a strong {
      color: #0369a1;
    }

    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 9pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1.5px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.8pt;
      line-height: 1.45;
      margin: 8px 0 12px;
      border: 1px solid #1e293b;
      page-break-inside: avoid;
    }

    pre .kw { color: #38bdf8; font-weight: bold; }
    pre .fn { color: #a855f7; }
    pre .str { color: #4ade80; }
    pre .comm { color: #94a3b8; font-style: italic; }
    pre .num { color: #fb923c; }

    .callout {
      padding: 10px 14px;
      border-radius: 6px;
      margin: 12px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    .callout.tip {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-left: 4px solid #10b981;
      color: #065f46;
    }

    .callout.alert {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }

    .lab-header-banner {
      background: #0284c7;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 12pt;
      margin-top: 20px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }

    .lab-header-banner .lab-badge {
      background: #ffffff;
      color: #0284c7;
      font-size: 9pt;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .badge-tag {
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e2e8f0;
      color: #475569;
      margin-right: 4px;
    }

    .footer-note {
      text-align: center;
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div class="cover-header">Dev Sanskriti Vishwavidyalaya (DSVV), Haridwar</div>
    <div class="cover-sub">Department of Computer Science · BCA VII Semester</div>

    <div class="cover-title">
      Node.js Practical Lab Manual &amp; Viva Handbook
    </div>
    <div class="cover-tagline">
      Complete Syllabus: Lab 01 to Lab 08 · Architecture, Source Code Breakdown &amp; Teacher Viva Q&amp;A
    </div>

    <div class="student-badge-box">
      <table>
        <tr>
          <td class="label">Candidate Name:</td>
          <td class="val">Bhaskar Mall</td>
          <td class="label">Scholar / Roll No:</td>
          <td class="val">23145005</td>
        </tr>
        <tr>
          <td class="label">Course &amp; Sem:</td>
          <td class="val">BCA VII Semester</td>
          <td class="label">Subject Code:</td>
          <td class="val">CS403NOD — Node.js</td>
        </tr>
        <tr>
          <td class="label">Institution:</td>
          <td class="val" colspan="3">Dev Sanskriti Vishwavidyalaya (DSVV), Haridwar</td>
        </tr>
      </table>
    </div>

    <p style="max-width: 650px; margin: 0 auto 20px; font-size: 10pt; color: #475569;">
      This exhaustive document prepares the student for both live terminal code evaluation, architecture defense, line-by-line code explanation, error handling troubleshooting, and rapid-fire oral viva assessments conducted by faculty examiners.
    </p>

    <div class="cover-highlights">
      <span class="highlight-pill">✓ All 8 Labs Covered</span>
      <span class="highlight-pill">✓ Core Architecture (libuv, V8, Event Loop)</span>
      <span class="highlight-pill">✓ Async Paradigms (Callbacks, Promises, Async/Await)</span>
      <span class="highlight-pill">✓ fs, http, events, child_process Modules</span>
      <span class="highlight-pill">✓ Top 30 Faculty Viva Questions &amp; Answers</span>
      <span class="highlight-pill">✓ Command-Line &amp; Debugging Cheatsheet</span>
    </div>
  </div>

  <!-- ==================== SECTION 1: ARCHITECTURE ==================== -->
  <h1 id="sec-architecture">1. Core Node.js Architecture &amp; Execution Model</h1>

  <p>
    Faculty examiners frequently begin viva evaluations by questioning the internal architecture of Node.js to verify if the student understands how JavaScript runs outside the browser and handles concurrent requests.
  </p>

  <div class="qa-box critical">
    <div class="qa-q">Q1. What exactly is Node.js, and what are its two core internal dependencies?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Node.js is <strong>not a language or framework</strong>; it is an open-source, cross-platform <strong>JavaScript runtime environment</strong> built on Google Chrome's <strong>V8 JavaScript Engine</strong> and written in C++.<br>
      The two foundational C/C++ dependencies are:
      <ul>
        <li><strong>Google V8 Engine:</strong> Compiles JavaScript source code directly into native machine code (Just-In-Time compilation) instead of interpreting bytecode.</li>
        <li><strong>libuv (C library):</strong> A high-performance, cross-platform C library that provides the <strong>Event Loop</strong>, non-blocking asynchronous I/O polling, and a background <strong>Thread Pool</strong> (default 4 threads) for blocking system tasks like file I/O, DNS lookup, and cryptographic operations.</li>
      </ul>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q2. How does Node.js handle thousands of concurrent requests if JavaScript is single-threaded?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Node.js executes JavaScript on a <strong>single main thread</strong>, but it achieves high concurrency using an <strong>Event-Driven, Non-Blocking I/O model</strong> supported by the underlying OS kernel (via <code>epoll</code> on Linux, <code>kqueue</code> on macOS, <code>IOCP</code> on Windows) and <code>libuv</code> thread pool.<br>
      When an I/O request (e.g. database query, reading a file, network request) arrives, Node.js offloads the operation to the operating system or libuv thread pool and immediately registers a callback. The main thread is freed up instantly to handle new incoming HTTP requests. When the I/O completes, its callback is placed in the Event Loop queue and processed when the main stack is empty.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q3. What are the six phases of the Node.js Event Loop in order of execution?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ol>
        <li><strong>Timers Phase:</strong> Executes callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code> whose threshold elapsed.</li>
        <li><strong>Pending / I/O Callbacks:</strong> Executes deferred system callbacks (e.g., TCP error reports).</li>
        <li><strong>Idle, Prepare:</strong> Internal libuv bookkeeping.</li>
        <li><strong>Poll Phase:</strong> Retrieves new I/O events, executes I/O related callbacks (almost all code except timers, close, check); blocks and waits for connections if queue is empty.</li>
        <li><strong>Check Phase:</strong> Executes callbacks invoked by <code>setImmediate()</code>.</li>
        <li><strong>Close Callbacks:</strong> Handles cleanup, e.g., <code>socket.on('close', ...)</code>.</li>
      </ol>
      <em>Special Microtask Queues:</em> <code>process.nextTick()</code> runs immediately after the current operation finishes, before the event loop advances to the next phase, followed by Promise microtasks.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q4. Browser JavaScript vs Node.js — What are the key differences?</div>
    <div class="qa-a">
      <table class="data-table">
        <tr>
          <th>Feature</th>
          <th>Browser Environment</th>
          <th>Node.js Environment</th>
        </tr>
        <tr>
          <td><strong>Root Global Object</strong></td>
          <td><code>window</code>, <code>document</code></td>
          <td><code>global</code>, <code>process</code></td>
        </tr>
        <tr>
          <td><strong>DOM &amp; UI</strong></td>
          <td>Direct access to DOM elements, alerts</td>
          <td>No DOM, no UI; runs headlessly on the server</td>
        </tr>
        <tr>
          <td><strong>File System &amp; OS</strong></td>
          <td>Blocked by sandboxing for security</td>
          <td>Direct full access via <code>fs</code>, <code>os</code>, <code>path</code></td>
        </tr>
        <tr>
          <td><strong>Module System</strong></td>
          <td>ES Modules (<code>import/export</code>)</td>
          <td>CommonJS (<code>require/module.exports</code>) &amp; ESM</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- ==================== SECTION 2: LAB-BY-LAB DETAILED BREAKDOWN ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-labs">2. Comprehensive Lab-by-Lab Viva &amp; Practical Breakdown</h1>

  <!-- LAB 01 -->
  <div class="lab-header-banner">
    <span>LAB 01 — Node.js Setup, Variables, Data Types &amp; Base HTTP Server</span>
    <span class="lab-badge">PORT 3000 / CLI</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-01/app.js</code>, <code>Lab-01/server.js</code></p>
  <p><strong>Objective:</strong> Prove working Node.js runtime, inspect variable data types with <code>typeof</code>, understand scope (<code>var</code>, <code>let</code>, <code>const</code>), and launch the most basic HTTP listener.</p>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: Explain the code inside Lab-01's server.js and why res.end() is mandatory.</div>
    <div class="qa-a">
      <pre><span class="kw">const</span> http = <span class="fn">require</span>(<span class="str">'http'</span>);

<span class="kw">const</span> server = http.<span class="fn">createServer</span>((req, res) => {
  res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'text/plain'</span> });
  res.<span class="fn">end</span>(<span class="str">'Hello from Node.js Lab 01!'</span>);
});

server.<span class="fn">listen</span>(<span class="num">3000</span>, () => {
  console.<span class="fn">log</span>(<span class="str">'Server running on port 3000'</span>);
});</pre>
      <strong>Explanation to give:</strong><br>
      1. <code>require('http')</code> loads Node's built-in HTTP module without requiring npm install.<br>
      2. <code>http.createServer()</code> returns an HTTP server instance and takes a callback function receiving two stream objects: <code>req</code> (IncomingMessage) and <code>res</code> (ServerResponse).<br>
      3. <code>res.writeHead(200, { 'Content-Type': 'text/plain' })</code> sets the HTTP status code (200 OK) and HTTP response headers before any body bytes are transmitted.<br>
      4. <strong>Why <code>res.end()</code> is mandatory:</strong> <code>res</code> is a writable stream. Calling <code>res.end()</code> signals to the client browser and operating system that all response headers and body data have been sent. If omitted, the client request remains hanging indefinitely until it times out.
    </div>
  </div>

  <!-- LAB 02 -->
  <div class="lab-header-banner">
    <span>LAB 02 — HTTP Web Server &amp; Custom Routing</span>
    <span class="lab-badge">ROUTING / JSON / STATUS CODES</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-02/server.js</code></p>
  <p><strong>Objective:</strong> Build a multi-endpoint HTTP server handling multiple routes (<code>/</code>, <code>/about</code>, <code>/college</code>, <code>/profile</code>, <code>/students</code>, <code>* 404</code>) and return JSON.</p>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: How do you implement routing without Express in native Node.js?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Native Node.js inspects the <code>req.url</code> and <code>req.method</code> properties on the incoming request object using a <code>switch-case</code> or <code>if-else</code> statement:
      <pre><span class="kw">const</span> server = http.<span class="fn">createServer</span>((req, res) => {
  <span class="kw">const</span> path = req.url.toLowerCase();

  <span class="kw">if</span> (path === <span class="str">'/'</span> || path === <span class="str">'/home'</span>) {
    res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'text/html'</span> });
    res.<span class="fn">end</span>(<span class="str">'&lt;h1&gt;Welcome to DSVV Lab 02&lt;/h1&gt;'</span>);
  } <span class="kw">else if</span> (path === <span class="str">'/students'</span>) {
    res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> });
    res.<span class="fn">end</span>(JSON.<span class="fn">stringify</span>([{ id: <span class="num">1</span>, name: <span class="str">'Bhaskar'</span>, course: <span class="str">'BCA'</span> }]));
  } <span class="kw">else</span> {
    res.<span class="fn">writeHead</span>(<span class="num">404</span>, { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> });
    res.<span class="fn">end</span>(JSON.<span class="fn">stringify</span>({ error: <span class="str">'Route Not Found'</span>, statusCode: <span class="num">404</span> }));
  }
});</pre>
      <em>Crucial Viva Point:</em> Always handle the default / fallback case with HTTP Status <strong>404 (Not Found)</strong>, or the server will hang on unhandled paths!
    </div>
  </div>

  <!-- LAB 03 & 04 -->
  <div class="page-break"></div>
  <div class="lab-header-banner">
    <span>LAB 03 &amp; 04 — Dynamic REST API, URL Query Params, Sorting &amp; Node Modules</span>
    <span class="lab-badge">REST API / URL / QUERY PARSER</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-03/student-server.js</code>, <code>Lab-04/advanced-server.js</code>, <code>Lab-04/app.js</code></p>
  <p><strong>Objective:</strong> Filter, validate, search, and sort structured in-memory datasets using URL query strings (e.g. <code>?course=BCA&amp;minMarks=70&amp;sort=name&amp;order=asc</code>).</p>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: How did you extract and sanitize URL query parameters in Lab 04?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Using Node's native <code>url</code> module with the parse method and passing <code>true</code> as the second parameter:
      <pre><span class="kw">const</span> url = <span class="fn">require</span>(<span class="str">'url'</span>);
<span class="kw">const</span> parsedUrl = url.<span class="fn">parse</span>(req.url, <span class="kw">true</span>); <span class="comm">// true parses query string into object</span>
<span class="kw">const</span> query = parsedUrl.query; <span class="comm">// e.g. { course: 'BCA', minMarks: '70' }</span>
<span class="kw">const</span> pathname = parsedUrl.pathname;

<span class="kw">if</span> (pathname === <span class="str">'/students'</span>) {
  <span class="kw">let</span> results = [...studentDatabase];

  <span class="comm">// 1. Filter by course (case-insensitive)</span>
  <span class="kw">if</span> (query.course) {
    results = results.<span class="fn">filter</span>(s => s.course.toLowerCase() === query.course.toLowerCase());
  }

  <span class="comm">// 2. Numeric validation for minMarks</span>
  <span class="kw">if</span> (query.minMarks) {
    <span class="kw">const</span> min = parseFloat(query.minMarks);
    <span class="kw">if</span> (!isNaN(min)) {
      results = results.<span class="fn">filter</span>(s => s.marks &gt;= min);
    }
  }

  res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> });
  res.<span class="fn">end</span>(JSON.<span class="fn">stringify</span>({ total: results.length, data: results }));
}</pre>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: What is the difference between Core Modules, Local Modules, and Third-Party Modules?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><strong>Core Modules:</strong> Built right into the Node.js binary (e.g., <code>http</code>, <code>fs</code>, <code>path</code>, <code>events</code>, <code>os</code>). Loaded directly by name: <code>require('fs')</code>. No installation needed.</li>
        <li><strong>Local Modules:</strong> Files created by the developer in the project (e.g., <code>./modules/logger.js</code>). Loaded with relative file paths: <code>require('./logger')</code>.</li>
        <li><strong>Third-Party Modules:</strong> Installed from the npm registry (e.g., <code>slugify</code>). Stored in <code>node_modules/</code>. Loaded by package name: <code>require('slugify')</code>.</li>
      </ul>
    </div>
  </div>

  <!-- LAB 05 -->
  <div class="lab-header-banner">
    <span>LAB 05 — Asynchronous Paradigms: Callbacks, Promises &amp; Async/Await</span>
    <span class="lab-badge">ASYNC / PROMISES / PROMISE.ALL</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-05/callback-version.js</code>, <code>Lab-05/promise-version.js</code>, <code>Lab-05/chaining-version.js</code>, <code>Lab-05/async-await-version.js</code>, <code>Lab-05/concurrent-orders.js</code></p>
  <p><strong>Objective:</strong> Understand and compare the progression of asynchronous JavaScript using a real-world multi-step Food Delivery Tracking simulation (Place Order &rarr; Prepare Food &rarr; Dispatch &rarr; Deliver).</p>

  <div class="qa-box critical">
    <div class="qa-q">Teacher Question: Compare Callbacks, Promises, and Async/Await. What is Callback Hell?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><strong>Callbacks:</strong> Functions passed as arguments to other functions to be called upon completion. Leads to <em>Callback Hell</em> (Pyramid of Doom) when nesting sequential tasks, making error handling and code readability extremely poor.</li>
        <li><strong>Promises:</strong> ES6 objects representing the eventual completion (fulfillment) or failure (rejection) of an asynchronous operation. Has 3 states: <em>Pending</em>, <em>Fulfilled</em>, <em>Rejected</em>. Solves nesting via <code>.then()</code> chaining and centralized <code>.catch()</code>.</li>
        <li><strong>Async/Await:</strong> Syntactic sugar built on top of Promises (ES2017). Allows writing asynchronous code that looks and behaves like synchronous code. Uses standard <code>try...catch</code> blocks for error handling.</li>
      </ul>
      <pre><span class="comm">// Modern Async/Await pattern from Lab 05:</span>
<span class="kw">async function</span> <span class="fn">processDeliveryOrder</span>(orderId) {
  <span class="kw">try</span> {
    <span class="kw">const</span> order = <span class="kw">await</span> <span class="fn">placeOrder</span>(orderId);
    <span class="kw">const</span> cooked = <span class="kw">await</span> <span class="fn">prepareFood</span>(order);
    <span class="kw">const</span> rider = <span class="kw">await</span> <span class="fn">dispatchRider</span>(cooked);
    <span class="kw">const</span> delivered = <span class="kw">await</span> <span class="fn">deliverFood</span>(rider);
    console.<span class="fn">log</span>(<span class="str">'Delivered successfully:'</span>, delivered);
  } <span class="kw">catch</span> (err) {
    console.<span class="fn">error</span>(<span class="str">'Delivery step failed:'</span>, err.message);
  }
}</pre>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: What is Promise.all() and when is it preferred over sequential awaits?</div>
    <div class="qa-a">
      <strong>Answer:</strong> <code>Promise.all([p1, p2, p3])</code> takes an iterable of promises and executes them <strong>concurrently (in parallel)</strong>. It resolves when <em>all</em> promises resolve, or rejects immediately when <em>any</em> promise rejects (fail-fast behavior).<br>
      <em>When preferred:</em> When asynchronous tasks are <strong>independent</strong> of one another (e.g. preparing 3 separate food items or reading 3 independent files), sequential <code>await</code> takes <code>t1 + t2 + t3</code> seconds, whereas <code>Promise.all()</code> runs them in parallel taking only <code>max(t1, t2, t3)</code> seconds.
    </div>
  </div>

  <!-- LAB 06 -->
  <div class="page-break"></div>
  <div class="lab-header-banner">
    <span>LAB 06 — File System (fs) Module &amp; CLI Notes Application</span>
    <span class="lab-badge">FS / FS.PROMISES / PROCESS.ARGV</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-06/fs-demo.js</code>, <code>Lab-06/read-async.js</code>, <code>Lab-06/read-sync.js</code>, <code>Lab-06/add-note.js</code>, <code>Lab-06/read-notes.js</code></p>
  <p><strong>Objective:</strong> File manipulation in Node.js: synchronous vs asynchronous methods, <code>fs.promises</code> API, file deletion (<code>unlink</code>), and command-line arguments (<code>process.argv</code>).</p>

  <div class="qa-box critical">
    <div class="qa-q">Teacher Question: Why does fs.readFile() not block your program while fs.readFileSync() does?</div>
    <div class="qa-a">
      <strong>Answer (Direct from Lab 06 Reflection):</strong><br>
      <code>fs.readFile()</code> is asynchronous. Node.js initiates the OS read request and offloads it to the libuv thread pool, immediately continuing execution of the next lines in the JavaScript script without waiting. The callback is invoked only when the file reading completes and the event loop reaches the poll phase.<br>
      In contrast, <code>fs.readFileSync()</code> is synchronous; it halts and blocks the single JavaScript thread completely until the entire file is fetched from storage into memory. No other requests or lines can execute during this freeze.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: In the Notes App, what happens if two users execute add-note.js simultaneously?</div>
    <div class="qa-a">
      <strong>Answer (Direct from Lab 06 Reflection Question 2):</strong><br>
      A <strong>Race Condition</strong> occurs. When two processes execute concurrent write/append operations on the exact same physical text file without file-locking mechanisms, their write operations may interleave, leading to corrupted records, out-of-order writes, or partial write errors. In high-concurrency production systems, an atomic database (e.g. PostgreSQL, MongoDB, Redis) or transactional queue must be used instead of raw text file appending.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: How do you read command line arguments in Node.js?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Via the global <code>process.argv</code> array:<br>
      <code>process.argv[0]</code> = Absolute path to Node binary (<code>node.exe</code>).<br>
      <code>process.argv[1]</code> = Absolute path to executing script file.<br>
      <code>process.argv[2]</code> and onwards = User-provided CLI arguments.<br>
      Example: <code>node add-note.js "Complete Node.js Lab"</code> &rarr; <code>process.argv.slice(2).join(' ')</code> gets the full string.
    </div>
  </div>

  <!-- LAB 07 -->
  <div class="lab-header-banner">
    <span>LAB 07 — EventEmitter Architecture &amp; Custom Event Systems</span>
    <span class="lab-badge">EVENTS / PUBSUB / LISTENER LIFECYCLE</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-07/emitter.js</code>, <code>Lab-07/07-practical-example/app.js</code></p>
  <p><strong>Objective:</strong> Master Node.js Publisher-Subscriber architecture using the built-in <code>EventEmitter</code> class from the <code>events</code> module.</p>

  <div class="qa-box critical">
    <div class="qa-q">Teacher Question: Explain EventEmitter methods: on, emit, once, removeListener.</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><code>emitter.on(eventName, listener)</code>: Registers an event listener callback function that triggers <em>every single time</em> the specified event is emitted.</li>
        <li><code>emitter.emit(eventName, ...args)</code>: Synchronously calls each of the listeners registered for the event named <code>eventName</code>, in the order they were registered, passing the supplied arguments to each.</li>
        <li><code>emitter.once(eventName, listener)</code>: Adds a one-time listener function. The next time the event is triggered, this listener is removed and then invoked.</li>
        <li><code>emitter.removeListener(eventName, listener)</code>: Unregisters a specific listener function from the listener array for the specified event to prevent memory leaks.</li>
      </ul>
      <pre><span class="kw">const</span> EventEmitter = <span class="fn">require</span>(<span class="str">'events'</span>);

<span class="kw">class</span> <span class="fn">OrderTracker</span> <span class="kw">extends</span> EventEmitter {}
<span class="kw">const</span> tracker = <span class="kw">new</span> <span class="fn">OrderTracker</span>();

<span class="comm">// Multi-listener demo</span>
tracker.<span class="fn">on</span>(<span class="str">'orderPlaced'</span>, (data) => console.<span class="fn">log</span>(<span class="str">'SMS sent to:'</span>, data.customer));
tracker.<span class="fn">on</span>(<span class="str">'orderPlaced'</span>, (data) => console.<span class="fn">log</span>(<span class="str">'Kitchen preparing:'</span>, data.item));
tracker.<span class="fn">once</span>(<span class="str">'orderDelivered'</span>, (data) => console.<span class="fn">log</span>(<span class="str">'Single-fire delivery record'</span>));

tracker.<span class="fn">emit</span>(<span class="str">'orderPlaced'</span>, { orderId: <span class="num">101</span>, customer: <span class="str">'Bhaskar'</span>, item: <span class="str">'Laptop'</span> });</pre>
      <em>Critical Warning for Viva:</em> If an EventEmitter emits an <code>'error'</code> event and there are no listeners subscribed to <code>'error'</code>, Node.js throws an unhandled exception and crashes the entire process! Always register <code>emitter.on('error', handler)</code>.
    </div>
  </div>

  <!-- LAB 08 -->
  <div class="page-break"></div>
  <div class="lab-header-banner">
    <span>LAB 08 — Integrated Monolithic Lab Server (Local + Live Cloud Deployment)</span>
    <span class="lab-badge">INTEGRATION / CHILD_PROCESS / LOGGER</span>
  </div>
  <p><strong>Primary Files:</strong> <code>Lab-08/server.js</code>, <code>Lab-08/labs.js</code>, <code>Lab-08/modules/logger.js</code></p>
  <p><strong>Objective:</strong> Unify all previous 7 labs into a single monolithic production server without modifying or rewriting original code. Reuses HTTP server handlers via <code>module.exports</code> delegation, executes script labs using sandboxed <code>child_process.execFile</code>, records asynchronous file logs via <code>EventEmitter</code>, supports cloud deployment (Render), and serves live health &amp; dashboard metrics.</p>

  <div class="qa-box critical">
    <div class="qa-q">Teacher Question: How did you integrate all previous labs without rewriting them?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ol>
        <li><strong>Server Labs (Lab 01, Lab 02):</strong> The integrated server dynamically imports the exported handler function via <code>require(labPath)</code>. When a request hits <code>/labs/:id/app/...</code>, the integrated server strips the prefix from <code>req.url</code> and delegates execution to the old lab's request handler: <code>handler(req, res)</code>.</li>
        <li><strong>Script Labs (Lab 03 to Lab 07):</strong> The integrated server executes the target script using Node's native <code>child_process.execFile()</code> wrapped in <code>util.promisify</code> with a 5000ms timeout guard:
          <pre><span class="kw">const</span> { execFile } = <span class="fn">require</span>(<span class="str">'child_process'</span>);
<span class="kw">const</span> { promisify } = <span class="fn">require</span>(<span class="str">'util'</span>);
<span class="kw">const</span> execFileAsync = <span class="fn">promisify</span>(execFile);

<span class="kw">const</span> result = <span class="kw">await</span> <span class="fn">execFileAsync</span>(process.execPath, [labFilePath], { timeout: <span class="num">5000</span> });
res.<span class="fn">end</span>(JSON.<span class="fn">stringify</span>({ ok: <span class="kw">true</span>, output: result.stdout }));</pre>
        </li>
      </ol>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: How does the custom EventEmitter logging system in Lab 08 work?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Inside <code>modules/logger.js</code>, a custom class extending <code>EventEmitter</code> is instantiated. For every incoming HTTP request, the main server emits:
      <code>logger.emit("request", req.method, req.url);</code><br>
      The logger listener formats an ISO timestamped entry and asynchronously writes it to disk:
      <pre>logger.<span class="fn">on</span>(<span class="str">"request"</span>, (method, requestUrl) => {
  <span class="kw">const</span> line = <span class="kw">new</span> Date().<span class="fn">toISOString</span>() + <span class="str">" "</span> + method + <span class="str">" "</span> + requestUrl;
  console.<span class="fn">log</span>(line);
  fs.<span class="fn">appendFile</span>(LOG_FILE, line + <span class="str">"\\n"</span>, (err) => {
    <span class="kw">if</span> (err) logger.<span class="fn">emit</span>(<span class="str">"error"</span>, err);
  });
});</pre>
      This decouples the request-handling logic from disk file I/O operations.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Teacher Question: What is child_process.execFile vs exec vs spawn vs fork?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><code>execFile</code>: Directly invokes an executable file without spawning an intermediate system shell. Safer against command injection attacks and faster. (Used in Lab 08).</li>
        <li><code>exec</code>: Spawns an entire system shell (e.g. bash/cmd) and executes the command string. Vulnerable to shell injection if user inputs are concatenated.</li>
        <li><code>spawn</code>: Spawns a child process and streams large amounts of data via <code>stdout</code>/<code>stderr</code> streams without buffering everything in memory.</li>
        <li><code>fork</code>: A specialized instance of <code>spawn</code> designed specifically to create new Node.js V8 processes with built-in Inter-Process Communication (IPC) channels.</li>
      </ul>
    </div>
  </div>

  <!-- ==================== SECTION 3: TOP 25 VIVA QUESTIONS ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-viva">3. Top 25 Rapid-Fire Faculty Viva Questions &amp; Answers</h1>

  <div class="qa-box">
    <div class="qa-q">1. What is the difference between require() and import?</div>
    <div class="qa-a"><code>require()</code> is synchronous and part of the CommonJS module system used traditionally by Node.js. <code>import</code> is asynchronous, static, and part of the ECMAScript Module (ESM) standard.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">2. What is module.exports vs exports?</div>
    <div class="qa-a"><code>module.exports</code> is the actual object returned when someone calls <code>require()</code>. <code>exports</code> is merely a shorthand variable reference pointing to <code>module.exports</code>. If you reassign <code>exports = something</code>, you break the reference; always assign to <code>module.exports</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">3. What is the purpose of package.json and package-lock.json?</div>
    <div class="qa-a"><code>package.json</code> contains project metadata, scripts, and semantic version ranges for dependencies. <code>package-lock.json</code> records the <em>exact version tree and cryptographic hash</em> of every installed nested dependency to guarantee deterministic builds across machines.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">4. What does the caret (^) and tilde (~) mean in dependency versioning?</div>
    <div class="qa-a"><code>^1.6.6</code> allows minor and patch updates (e.g. 1.6.7 or 1.7.0, but not 2.0.0). <code>~1.6.6</code> allows only patch updates (e.g. 1.6.7, but not 1.7.0).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">5. What is the Event Loop Poll phase and why is it important?</div>
    <div class="qa-a">The poll phase calculates how long it should block and poll for incoming I/O, then processes the events in the poll queue. If the queue is empty, it checks for <code>setImmediate()</code> or waits for timers to expire.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">6. What is the difference between process.nextTick() and setImmediate()?</div>
    <div class="qa-a"><code>process.nextTick()</code> runs immediately after the current operation finishes on the call stack, before the event loop advances. <code>setImmediate()</code> runs during the <em>Check phase</em> of the event loop.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">7. What is a Stream in Node.js and what are the 4 stream types?</div>
    <div class="qa-a">A stream is an abstract interface for handling reading or writing continuous chunks of data without loading the entire payload into RAM. The 4 types are: <strong>Readable</strong> (e.g. <code>fs.createReadStream</code>), <strong>Writable</strong> (e.g. <code>res</code>, <code>fs.createWriteStream</code>), <strong>Duplex</strong> (e.g. TCP net.Socket), and <strong>Transform</strong> (e.g. <code>zlib.createGzip</code>).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">8. What is the difference between res.write() and res.end()?</div>
    <div class="qa-a"><code>res.write()</code> sends chunks of response body data over the socket without closing the connection. <code>res.end()</code> sends the optional final chunk and signals to the client that the HTTP response is complete.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">9. What is an error-first callback?</div>
    <div class="qa-a">A Node.js convention where the first argument of the callback function is reserved for an error object (if the operation failed), and subsequent arguments hold the successful result data: <code>(err, data) => { if (err) { ... } }</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">10. What is a Buffer in Node.js?</div>
    <div class="qa-a">A global class used to handle raw binary data directly in memory outside of V8's garbage-collected heap. Crucial for network streams and file I/O operations.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">11. What causes the EADDRINUSE error and how do you resolve it?</div>
    <div class="qa-a">It occurs when a server attempts to bind to a TCP port (e.g., 5050) that is already being used by another running process. Fix by killing the old process (<code>npx kill-port 5050</code> or <code>taskkill /F /PID ...</code>) or selecting a different port via <code>PORT=5051 node server.js</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">12. What does res.setHeader('Content-Type', 'application/json') do?</div>
    <div class="qa-a">It tells the receiving client browser or API consumer that the incoming payload is formatted as a JSON string so that it can be parsed into a JavaScript object.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">13. What is slugify and why was it used in Lab 08?</div>
    <div class="qa-a"><code>slugify</code> is an npm utility that converts human-readable strings with spaces and special characters into clean, URL-safe lowercase slugs (e.g. <code>"Simple HTTP Server"</code> &rarr; <code>"simple-http-server"</code>).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">14. What is the difference between path.join() and path.resolve()?</div>
    <div class="qa-a"><code>path.join()</code> simply concatenates path segments using the OS separator (<code>\\</code> on Windows, <code>/</code> on POSIX). <code>path.resolve()</code> resolves segments into an <strong>absolute path</strong> starting from the current working directory.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">15. What are the key HTTP status code categories?</div>
    <div class="qa-a">
      <strong>1xx:</strong> Informational | 
      <strong>2xx:</strong> Success (200 OK, 201 Created) | 
      <strong>3xx:</strong> Redirection (301 Moved, 304 Not Modified) | 
      <strong>4xx:</strong> Client Error (400 Bad Request, 404 Not Found, 405 Method Not Allowed) | 
      <strong>5xx:</strong> Server Error (500 Internal Server Error).
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">16. Why is blocking the event loop dangerous in Node.js?</div>
    <div class="qa-a">Because Node.js executes JavaScript on a single thread. If an intensive synchronous CPU loop or synchronous file read blocks the thread, <em>every other connected client in the entire world is frozen</em> and cannot receive responses.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">17. How do you prevent Node.js crashes from unhandled Promise rejections?</div>
    <div class="qa-a">By attaching <code>.catch()</code> to every promise chain, using <code>try...catch</code> inside <code>async</code> functions, and setting up a global safety net: <code>process.on('unhandledRejection', (reason, promise) => { ... })</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">18. What is REPL in Node.js?</div>
    <div class="qa-a">Read-Eval-Print Loop. An interactive terminal programming environment launched by typing <code>node</code> in the terminal to test JavaScript statements quickly.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">19. How do you pass environment variables into a Node.js process?</div>
    <div class="qa-a">Via terminal commands: <code>PORT=4000 STUDENT_NAME="Bhaskar Mall" node server.js</code> or cross-env. In code, they are accessed via the global object <code>process.env.VARIABLE_NAME</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">20. What is util.promisify?</div>
    <div class="qa-a">A built-in Node.js utility that converts standard error-first callback functions (like <code>fs.readFile</code> or <code>child_process.execFile</code>) into functions that return ES6 Promises, enabling the use of <code>await</code>.</div>
  </div>

  <!-- ==================== SECTION 4: CHEATSHEET ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-run">4. Live Exam Practical Execution &amp; Commands Cheatsheet</h1>

  <table class="data-table">
    <tr>
      <th>Lab</th>
      <th>Folder</th>
      <th>Terminal Command to Run</th>
      <th>Test URL / Verification</th>
    </tr>
    <tr>
      <td><strong>Lab 01</strong></td>
      <td><code>Lab-01/</code></td>
      <td><code>node server.js</code></td>
      <td><code>http://localhost:3000/</code></td>
    </tr>
    <tr>
      <td><strong>Lab 02</strong></td>
      <td><code>Lab-02/</code></td>
      <td><code>node server.js</code></td>
      <td><code>http://localhost:3000/students</code></td>
    </tr>
    <tr>
      <td><strong>Lab 03</strong></td>
      <td><code>Lab-03/</code></td>
      <td><code>node student-server.js</code> &amp; <code>node food.js</code></td>
      <td><code>http://localhost:3000/students?id=1</code></td>
    </tr>
    <tr>
      <td><strong>Lab 04</strong></td>
      <td><code>Lab-04/</code></td>
      <td><code>node advanced-server.js</code></td>
      <td><code>http://localhost:3000/students?course=BCA&amp;minMarks=70</code></td>
    </tr>
    <tr>
      <td><strong>Lab 05</strong></td>
      <td><code>Lab-05/</code></td>
      <td><code>node async-await-version.js</code></td>
      <td>Console shows step-by-step food delivery timestamps</td>
    </tr>
    <tr>
      <td><strong>Lab 06</strong></td>
      <td><code>Lab-06/</code></td>
      <td><code>node fs-demo.js</code><br><code>node add-note.js "Prepare Viva"</code><br><code>node read-notes.js</code></td>
      <td>Inspects <code>notes.txt</code> file created on disk</td>
    </tr>
    <tr>
      <td><strong>Lab 07</strong></td>
      <td><code>Lab-07/</code></td>
      <td><code>node emitter.js</code></td>
      <td>Console verifies multi-listener and single-fire events</td>
    </tr>
    <tr>
      <td><strong>Lab 08</strong></td>
      <td><code>Lab-08/</code></td>
      <td><code>npm start</code> (or <code>node server.js</code>)</td>
      <td><code>http://localhost:3000/</code> &amp; <code>http://localhost:3000/health</code></td>
    </tr>
    <tr>
      <td><strong>Portfolio</strong></td>
      <td><code>NodeJS-lab/</code></td>
      <td><code>npm start</code> (or <code>node portfolio-server.js</code>)</td>
      <td><code>http://localhost:5050/</code> (Auto-Discovered Dashboard)</td>
    </tr>
  </table>

  <div class="callout tip">
    <strong>Faculty Demo Pro-Tip:</strong> If the teacher asks to test Lab-08:
    <ol>
      <li>Open terminal: <code>cd Lab-08</code></li>
      <li>Start server: <code>node server.js</code></li>
      <li>Open browser: <code>http://localhost:3000/</code> (shows all 8 integrated labs with local badge)</li>
      <li>Show <code>http://localhost:3000/health</code> &rarr; returns <code>{"status":"ok", "environment":"local"}</code></li>
      <li>Show <code>http://localhost:3000/labs/02/app/students?course=BCA</code> &rarr; proves delegation to Lab 02 server handler!</li>
      <li>Show <code>http://localhost:3000/labs/05/run</code> &rarr; proves <code>child_process.execFile</code> executing script labs!</li>
      <li>Show <code>http://localhost:3000/api/dashboard</code> &rarr; proves <code>Promise.all</code> reading logs and screenshots concurrently!</li>
    </ol>
  </div>

  <div class="footer-note">
    Prepared by Bhaskar Mall (Scholar No: 23145005) · BCA VII Semester · Dev Sanskriti Vishwavidyalaya (DSVV) · CS403NOD Practical Lab Assessment
  </div>

</body>
</html>
`;

// 1. Write HTML file
fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');
console.log('✓ Created:', OUTPUT_HTML);

// 2. Generate PDF using headless Edge
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (fs.existsSync(edgePath)) {
  console.log('Invoking Microsoft Edge to render PDF...');
  const fileUrl = 'file:///' + OUTPUT_HTML.replace(/\\/g, '/');
  const edgeCmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${OUTPUT_PDF}" "${fileUrl}"`;
  try {
    execSync(edgeCmd, { stdio: 'inherit' });
    console.log('✓ Successfully generated PDF:', OUTPUT_PDF);
    fs.copyFileSync(OUTPUT_PDF, LEGACY_PDF);
    console.log('✓ Synchronized legacy copy:', LEGACY_PDF);
  } catch (err) {
    console.error('Error generating PDF with Edge:', err.message);
  }
} else {
  console.log('Edge not found at path:', edgePath);
}

// 3. Also generate Markdown version for immediate reading
const mdContent = `# Node.js Practical Lab Manual & Viva Handbook
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
1. **Timers Phase:** Callbacks from \`setTimeout()\` and \`setInterval()\`.
2. **Pending / I/O Callbacks:** Deferred system callbacks (e.g. TCP errors).
3. **Idle, Prepare:** Internal libuv bookkeeping.
4. **Poll Phase:** Retrieves new I/O events; executes I/O callbacks; blocks and waits when empty.
5. **Check Phase:** Callbacks from \`setImmediate()\`.
6. **Close Callbacks:** Cleanup callbacks, e.g. \`socket.on('close', ...)\`.
- *Microtasks Queue:* \`process.nextTick()\` executes immediately after the current operation, before the loop advances.

---

## 2. Lab-by-Lab Viva & Practical Breakdown (Labs 01 to 08)

### LAB 01 — Setup, Variables, Data Types & Base HTTP Server
- **Files:** \`Lab-01/app.js\`, \`Lab-01/server.js\`
- **Core Code:** \`http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/plain'}); res.end('Hello'); }).listen(3000);\`
- **Why \`res.end()\` is mandatory:** \`res\` is a writable stream. \`res.end()\` signals that all headers and body data have been sent. Without it, the client connection hangs indefinitely until timeout.

### LAB 02 — HTTP Web Server & Custom Routing
- **Files:** \`Lab-02/server.js\`
- **Core Concept:** Routing without Express by inspecting \`req.url\` and \`req.method\`.
- **Status Codes:** 200 (OK), 404 (Not Found for unhandled paths).
- **Header:** \`res.writeHead(200, { 'Content-Type': 'application/json' })\` to return JSON strings via \`JSON.stringify()\`.

### LAB 03 & 04 — Dynamic REST API, Query Parameters & Modules
- **Files:** \`Lab-03/student-server.js\`, \`Lab-04/advanced-server.js\`
- **URL Parsing:** \`url.parse(req.url, true).query\` converts query string into object (e.g. \`?course=BCA&minMarks=70\`).
- **Data Filtering:** Uses JavaScript \`filter()\` with validation (\`parseFloat(query.minMarks)\`, \`!isNaN()\`).
- **Module Types:**
  - *Core Modules:* Built into Node (\`http\`, \`fs\`, \`path\`, \`events\`, \`os\`).
  - *Local Modules:* Written in project (\`./modules/logger.js\`).
  - *Third-Party:* Installed from npm (\`slugify\`).

### LAB 05 — Asynchronous Paradigms: Callbacks, Promises, Async/Await
- **Files:** \`Lab-05/callback-version.js\`, \`Lab-05/promise-version.js\`, \`Lab-05/async-await-version.js\`, \`Lab-05/concurrent-orders.js\`
- **Evolution:**
  - *Callback Hell:* Nested pyramids with inversion of control and messy error handling.
  - *Promises:* States: Pending, Fulfilled, Rejected. Handled via \`.then()\` and \`.catch()\`.
  - *Async/Await:* Syntactic sugar over Promises. Sequential synchronous-looking code with \`try...catch\`.
  - *\`Promise.all()\` Concurrency:* Executes independent promises in parallel. Finishes in \`max(time)\` instead of \`sum(time)\`.

### LAB 06 — File System (fs) Module & CLI Notes App
- **Files:** \`Lab-06/fs-demo.js\`, \`Lab-06/read-async.js\`, \`Lab-06/read-sync.js\`, \`Lab-06/add-note.js\`, \`Lab-06/read-notes.js\`
- **Why async \`readFile()\` does not block:** It delegates disk I/O to libuv thread pool, freeing the main thread immediately. Sync \`readFileSync()\` blocks the single thread completely.
- **Race Condition Warning:** If two users write to \`notes.txt\` simultaneously, file writes may interleave or corrupt data. Databases provide atomic transactions to solve this.
- **CLI Arguments:** Accessed via \`process.argv.slice(2)\`.

### LAB 07 — EventEmitter Architecture
- **Files:** \`Lab-07/emitter.js\`, \`Lab-07/07-practical-example/app.js\`
- **Methods:**
  - \`emitter.on(event, listener)\`: Registers permanent listener.
  - \`emitter.emit(event, ...args)\`: Triggers event synchronously.
  - \`emitter.once(event, listener)\`: Triggers only once and auto-removes.
  - \`emitter.removeListener(event, listener)\`: Removes listener to prevent memory leaks.
- **Error Event Rule:** Always handle \`emitter.on('error', ...)\`, otherwise an unhandled \`'error'\` event will crash the entire Node.js process!

### LAB 08 — Integrated Monolithic Server (Local + Live Cloud)
- **Files:** \`Lab-08/server.js\`, \`Lab-08/labs.js\`, \`Lab-08/modules/logger.js\`
- **Server Labs Integration:** Uses \`module.exports = handler\` and request URL rewrites (\`req.url = remainder + query\`).
- **Script Labs Integration:** Executes files safely with \`child_process.execFile(process.execPath, [file], { timeout: 5000 })\`.
- **Event-Driven Logging:** Custom \`Logger\` class extends \`EventEmitter\` emitting \`"request"\` on each hit, writing asynchronously to \`logs/server.log\`.
- **Environment Agnostic:** Checks \`process.env.RENDER ? "live (Render)" : "local"\`.

---

## 3. Top 15 Quick Viva Answers

1. **require vs import:** require is CommonJS and synchronous; import is ES Modules and static/asynchronous.
2. **module.exports vs exports:** module.exports is the actual exported object; exports is only a variable reference pointing to it.
3. **package.json vs package-lock.json:** package.json defines version ranges; package-lock.json locks exact installed versions and hashes.
4. **process.nextTick vs setImmediate:** process.nextTick runs immediately after current operation; setImmediate runs in the Check phase.
5. **Stream:** An interface for reading/writing data chunk-by-chunk without loading entire file into RAM.
6. **Buffer:** Handles raw binary memory outside the V8 heap.
7. **EADDRINUSE:** Port is already in use by another process. Fix with \`npx kill-port <port>\` or specify another port.
8. **path.join vs path.resolve:** path.join concatenates segments; path.resolve resolves to an absolute path.
9. **util.promisify:** Converts callback-based functions into Promise-returning functions.
10. **Single-threaded limitation:** Heavy CPU loops block all clients; offload CPU tasks to Worker Threads or microservices.

---

## 4. Practical Terminal Running Cheatsheet

- **Start Portfolio:** \`node portfolio-server.js\` (Runs on http://localhost:5050)
- **Start Lab-08:** \`cd Lab-08 && npm start\` (Runs on http://localhost:3000)
- **Health Check:** http://localhost:3000/health
- **Lab 01 Server:** http://localhost:3000/labs/01/app/
- **Lab 02 Server Filter:** http://localhost:3000/labs/02/app/students?course=BCA
- **Lab 05 Script Execution:** http://localhost:3000/labs/05/run
- **Dashboard Metrics:** http://localhost:3000/api/dashboard
`;

fs.writeFileSync(OUTPUT_MD, mdContent, 'utf8');
console.log('✓ Created:', OUTPUT_MD);
console.log('Assessment Guide preparation complete!');
