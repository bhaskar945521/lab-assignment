const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_HTML = path.join(ROOT, 'assessment-guide.html');
const OUTPUT_PDF = path.join(ROOT, 'NodeJS_Complete_Lab_Manual_and_Viva_Guide.pdf');
const LEGACY_PDF = path.join(ROOT, 'NodeJS_Practical_Assessment_Guide.pdf');
const OUTPUT_MD = path.join(ROOT, 'PRACTICAL_ASSESSMENT_GUIDE.md');

console.log('Generating clean academic Node.js Practical Lab Record & Viva Guide...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node.js Practical Lab Record — Bhaskar Mall (23145005)</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @top-right {
        content: "DSVV · Node.js Lab Record (CS403NOD)";
        font-size: 8pt;
        color: #64748b;
        font-family: Arial, sans-serif;
      }
      @bottom-right {
        content: "Page " counter(page);
        font-size: 8.5pt;
        color: #64748b;
        font-family: Arial, sans-serif;
      }
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Segoe UI", Arial, Helvetica, sans-serif;
      color: #1f2937;
      background: #ffffff;
      line-height: 1.55;
      font-size: 10pt;
    }

    /* Academic Title Page */
    .cover {
      page-break-after: always;
      padding: 30px 24px;
      text-align: center;
      border: 2px solid #1e3a8a;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .inst-name {
      font-size: 14pt;
      font-weight: 700;
      color: #1e3a8a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .inst-sub {
      font-size: 9.5pt;
      color: #4b5563;
      margin-bottom: 28px;
    }

    .doc-badge {
      display: inline-block;
      font-size: 10pt;
      font-weight: 600;
      letter-spacing: 1px;
      color: #1e3a8a;
      text-transform: uppercase;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 4px;
      margin-bottom: 18px;
    }

    .cover-title {
      font-size: 22pt;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .cover-subtitle {
      font-size: 11pt;
      color: #374151;
      margin-bottom: 30px;
    }

    .student-info-table {
      width: 85%;
      margin: 0 auto 30px;
      border-collapse: collapse;
      text-align: left;
      font-size: 10pt;
      border: 1px solid #cbd5e1;
    }

    .student-info-table td {
      padding: 7px 12px;
      border: 1px solid #e2e8f0;
    }

    .student-info-table td.lbl {
      width: 32%;
      font-weight: 600;
      color: #374151;
      background-color: #f8fafc;
    }

    .student-info-table td.val {
      color: #111827;
    }

    .cover-summary {
      font-size: 9pt;
      color: #4b5563;
      max-width: 620px;
      margin: 0 auto;
      line-height: 1.6;
      border-top: 1px solid #e2e8f0;
      padding-top: 18px;
    }

    /* Index Table */
    .index-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 24px;
      font-size: 9.5pt;
    }

    .index-table th, .index-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }

    .index-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }

    /* Section Headings */
    h1 {
      font-size: 15pt;
      font-weight: 700;
      color: #1e3a8a;
      border-bottom: 1.5px solid #1e3a8a;
      padding-bottom: 5px;
      margin-top: 24px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }

    h2 {
      font-size: 12pt;
      font-weight: 700;
      color: #1f2937;
      margin-top: 18px;
      margin-bottom: 8px;
      padding-left: 6px;
      border-left: 3px solid #1e3a8a;
      page-break-after: avoid;
    }

    h3 {
      font-size: 10.5pt;
      font-weight: 600;
      color: #111827;
      margin-top: 12px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 8px;
      text-align: justify;
    }

    ul, ol {
      margin: 6px 0 10px 20px;
    }

    li {
      margin-bottom: 4px;
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
      margin: 10px 0 16px;
      font-size: 9.5pt;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 9px;
      text-align: left;
    }

    table.data-table th {
      background-color: #f1f5f9;
      color: #111827;
      font-weight: 600;
    }

    table.data-table tr:nth-child(even) {
      background-color: #fafafa;
    }

    /* Q&A Box - Clean Human Format */
    .qa-box {
      border: 1px solid #e2e8f0;
      border-left: 3px solid #3b82f6;
      background: #fafafa;
      padding: 10px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      border-radius: 2px;
    }

    .qa-box.important {
      border-left-color: #dc2626;
      background: #fffbfb;
    }

    .qa-q {
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
      font-size: 10pt;
    }

    .qa-a {
      color: #374151;
      font-size: 9.5pt;
    }

    .qa-a strong {
      color: #111827;
    }

    /* Clean Code Format */
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.8pt;
      background: #f3f4f6;
      color: #111827;
      padding: 1px 4px;
      border-radius: 2px;
      border: 1px solid #e5e7eb;
    }

    pre {
      background: #f8fafc;
      color: #0f172a;
      padding: 9px 12px;
      border-radius: 3px;
      overflow-x: auto;
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      margin: 6px 0 10px;
      border: 1px solid #cbd5e1;
      page-break-inside: avoid;
    }

    pre .kw { color: #1e3a8a; font-weight: 600; }
    pre .fn { color: #0284c7; }
    pre .str { color: #15803d; }
    pre .comm { color: #64748b; font-style: italic; }
    pre .num { color: #d97706; }

    /* Lab Header Block */
    .lab-block {
      margin-top: 16px;
      margin-bottom: 12px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
    }

    .lab-title-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .lab-title {
      font-size: 11.5pt;
      font-weight: 700;
      color: #1e3a8a;
    }

    .lab-meta {
      font-size: 8.5pt;
      color: #4b5563;
    }

    .note-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 3px solid #16a34a;
      padding: 8px 10px;
      margin: 10px 0;
      font-size: 9pt;
      color: #166534;
      page-break-inside: avoid;
    }

    .footer-note {
      text-align: center;
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div class="inst-name">Dev Sanskriti Vishwavidyalaya, Haridwar</div>
    <div class="inst-sub">Department of Computer Science</div>

    <div class="doc-badge">Laboratory Record &amp; Viva Preparation Manual</div>

    <div class="cover-title">
      Node.js Practical Lab Record
    </div>
    <div class="cover-subtitle">
      Comprehensive Practical Exercises (Lab 01 to Lab 08) &amp; Technical Viva Guide
    </div>

    <table class="student-info-table">
      <tr>
        <td class="lbl">Student Name:</td>
        <td class="val">Bhaskar Mall</td>
      </tr>
      <tr>
        <td class="lbl">Enrollment / Roll No.:</td>
        <td class="val">23145005</td>
      </tr>
      <tr>
        <td class="lbl">Course:</td>
        <td class="val">Bachelor of Computer Applications (BCA)</td>
      </tr>
      <tr>
        <td class="lbl">Semester:</td>
        <td class="val">VII Semester</td>
      </tr>
      <tr>
        <td class="lbl">Subject Code &amp; Title:</td>
        <td class="val">CS403NOD — Node.js</td>
      </tr>
      <tr>
        <td class="lbl">Academic Session:</td>
        <td class="val">2026 – 2027</td>
      </tr>
    </table>

    <div class="cover-summary">
      This practical record covers the design, implementation, and code explanation of Node.js laboratory assignments (Lab 01 through Lab 08), including HTTP server creation, route parsing, asynchronous paradigms (Callbacks, Promises, Async/Await), file operations, EventEmitter systems, and monolithic server integration.
    </div>
  </div>

  <!-- ==================== INDEX PAGE ==================== -->
  <h1>Practical Lab Index</h1>
  <table class="index-table">
    <thead>
      <tr>
        <th style="width: 8%;">S.No.</th>
        <th style="width: 52%;">Experiment Title / Objectives</th>
        <th style="width: 25%;">Modules / APIs Used</th>
        <th style="width: 15%;">Remarks</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><strong>Lab 01:</strong> Setup, JavaScript Data Types &amp; Base HTTP Server</td>
        <td><code>http</code>, variables, typeof</td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>2</td>
        <td><strong>Lab 02:</strong> Custom Route Handling &amp; HTTP Status Codes</td>
        <td><code>http</code>, URL routing, JSON</td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>3</td>
        <td><strong>Lab 03 &amp; 04:</strong> Dynamic REST API, Query Params &amp; Modularization</td>
        <td><code>url</code>, query parser, local modules</td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>4</td>
        <td><strong>Lab 05:</strong> Asynchronous Programming (Callbacks, Promises, Async/Await)</td>
        <td><code>Promise</code>, <code>Promise.all</code></td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>5</td>
        <td><strong>Lab 06:</strong> File System Operations (fs) &amp; CLI Notes App</td>
        <td><code>fs</code>, <code>fs.promises</code>, <code>process.argv</code></td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>6</td>
        <td><strong>Lab 07:</strong> Event-Driven Architecture with EventEmitter</td>
        <td><code>events</code>, Pub/Sub pattern</td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>7</td>
        <td><strong>Lab 08:</strong> Integrated Monolithic Server &amp; Request Logger</td>
        <td><code>child_process</code>, <code>util</code>, logging</td>
        <td>Completed</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 1: ARCHITECTURE ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-architecture">1. Core Node.js Architecture &amp; Execution Model</h1>

  <p>
    Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. Understanding its architecture is essential for explaining how it manages concurrent operations on a single main thread.
  </p>

  <div class="qa-box important">
    <div class="qa-q">Question 1: What is Node.js, and what are its two core internal dependencies?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Node.js is a <strong>JavaScript runtime environment</strong> built on Google Chrome's <strong>V8 JavaScript Engine</strong> and written in C++. It allows JavaScript to interact directly with the operating system, file system, and network sockets.<br>
      The two foundational dependencies are:
      <ul>
        <li><strong>Google V8 Engine:</strong> An open-source JavaScript execution engine that compiles JavaScript source code directly into native machine code (Just-In-Time compilation).</li>
        <li><strong>libuv (C library):</strong> A cross-platform C library that handles the <strong>Event Loop</strong>, non-blocking asynchronous I/O polling, and a background <strong>Thread Pool</strong> (default 4 worker threads) for blocking operations like file system I/O, DNS lookup, and cryptographic computations.</li>
      </ul>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 2: How does Node.js handle thousands of concurrent requests if JavaScript is single-threaded?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Node.js executes application JavaScript on a <strong>single main thread</strong>, but it achieves concurrency using an <strong>Event-Driven, Non-Blocking I/O model</strong> supported by the underlying OS kernel (such as <code>epoll</code> on Linux, <code>IOCP</code> on Windows) and <code>libuv</code>.<br>
      When an I/O request (such as a database query or file read) is initiated, Node.js delegates that operation to the OS kernel or libuv thread pool along with a callback function. The main thread is immediately freed to process subsequent incoming requests. Once the operation completes, its callback is queued in the Event Loop and executed when the main call stack is empty.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 3: What are the phases of the Node.js Event Loop in order of execution?</div>
    <div class="qa-a">
      <strong>Answer:</strong> The Event Loop processes events through six primary phases in every tick:
      <ol>
        <li><strong>Timers:</strong> Executes callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code> whose timer threshold has expired.</li>
        <li><strong>Pending / I/O Callbacks:</strong> Executes deferred system-level callbacks (e.g., specific TCP connection errors).</li>
        <li><strong>Idle, Prepare:</strong> Internal libuv bookkeeping routines.</li>
        <li><strong>Poll:</strong> Retrieves new I/O events, executes I/O related callbacks, and blocks waiting for events when the queue is empty.</li>
        <li><strong>Check:</strong> Executes callbacks invoked by <code>setImmediate()</code>.</li>
        <li><strong>Close Callbacks:</strong> Executes cleanup handlers, such as <code>socket.on('close', ...)</code>.</li>
      </ol>
      <em>Note on Microtasks:</em> Callbacks scheduled with <code>process.nextTick()</code> run immediately after the current operation finishes on the call stack, before the Event Loop advances to the next phase, followed by Promise microtasks.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 4: What are the key differences between Browser JavaScript and Node.js?</div>
    <div class="qa-a">
      <table class="data-table">
        <tr>
          <th>Feature</th>
          <th>Browser Environment</th>
          <th>Node.js Environment</th>
        </tr>
        <tr>
          <td><strong>Global Scope</strong></td>
          <td><code>window</code>, <code>document</code></td>
          <td><code>global</code>, <code>process</code></td>
        </tr>
        <tr>
          <td><strong>DOM &amp; UI</strong></td>
          <td>Direct access to DOM tree and alerts</td>
          <td>No DOM; runs on the server</td>
        </tr>
        <tr>
          <td><strong>File System Access</strong></td>
          <td>Restricted by sandbox security</td>
          <td>Full direct access via <code>fs</code> and <code>path</code></td>
        </tr>
        <tr>
          <td><strong>Module System</strong></td>
          <td>ES Modules (<code>import/export</code>)</td>
          <td>CommonJS (<code>require/module.exports</code>) &amp; ESM</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- ==================== SECTION 2: LAB BREAKDOWN ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-labs">2. Lab Experiments &amp; Code Logic Breakdown</h1>

  <!-- LAB 01 -->
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 01: Setup, Variables, Data Types &amp; Base HTTP Server</div>
      <div class="lab-meta">Files: <code>Lab-01/app.js</code>, <code>Lab-01/server.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Verify the Node.js installation, demonstrate JavaScript data types using <code>typeof</code>, and create an HTTP server using Node's native <code>http</code> module without third-party frameworks.</p>

  <div class="qa-box">
    <div class="qa-q">Question: Explain the code inside Lab-01's server.js and why res.end() is required.</div>
    <div class="qa-a">
      <pre><span class="kw">const</span> http = <span class="fn">require</span>(<span class="str">'http'</span>);

<span class="kw">const</span> server = http.<span class="fn">createServer</span>((req, res) => {
  res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'text/plain'</span> });
  res.<span class="fn">end</span>(<span class="str">'Hello from Node.js Lab 01!'</span>);
});

server.<span class="fn">listen</span>(<span class="num">3000</span>, () => {
  console.<span class="fn">log</span>(<span class="str">'Server running on port 3000'</span>);
});</pre>
      <strong>Explanation:</strong><br>
      1. <code>require('http')</code> imports the built-in HTTP module provided by the Node.js runtime.<br>
      2. <code>http.createServer()</code> returns an HTTP server instance. The callback function accepts two stream objects: <code>req</code> (IncomingMessage) and <code>res</code> (ServerResponse).<br>
      3. <code>res.writeHead(200, { 'Content-Type': 'text/plain' })</code> sends the HTTP status code (200 OK) and response headers before the body is transmitted.<br>
      4. <strong>Why <code>res.end()</code> is mandatory:</strong> <code>res</code> is a writable stream. Calling <code>res.end()</code> signals to the receiving client that all headers and body chunks have been completely transmitted. If <code>res.end()</code> is omitted, the client request remains open until a network timeout occurs.
    </div>
  </div>

  <!-- LAB 02 -->
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 02: HTTP Web Server &amp; Custom Route Handling</div>
      <div class="lab-meta">Files: <code>Lab-02/server.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Construct an HTTP server capable of serving multiple URL routes (e.g., <code>/</code>, <code>/students</code>, <code>/about</code>) and returning appropriate HTTP status codes and JSON payloads.</p>

  <div class="qa-box">
    <div class="qa-q">Question: How is routing implemented without Express in native Node.js?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Native Node.js inspects <code>req.url</code> and <code>req.method</code> on each incoming request using conditional statements:
      <pre><span class="kw">const</span> server = http.<span class="fn">createServer</span>((req, res) => {
  <span class="kw">const</span> path = req.url.toLowerCase();

  <span class="kw">if</span> (path === <span class="str">'/'</span> || path === <span class="str">'/home'</span>) {
    res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'text/html'</span> });
    res.<span class="fn">end</span>(<span class="str">'&lt;h1&gt;Welcome to Lab 02&lt;/h1&gt;'</span>);
  } <span class="kw">else if</span> (path === <span class="str">'/students'</span>) {
    res.<span class="fn">writeHead</span>(<span class="num">200</span>, { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> });
    res.<span class="fn">end</span>(JSON.<span class="fn">stringify</span>([{ id: <span class="num">1</span>, name: <span class="str">'Bhaskar'</span>, course: <span class="str">'BCA'</span> }]));
  } <span class="kw">else</span> {
    res.<span class="fn">writeHead</span>(<span class="num">404</span>, { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> });
    res.<span class="fn">end</span>(JSON.<span class="fn">stringify</span>({ error: <span class="str">'Route Not Found'</span>, statusCode: <span class="num">404</span> }));
  }
});</pre>
      <em>Note:</em> Unmatched routes must return status code <strong>404 (Not Found)</strong> to avoid leaving the client in an indeterminate state.
    </div>
  </div>

  <!-- LAB 03 & 04 -->
  <div class="page-break"></div>
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 03 &amp; 04: Dynamic REST API, URL Query Processing &amp; Modules</div>
      <div class="lab-meta">Files: <code>Lab-03/student-server.js</code>, <code>Lab-04/advanced-server.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Parse URL query strings, filter datasets based on query parameters, and organize reusable application logic into custom local modules.</p>

  <div class="qa-box">
    <div class="qa-q">Question: How did you extract and sanitize URL query parameters in Lab 04?</div>
    <div class="qa-a">
      <strong>Answer:</strong> The built-in <code>url</code> module parses the incoming request URL. Passing <code>true</code> parses the query string into a structured JavaScript object:
      <pre><span class="kw">const</span> url = <span class="fn">require</span>(<span class="str">'url'</span>);
<span class="kw">const</span> parsedUrl = url.<span class="fn">parse</span>(req.url, <span class="kw">true</span>);
<span class="kw">const</span> query = parsedUrl.query; <span class="comm">// Example: { course: 'BCA', minMarks: '70' }</span>
<span class="kw">const</span> pathname = parsedUrl.pathname;

<span class="kw">if</span> (pathname === <span class="str">'/students'</span>) {
  <span class="kw">let</span> results = [...studentDatabase];

  <span class="kw">if</span> (query.course) {
    results = results.<span class="fn">filter</span>(s => s.course.toLowerCase() === query.course.toLowerCase());
  }

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
    <div class="qa-q">Question: What is the difference between Core Modules, Local Modules, and Third-Party Modules?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><strong>Core Modules:</strong> Built directly into the Node.js binary (e.g., <code>http</code>, <code>fs</code>, <code>path</code>, <code>events</code>, <code>os</code>). Loaded directly by name: <code>require('fs')</code>. No npm installation required.</li>
        <li><strong>Local Modules:</strong> Custom JavaScript files written in the project (e.g., <code>./modules/logger.js</code>). Loaded via relative paths: <code>require('./modules/logger')</code>.</li>
        <li><strong>Third-Party Modules:</strong> Packages downloaded from the npm registry (e.g., <code>slugify</code>). Stored in <code>node_modules/</code> and imported by package name: <code>require('slugify')</code>.</li>
      </ul>
    </div>
  </div>

  <!-- LAB 05 -->
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 05: Asynchronous Paradigms: Callbacks, Promises &amp; Async/Await</div>
      <div class="lab-meta">Files: <code>Lab-05/callback-version.js</code>, <code>Lab-05/async-await-version.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Compare asynchronous patterns in JavaScript using a multi-step food delivery simulation (Place Order &rarr; Cook &rarr; Dispatch &rarr; Deliver).</p>

  <div class="qa-box important">
    <div class="qa-q">Question: Compare Callbacks, Promises, and Async/Await. What is Callback Hell?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><strong>Callbacks:</strong> Functions passed as arguments to execute upon task completion. Chaining multiple asynchronous operations leads to deeply nested code known as <em>Callback Hell</em>, which makes error handling cumbersome.</li>
        <li><strong>Promises:</strong> Objects representing the eventual completion or failure of an asynchronous action. They have three states: <em>Pending</em>, <em>Fulfilled</em>, and <em>Rejected</em>. They resolve nested structures through <code>.then()</code> and <code>.catch()</code>.</li>
        <li><strong>Async/Await:</strong> Syntactic sugar introduced in ES2017 built on top of Promises. Allows asynchronous code to be written cleanly with standard <code>try...catch</code> blocks.</li>
      </ul>
      <pre><span class="kw">async function</span> <span class="fn">processDeliveryOrder</span>(orderId) {
  <span class="kw">try</span> {
    <span class="kw">const</span> order = <span class="kw">await</span> <span class="fn">placeOrder</span>(orderId);
    <span class="kw">const</span> food = <span class="kw">await</span> <span class="fn">prepareFood</span>(order);
    <span class="kw">const</span> rider = <span class="kw">await</span> <span class="fn">dispatchRider</span>(food);
    <span class="kw">const</span> delivered = <span class="kw">await</span> <span class="fn">deliverFood</span>(rider);
    console.<span class="fn">log</span>(<span class="str">'Order completed:'</span>, delivered);
  } <span class="kw">catch</span> (err) {
    console.<span class="fn">error</span>(<span class="str">'Error during delivery:'</span>, err.message);
  }
}</pre>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question: What is Promise.all() and when is it preferred over sequential awaits?</div>
    <div class="qa-a">
      <strong>Answer:</strong> <code>Promise.all([p1, p2, p3])</code> executes an array of promises concurrently. It resolves when all promises complete, or rejects immediately if any single promise fails.<br>
      <em>Usage:</em> When tasks are independent (such as fetching data from three separate APIs or reading three unrelated files), sequential <code>await</code> takes the total combined time, whereas <code>Promise.all()</code> runs them in parallel, completing in approximately the time of the slowest operation.
    </div>
  </div>

  <!-- LAB 06 -->
  <div class="page-break"></div>
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 06: File System (fs) Module &amp; CLI Notes Application</div>
      <div class="lab-meta">Files: <code>Lab-06/fs-demo.js</code>, <code>Lab-06/add-note.js</code>, <code>Lab-06/read-notes.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Perform file read and write operations using synchronous and asynchronous methods, and parse command-line arguments using <code>process.argv</code>.</p>

  <div class="qa-box important">
    <div class="qa-q">Question: Why does fs.readFile() not block the program while fs.readFileSync() does?</div>
    <div class="qa-a">
      <strong>Answer:</strong><br>
      <code>fs.readFile()</code> is asynchronous. When called, Node.js delegates the disk read request to the <code>libuv</code> thread pool and continues running subsequent JavaScript code without pausing. The callback is invoked only when the file reading finishes.<br>
      In contrast, <code>fs.readFileSync()</code> is synchronous. It blocks the main JavaScript thread completely until the entire file has been read from storage into memory. No other requests can be handled while this operation is in progress.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question: In the Notes App, what happens if two users execute add-note.js simultaneously?</div>
    <div class="qa-a">
      <strong>Answer:</strong><br>
      A <strong>Race Condition</strong> occurs. When two separate processes append data to the same file simultaneously without a locking mechanism, write operations can overlap, resulting in garbled text or lost updates. In concurrent production applications, transactional databases (like PostgreSQL or MongoDB) or message queues are used instead of shared flat files.
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question: How do you read command-line arguments in Node.js?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Via the global <code>process.argv</code> array:<br>
      <code>process.argv[0]</code> = Path to the Node.js executable (<code>node.exe</code>).<br>
      <code>process.argv[1]</code> = Path to the JavaScript script file being executed.<br>
      <code>process.argv[2]</code> onwards = User-supplied command-line parameters.<br>
      Example: In <code>node add-note.js "Study Node"</code>, <code>process.argv[2]</code> equals <code>"Study Node"</code>.
    </div>
  </div>

  <!-- LAB 07 -->
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 07: EventEmitter Architecture &amp; Event-Driven Programming</div>
      <div class="lab-meta">Files: <code>Lab-07/emitter.js</code>, <code>Lab-07/07-practical-example/app.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Implement publisher-subscriber event workflows using the built-in <code>EventEmitter</code> class from the <code>events</code> module.</p>

  <div class="qa-box important">
    <div class="qa-q">Question: Explain EventEmitter methods: on, emit, once, removeListener.</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><code>emitter.on(eventName, listener)</code>: Registers a listener callback function that executes every time the event is emitted.</li>
        <li><code>emitter.emit(eventName, ...args)</code>: Triggers the event synchronously, invoking all registered listeners in order.</li>
        <li><code>emitter.once(eventName, listener)</code>: Registers a one-time listener that is automatically removed after its first invocation.</li>
        <li><code>emitter.removeListener(eventName, listener)</code>: Unregisters a specific listener function to avoid memory leaks.</li>
      </ul>
      <pre><span class="kw">const</span> EventEmitter = <span class="fn">require</span>(<span class="str">'events'</span>);
<span class="kw">class</span> <span class="fn">OrderTracker</span> <span class="kw">extends</span> EventEmitter {}
<span class="kw">const</span> tracker = <span class="kw">new</span> <span class="fn">OrderTracker</span>();

tracker.<span class="fn">on</span>(<span class="str">'orderPlaced'</span>, (data) => console.<span class="fn">log</span>(<span class="str">'Notification sent:'</span>, data.customer));
tracker.<span class="fn">once</span>(<span class="str">'orderDelivered'</span>, (data) => console.<span class="fn">log</span>(<span class="str">'Delivered successfully'</span>));

tracker.<span class="fn">emit</span>(<span class="str">'orderPlaced'</span>, { orderId: <span class="num">101</span>, customer: <span class="str">'Bhaskar'</span> });</pre>
      <em>Important:</em> If an <code>'error'</code> event is emitted without an active listener, Node.js throws an uncaught exception and terminates the process. Therefore, <code>emitter.on('error', handler)</code> should always be registered.
    </div>
  </div>

  <!-- LAB 08 -->
  <div class="page-break"></div>
  <div class="lab-block">
    <div class="lab-title-row">
      <div class="lab-title">Experiment 08: Integrated Monolithic Lab Server &amp; System Logger</div>
      <div class="lab-meta">Files: <code>Lab-08/server.js</code>, <code>Lab-08/labs.js</code>, <code>Lab-08/modules/logger.js</code></div>
    </div>
  </div>
  <p><strong>Objective:</strong> Consolidate previous lab implementations into an integrated server without rewriting the original code, using module delegation and child process execution.</p>

  <div class="qa-box important">
    <div class="qa-q">Question: How did you integrate all previous labs without rewriting them?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ol>
        <li><strong>Server Labs (Lab 01, Lab 02):</strong> The master server imports the handler function using <code>require(labPath)</code>. For incoming requests matching <code>/labs/:id/app/...</code>, it adjusts the URL prefix and delegates directly to the existing handler: <code>handler(req, res)</code>.</li>
        <li><strong>Script Labs (Lab 03 to Lab 07):</strong> The server executes the script file using Node's built-in <code>child_process.execFile()</code> wrapped with <code>util.promisify</code>:
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
    <div class="qa-q">Question: How does the custom EventEmitter logging system in Lab 08 work?</div>
    <div class="qa-a">
      <strong>Answer:</strong> Inside <code>modules/logger.js</code>, a custom class extending <code>EventEmitter</code> is used. For each incoming request, the server emits a log event:
      <code>logger.emit("request", req.method, req.url);</code><br>
      The listener formats an ISO timestamp and asynchronously appends the entry to <code>logs/server.log</code>:
      <pre>logger.<span class="fn">on</span>(<span class="str">"request"</span>, (method, requestUrl) => {
  <span class="kw">const</span> entry = <span class="kw">new</span> Date().<span class="fn">toISOString</span>() + <span class="str">" "</span> + method + <span class="str">" "</span> + requestUrl;
  console.<span class="fn">log</span>(entry);
  fs.<span class="fn">appendFile</span>(LOG_FILE, entry + <span class="str">"\\n"</span>, (err) => {
    <span class="kw">if</span> (err) logger.<span class="fn">emit</span>(<span class="str">"error"</span>, err);
  });
});</pre>
    </div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question: What is the difference between execFile, exec, spawn, and fork?</div>
    <div class="qa-a">
      <strong>Answer:</strong>
      <ul>
        <li><code>execFile</code>: Runs an executable file directly without invoking a system shell. It is secure against shell injection and has lower overhead.</li>
        <li><code>exec</code>: Spawns a system shell (e.g., cmd or bash) to execute a command string. It buffers output but carries security risks if inputs are unsanitized.</li>
        <li><code>spawn</code>: Spawns a new process and streams data via <code>stdout</code> and <code>stderr</code>, suitable for handling large outputs without buffer overflow.</li>
        <li><code>fork</code>: A specialized version of <code>spawn</code> designed specifically to launch new Node.js instances with built-in Inter-Process Communication (IPC).</li>
      </ul>
    </div>
  </div>

  <!-- ==================== SECTION 3: VIVA QUESTIONS ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-viva">3. Essential Conceptual Viva Questions &amp; Answers</h1>

  <div class="qa-box">
    <div class="qa-q">Question 1: What is the difference between require() and import?</div>
    <div class="qa-a"><code>require()</code> is synchronous and belongs to the CommonJS module system traditionally used in Node.js. <code>import</code> is asynchronous, statically analyzed, and belongs to the ES Module standard.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 2: What is the difference between module.exports and exports?</div>
    <div class="qa-a"><code>module.exports</code> is the actual object exported by the module when required. <code>exports</code> is simply a reference pointing to <code>module.exports</code>. Reassigning <code>exports = {}</code> breaks the reference, so assignments should be made directly to <code>module.exports</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 3: What is the purpose of package.json and package-lock.json?</div>
    <div class="qa-a"><code>package.json</code> contains project metadata, scripts, and semantic version ranges. <code>package-lock.json</code> stores the exact dependency tree with specific versions and hashes to ensure identical installations across environments.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 4: What do caret (^) and tilde (~) mean in dependency versioning?</div>
    <div class="qa-a"><code>^1.6.0</code> allows updates that do not modify the major version (e.g., 1.6.1 or 1.7.0). <code>~1.6.0</code> allows only patch-level updates (e.g., 1.6.1, but not 1.7.0).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 5: What is the difference between process.nextTick() and setImmediate()?</div>
    <div class="qa-a"><code>process.nextTick()</code> runs immediately after the current operation finishes on the call stack, before the Event Loop advances. <code>setImmediate()</code> runs during the Check phase of the Event Loop.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 6: What is a Stream in Node.js and what are its types?</div>
    <div class="qa-a">A stream is an interface for reading or writing data chunk-by-chunk without loading the entire payload into RAM. The four types are: <strong>Readable</strong> (e.g., <code>fs.createReadStream</code>), <strong>Writable</strong> (e.g., <code>res</code>, <code>fs.createWriteStream</code>), <strong>Duplex</strong> (e.g., TCP socket), and <strong>Transform</strong> (e.g., <code>zlib</code> compression).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 7: What is an error-first callback?</div>
    <div class="qa-a">A Node.js standard where the first parameter of a callback is reserved for an error object (if an error occurred), while subsequent parameters carry the result: <code>(err, result) => { if (err) { ... } }</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 8: What is a Buffer in Node.js?</div>
    <div class="qa-a">A global class used to handle raw binary memory directly outside V8's garbage-collected heap, commonly used when dealing with TCP network packets and disk file streams.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 9: What causes the EADDRINUSE error and how is it resolved?</div>
    <div class="qa-a">It occurs when a server attempts to listen on a TCP port that is already in use by another running process. It is resolved by terminating the existing process (e.g., via <code>taskkill /F /IM node.exe</code> on Windows) or by specifying a different port.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 10: What is the difference between path.join() and path.resolve()?</div>
    <div class="qa-a"><code>path.join()</code> concatenates path segments using the operating system's separator (<code>\\</code> on Windows, <code>/</code> on Linux). <code>path.resolve()</code> resolves segments into an absolute path based on the current working directory.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 11: Why is blocking the Event Loop dangerous in Node.js?</div>
    <div class="qa-a">Because Node.js executes JavaScript on a single thread. If an intensive synchronous CPU calculation or synchronous file read blocks that thread, all other connected clients are blocked from receiving responses until the operation finishes.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Question 12: What is util.promisify?</div>
    <div class="qa-a">A built-in utility in the <code>util</code> module that converts standard error-first callback functions into Promise-returning functions, allowing them to be used with <code>await</code>.</div>
  </div>

  <!-- ==================== SECTION 4: CHEATSHEET ==================== -->
  <div class="page-break"></div>
  <h1 id="sec-run">4. Practical Execution Reference &amp; Run Commands</h1>

  <table class="data-table">
    <tr>
      <th>Experiment</th>
      <th>Directory</th>
      <th>Terminal Command</th>
      <th>Verification URL / Output</th>
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
      <td><code>node student-server.js</code></td>
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
      <td>Console logs showing step-by-step food delivery timestamps</td>
    </tr>
    <tr>
      <td><strong>Lab 06</strong></td>
      <td><code>Lab-06/</code></td>
      <td><code>node fs-demo.js</code><br><code>node add-note.js "Prepare Viva"</code><br><code>node read-notes.js</code></td>
      <td>Checks notes created in <code>notes.txt</code> on disk</td>
    </tr>
    <tr>
      <td><strong>Lab 07</strong></td>
      <td><code>Lab-07/</code></td>
      <td><code>node emitter.js</code></td>
      <td>Console output showing single and multi-listener events</td>
    </tr>
    <tr>
      <td><strong>Lab 08</strong></td>
      <td><code>Lab-08/</code></td>
      <td><code>node server.js</code></td>
      <td><code>http://localhost:3000/</code> &amp; <code>http://localhost:3000/health</code></td>
    </tr>
    <tr>
      <td><strong>Portfolio</strong></td>
      <td><code>NodeJS-lab/</code></td>
      <td><code>node portfolio-server.js</code></td>
      <td><code>http://localhost:5050/</code></td>
    </tr>
  </table>

  <div class="note-box">
    <strong>Verification Note — Lab 08 Execution:</strong><br>
    1. Navigate to directory: <code>cd Lab-08</code><br>
    2. Start server: <code>node server.js</code><br>
    3. Visit <code>http://localhost:3000/health</code> &rarr; confirms server status and active environment.<br>
    4. Visit <code>http://localhost:3000/labs/02/app/students?course=BCA</code> &rarr; verifies route delegation to Lab 02.<br>
    5. Visit <code>http://localhost:3000/labs/05/run</code> &rarr; executes script lab via <code>child_process.execFile</code>.
  </div>

  <div class="footer-note">
    Prepared by Bhaskar Mall (Roll No: 23145005) · BCA VII Semester · Dev Sanskriti Vishwavidyalaya, Haridwar
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

// 3. Also generate Markdown version
const mdContent = `# Node.js Practical Lab Record & Viva Guide
**Student Name:** Bhaskar Mall | **Roll No:** 23145005  
**Course:** BCA VII Semester | **Subject:** CS403NOD — Node.js  
**Institution:** Dev Sanskriti Vishwavidyalaya, Haridwar  

---

## 1. Core Node.js Architecture & Execution Model

### Question 1: What is Node.js, and what are its two core internal dependencies?
- **Answer:** Node.js is an open-source, cross-platform **JavaScript runtime environment** built on Google Chrome's **V8 JavaScript Engine** and written in C++.
- **Two Core Dependencies:**
  1. **Google V8 Engine:** Compiles JavaScript source code directly into native machine code (Just-In-Time compilation).
  2. **libuv (C library):** Provides the **Event Loop**, non-blocking asynchronous I/O polling, and a background **Thread Pool** (default 4 threads) for blocking system tasks (file I/O, DNS, crypto).

### Question 2: How does Node.js handle thousands of concurrent requests if JavaScript is single-threaded?
- Node.js executes JavaScript on a **single main thread**, but achieves high concurrency using an **Event-Driven, Non-Blocking I/O model**.
- When an I/O request (file read, DB query, network) arrives, Node.js delegates it to the OS kernel or libuv thread pool and registers a callback.
- The main thread is immediately freed to accept new incoming connections. When the I/O finishes, its callback is queued in the Event Loop and executed when the main stack is empty.

### Question 3: What are the phases of the Node.js Event Loop in order of execution?
1. **Timers:** Callbacks from \`setTimeout()\` and \`setInterval()\`.
2. **Pending / I/O Callbacks:** Deferred system callbacks (e.g., TCP errors).
3. **Idle, Prepare:** Internal libuv bookkeeping.
4. **Poll:** Retrieves new I/O events; executes I/O callbacks; blocks and waits when empty.
5. **Check:** Callbacks from \`setImmediate()\`.
6. **Close Callbacks:** Cleanup callbacks, e.g. \`socket.on('close', ...)\`.
- *Microtasks Queue:* \`process.nextTick()\` executes immediately after the current operation, before the loop advances.

---

## 2. Lab Experiments & Code Logic Breakdown (Labs 01 to 08)

### Experiment 01 — Setup, Variables, Data Types & Base HTTP Server
- **Files:** \`Lab-01/app.js\`, \`Lab-01/server.js\`
- **Core Code:** \`http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/plain'}); res.end('Hello'); }).listen(3000);\`
- **Why \`res.end()\` is mandatory:** \`res\` is a writable stream. \`res.end()\` signals that all headers and body data have been sent. Without it, the client connection hangs indefinitely until timeout.

### Experiment 02 — HTTP Web Server & Route Handling
- **Files:** \`Lab-02/server.js\`
- **Core Concept:** Routing without Express by inspecting \`req.url\` and \`req.method\`.
- **Status Codes:** 200 (OK), 404 (Not Found for unhandled paths).
- **Header:** \`res.writeHead(200, { 'Content-Type': 'application/json' })\` to return JSON strings via \`JSON.stringify()\`.

### Experiment 03 & 04 — Dynamic REST API, Query Parameters & Modules
- **Files:** \`Lab-03/student-server.js\`, \`Lab-04/advanced-server.js\`
- **URL Parsing:** \`url.parse(req.url, true).query\` converts query string into object (e.g., \`?course=BCA&minMarks=70\`).
- **Data Filtering:** Uses JavaScript \`filter()\` with validation (\`parseFloat(query.minMarks)\`, \`!isNaN()\`).
- **Module Types:**
  - *Core Modules:* Built into Node (\`http\`, \`fs\`, \`path\`, \`events\`, \`os\`).
  - *Local Modules:* Written in project (\`./modules/logger.js\`).
  - *Third-Party:* Installed from npm (\`slugify\`).

### Experiment 05 — Asynchronous Paradigms: Callbacks, Promises, Async/Await
- **Files:** \`Lab-05/callback-version.js\`, \`Lab-05/promise-version.js\`, \`Lab-05/async-await-version.js\`
- **Evolution:**
  - *Callback Hell:* Nested pyramids with inversion of control and messy error handling.
  - *Promises:* States: Pending, Fulfilled, Rejected. Handled via \`.then()\` and \`.catch()\`.
  - *Async/Await:* Syntactic sugar over Promises. Sequential synchronous-looking code with \`try...catch\`.
  - *\`Promise.all()\` Concurrency:* Executes independent promises in parallel.

### Experiment 06 — File System (fs) Module & CLI Notes App
- **Files:** \`Lab-06/fs-demo.js\`, \`Lab-06/add-note.js\`, \`Lab-06/read-notes.js\`
- **Why async \`readFile()\` does not block:** It delegates disk I/O to libuv thread pool, freeing the main thread immediately. Sync \`readFileSync()\` blocks the single thread completely.
- **Race Conditions:** Concurrent writes to the same physical text file can interleave or corrupt data. Databases provide transactions to avoid this.
- **CLI Arguments:** Accessed via \`process.argv.slice(2)\`.

### Experiment 07 — EventEmitter Architecture
- **Files:** \`Lab-07/emitter.js\`, \`Lab-07/07-practical-example/app.js\`
- **Methods:**
  - \`emitter.on(event, listener)\`: Registers permanent listener.
  - \`emitter.emit(event, ...args)\`: Triggers event synchronously.
  - \`emitter.once(event, listener)\`: Triggers only once and auto-removes.
  - \`emitter.removeListener(event, listener)\`: Removes listener to prevent memory leaks.
- **Error Event Rule:** Always handle \`emitter.on('error', ...)\`, otherwise an unhandled \`'error'\` event will crash the entire Node.js process.

### Experiment 08 — Integrated Monolithic Server
- **Files:** \`Lab-08/server.js\`, \`Lab-08/labs.js\`, \`Lab-08/modules/logger.js\`
- **Server Labs Integration:** Uses \`module.exports = handler\` and request URL rewrites.
- **Script Labs Integration:** Executes files safely with \`child_process.execFile(process.execPath, [file], { timeout: 5000 })\`.
- **Event-Driven Logging:** Custom \`Logger\` class extends \`EventEmitter\` emitting \`"request"\` on each hit, writing asynchronously to \`logs/server.log\`.

---

## 3. Top Conceptual Viva Questions & Answers

1. **require vs import:** require is CommonJS and synchronous; import is ES Modules and static/asynchronous.
2. **module.exports vs exports:** module.exports is the actual exported object; exports is only a variable reference pointing to it.
3. **package.json vs package-lock.json:** package.json defines version ranges; package-lock.json locks exact installed versions and hashes.
4. **process.nextTick vs setImmediate:** process.nextTick runs immediately after current operation; setImmediate runs in the Check phase.
5. **Stream:** An interface for reading/writing data chunk-by-chunk without loading entire file into RAM.
6. **Buffer:** Handles raw binary memory outside the V8 heap.
7. **EADDRINUSE:** Port is already in use by another process. Fix with \`taskkill /F /IM node.exe\` or specify another port.
8. **path.join vs path.resolve:** path.join concatenates segments; path.resolve resolves to an absolute path.
9. **util.promisify:** Converts callback-based functions into Promise-returning functions.
10. **Single-threaded limitation:** Heavy CPU loops block all clients; offload CPU tasks to Worker Threads or separate services.

---

## 4. Practical Execution Cheatsheet

- **Start Portfolio:** \`node portfolio-server.js\` (Runs on http://localhost:5050)
- **Start Lab-08:** \`cd Lab-08 && node server.js\` (Runs on http://localhost:3000)
- **Health Check:** http://localhost:3000/health
- **Lab 01 Server:** http://localhost:3000/labs/01/app/
- **Lab 02 Server Filter:** http://localhost:3000/labs/02/app/students?course=BCA
- **Lab 05 Script Execution:** http://localhost:3000/labs/05/run
`;

fs.writeFileSync(OUTPUT_MD, mdContent, 'utf8');
console.log('✓ Created:', OUTPUT_MD);
console.log('Clean assessment guide preparation complete!');
