/**
 * Node.js Lab Portfolio — Dynamic Application Script
 * Author: Bhaskar Mall
 */

document.addEventListener('DOMContentLoaded', () => {
  let portfolioData = { stats: {}, labs: [] };
  let currentFilter = 'all';
  let searchQuery = '';
  let currentSort = 'asc';
  let activeLab = null;
  let activeFileIndex = 0;

  // DOM Elements
  const statsLabs = document.getElementById('statLabs');
  const statsJsFiles = document.getElementById('statJsFiles');
  const statsProjects = document.getElementById('statProjects');
  const statsScreenshots = document.getElementById('statScreenshots');
  const statsLoc = document.getElementById('statLoc');
  const statsTech = document.getElementById('statTech');

  const labsGrid = document.getElementById('labsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const techFilters = document.getElementById('techFilters');
  const sortSelect = document.getElementById('sortSelect');
  const resultsCount = document.getElementById('resultsCount');

  const labModal = document.getElementById('labModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Modal elements
  const modalLabNum = document.getElementById('modalLabNum');
  const modalLabStatus = document.getElementById('modalLabStatus');
  const modalTechTags = document.getElementById('modalTechTags');
  const modalLabTitle = document.getElementById('modalLabTitle');
  const modalObjective = document.getElementById('modalObjective');
  const modalConcepts = document.getElementById('modalConcepts');
  const modalDescription = document.getElementById('modalDescription');
  const modalEntryFile = document.getElementById('modalEntryFile');
  const modalStudentName = document.getElementById('modalStudentName');
  const modalScholarNo = document.getElementById('modalScholarNo');
  const modalTotalLines = document.getElementById('modalTotalLines');
  const modalFileCount = document.getElementById('modalFileCount');
  const modalShotCount = document.getElementById('modalShotCount');

  const fileTabs = document.getElementById('fileTabs');
  const codeBlock = document.getElementById('codeBlock');
  const activeFileInfo = document.getElementById('activeFileInfo');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  const screenshotsContainer = document.getElementById('screenshotsContainer');
  const modalRunCommands = document.getElementById('modalRunCommands');
  const serverInfoSection = document.getElementById('serverInfoSection');
  const endpointsList = document.getElementById('endpointsList');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  // Mobile nav toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  /**
   * Fetch portfolio labs.json data
   */
  async function loadPortfolioData() {
    try {
      const response = await fetch('labs.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      portfolioData = await response.json();
      initPortfolio();
    } catch (err) {
      console.warn('Could not load labs.json directly. Retrying fallback scan:', err);
      // Sensible fallback if labs.json isn't loaded yet
      renderFallbackNotice();
    }
  }

  /**
   * Initialize UI with data
   */
  function initPortfolio() {
    renderStats(portfolioData.stats);
    renderTechFilterPills(portfolioData.stats.allTechnologies || []);
    renderLabs();
    checkUrlHash();

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      clearSearchBtn.classList.toggle('hidden', searchQuery === '');
      renderLabs();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderLabs();
    });

    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderLabs();
    });

    // Hash change event for direct links (#lab-01, #lab-02)
    window.addEventListener('hashchange', checkUrlHash);
  }

  /**
   * Render Dashboard Statistics
   */
  function renderStats(stats) {
    if (!stats) return;
    statsLabs.textContent = stats.totalLabs || 0;
    statsJsFiles.textContent = stats.totalJsFiles || 0;
    statsProjects.textContent = stats.totalProjects || 0;
    statsScreenshots.textContent = stats.totalScreenshots || 0;
    statsLoc.textContent = (stats.totalLinesOfCode || 0).toLocaleString();
    statsTech.textContent = (stats.allTechnologies || []).length;
  }

  /**
   * Render Technology Filter Pills
   */
  function renderTechFilterPills(technologies) {
    techFilters.innerHTML = '<button class="pill active" data-tech="all">All</button>';
    technologies.forEach(tech => {
      const pill = document.createElement('button');
      pill.className = 'pill';
      pill.dataset.tech = tech;
      pill.textContent = tech;
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = tech;
        renderLabs();
      });
      techFilters.appendChild(pill);
    });

    document.querySelector('.pill[data-tech="all"]').addEventListener('click', function() {
      document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      currentFilter = 'all';
      renderLabs();
    });
  }

  /**
   * Render Lab Cards Grid
   */
  function renderLabs() {
    let filtered = portfolioData.labs.filter(lab => {
      // Tech filter
      const matchesTech = currentFilter === 'all' || lab.technologies.includes(currentFilter);
      if (!matchesTech) return false;

      // Text search query matching
      if (!searchQuery) return true;

      const titleMatch = lab.title.toLowerCase().includes(searchQuery);
      const numMatch = lab.formattedLabNo.toLowerCase().includes(searchQuery) || `lab-${lab.labNo}`.includes(searchQuery);
      const conceptMatch = (lab.concepts || []).some(c => c.toLowerCase().includes(searchQuery));
      const techMatch = (lab.technologies || []).some(t => t.toLowerCase().includes(searchQuery));
      const fileMatch = (lab.files || []).some(f => f.filename.toLowerCase().includes(searchQuery) || f.content.toLowerCase().includes(searchQuery));

      return titleMatch || numMatch || conceptMatch || techMatch || fileMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (currentSort === 'asc') return a.labNo - b.labNo;
      if (currentSort === 'desc') return b.labNo - a.labNo;
      if (currentSort === 'files') return (b.files || []).length - (a.files || []).length;
      if (currentSort === 'screenshots') return (b.screenshots || []).length - (a.screenshots || []).length;
      return 0;
    });

    resultsCount.textContent = `Showing ${filtered.length} of ${portfolioData.labs.length} labs`;

    if (filtered.length === 0) {
      labsGrid.innerHTML = `
        <div class="empty-state">
          <h3>No labs match your filter</h3>
          <p>Try searching for a different keyword or select "All" technologies.</p>
        </div>
      `;
      return;
    }

    labsGrid.innerHTML = filtered.map(lab => {
      const techBadges = lab.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
      const shotCount = (lab.screenshots || []).length;
      const fileCount = (lab.files || []).length;

      return `
        <article class="lab-card">
          <div class="lab-card-top">
            <div class="lab-card-meta">
              <span class="lab-no-tag">${lab.formattedLabNo}</span>
              <span class="lab-files-badge">${fileCount} files · ${shotCount} shots</span>
            </div>
            <h3 class="lab-card-title">${escapeHtml(lab.title)}</h3>
            <p class="lab-card-desc">${escapeHtml(lab.description)}</p>
            <div class="tech-tags-list">
              ${techBadges}
            </div>
          </div>
          <div class="lab-card-actions">
            <button class="btn btn-primary open-lab-btn" data-lab="${lab.labNo}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              View Lab
            </button>
            <button class="btn btn-outline code-lab-btn" data-lab="${lab.labNo}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Code
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners to cards
    document.querySelectorAll('.open-lab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const labNo = parseInt(btn.dataset.lab, 10);
        openLabModal(labNo, 'overview');
      });
    });

    document.querySelectorAll('.code-lab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const labNo = parseInt(btn.dataset.lab, 10);
        openLabModal(labNo, 'code');
      });
    });
  }

  /**
   * Open Lab Detail Modal
   */
  function openLabModal(labNo, initialTab = 'overview') {
    const lab = portfolioData.labs.find(l => l.labNo === labNo);
    if (!lab) return;

    activeLab = lab;
    activeFileIndex = 0;

    // Update URL hash
    window.location.hash = `lab-${String(lab.labNo).padStart(2, '0')}`;

    // Populate modal basic details
    modalLabNum.textContent = lab.formattedLabNo;
    modalLabStatus.textContent = lab.status || 'Completed';
    modalLabTitle.textContent = lab.title;
    modalObjective.textContent = lab.objective || 'Practical implementation of Node.js concepts.';
    modalDescription.textContent = lab.description;
    modalEntryFile.textContent = lab.entryFile || 'index.js';
    modalStudentName.textContent = (lab.student && lab.student.name) || 'Bhaskar Mall';
    modalScholarNo.textContent = (lab.student && lab.student.scholarNo) || '23145005';
    modalTotalLines.textContent = lab.totalLines || 0;
    modalFileCount.textContent = (lab.files || []).length;
    modalShotCount.textContent = (lab.screenshots || []).length;

    modalTechTags.innerHTML = (lab.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

    // Populate concepts
    modalConcepts.innerHTML = (lab.concepts || []).map(c => `<li>${escapeHtml(c)}</li>`).join('');

    // Setup Code Viewer
    setupCodeViewer(lab.files || []);

    // Setup Screenshots Gallery
    setupScreenshotsGallery(lab.screenshots || []);

    // Setup How To Run
    setupRunInstructions(lab);

    // Switch tab
    switchModalTab(initialTab);

    // Display modal
    labModal.classList.add('active');
    labModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close Lab Detail Modal
   */
  function closeLabModal() {
    labModal.classList.remove('active');
    labModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.location.hash = '';
  }

  modalCloseBtn.addEventListener('click', closeLabModal);

  // Close modal when clicking overlay background
  labModal.addEventListener('click', (e) => {
    if (e.target === labModal) closeLabModal();
  });

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && labModal.classList.contains('active')) {
      closeLabModal();
    }
  });

  /**
   * Switch Modal Tabs (Overview, Code, Screenshots, Run)
   */
  function switchModalTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchModalTab(btn.dataset.tab);
    });
  });

  /**
   * Setup Interactive Code Viewer
   */
  function setupCodeViewer(files) {
    if (!files || files.length === 0) {
      fileTabs.innerHTML = '<div class="file-tab">No code files available</div>';
      codeBlock.textContent = '// No code files in this lab.';
      activeFileInfo.textContent = '';
      return;
    }

    fileTabs.innerHTML = files.map((f, idx) => `
      <button class="file-tab ${idx === 0 ? 'active' : ''}" data-file-idx="${idx}">
        ${f.filename}
      </button>
    `).join('');

    renderSelectedFile(files[0]);

    document.querySelectorAll('.file-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const idx = parseInt(tab.dataset.fileIdx, 10);
        activeFileIndex = idx;
        renderSelectedFile(files[idx]);
      });
    });
  }

  function renderSelectedFile(fileObj) {
    if (!fileObj) return;
    activeFileInfo.textContent = `${fileObj.filename} · ${fileObj.lines} lines · ${(fileObj.sizeBytes / 1024).toFixed(1)} KB`;
    codeBlock.innerHTML = highlightSyntax(fileObj.content, fileObj.ext);
  }

  copyCodeBtn.addEventListener('click', () => {
    if (!activeLab || !activeLab.files || !activeLab.files[activeFileIndex]) return;
    const code = activeLab.files[activeFileIndex].content;
    navigator.clipboard.writeText(code).then(() => {
      const origText = copyCodeBtn.innerHTML;
      copyCodeBtn.innerHTML = '✓ Copied!';
      setTimeout(() => copyCodeBtn.innerHTML = origText, 2000);
    });
  });

  /**
   * Simple Lightweight Syntax Highlighter
   */
  function highlightSyntax(code, ext) {
    const esc = escapeHtml(code);
    if (ext === 'txt' || ext === 'md') return esc;

    return esc
      .replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>')
      .replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, '<span class="token-string">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|switch|case|break|try|catch|async|await|require|module|exports|class|new|typeof)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="token-number">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
      .replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="token-function">$1</span>');
  }

  /**
   * Setup Screenshots Gallery & Lightbox
   */
  function setupScreenshotsGallery(screenshots) {
    if (!screenshots || screenshots.length === 0) {
      screenshotsContainer.innerHTML = `
        <div class="empty-state">
          <h3>No screenshots added yet</h3>
          <p>Terminal captures or browser outputs will appear here when added to screenshots/ directory.</p>
        </div>
      `;
      return;
    }

    screenshotsContainer.innerHTML = screenshots.map(shot => `
      <div class="shot-card" data-img-src="${shot.path}" data-caption="${escapeHtml(shot.caption)}">
        <div class="shot-img-wrapper">
          <img src="${shot.path}" alt="${escapeHtml(shot.caption)}" loading="lazy">
        </div>
        <div class="shot-caption">${escapeHtml(shot.caption)}</div>
      </div>
    `).join('');

    document.querySelectorAll('.shot-card').forEach(card => {
      card.addEventListener('click', () => {
        lightboxImage.src = card.dataset.imgSrc;
        lightboxCaption.textContent = card.dataset.caption;
        lightboxModal.classList.add('active');
      });
    });
  }

  lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.remove('active');
  });

  /**
   * Setup How to Run Instructions
   */
  function setupRunInstructions(lab) {
    const isServer = lab.technologies.includes('HTTP Module') || lab.technologies.includes('REST API');
    modalRunCommands.textContent = `cd NodeJS-lab/${lab.folder}\n${lab.howToRun || 'node index.js'}`;

    if (isServer) {
      serverInfoSection.classList.remove('hidden');
      if (lab.labNo === 2) {
        endpointsList.innerHTML = `
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/</span>
            <span class="endpoint-desc">Home Route - Welcome & Student details</span>
          </div>
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/about</span>
            <span class="endpoint-desc">About Route - Short intro</span>
          </div>
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/profile</span>
            <span class="endpoint-desc">Profile Route - Returns JSON student object</span>
          </div>
        `;
      } else if (lab.labNo === 3) {
        endpointsList.innerHTML = `
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/</span>
            <span class="endpoint-desc">Index - Lists all 12 student IDs and names</span>
          </div>
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/03</span>
            <span class="endpoint-desc">ID Search - Full details for Student 03 (Bhaskar Mall)</span>
          </div>
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/BhaskarMall</span>
            <span class="endpoint-desc">Name Search - Case-insensitive student lookup</span>
          </div>
        `;
      } else if (lab.labNo === 4) {
        endpointsList.innerHTML = `
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/students</span>
            <span class="endpoint-desc">All Students JSON API</span>
          </div>
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/students?course=BCA&minMarks=80</span>
            <span class="endpoint-desc">Filtered Search - BCA course with min 80 marks</span>
          </div>
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/students?sort=marks&order=desc</span>
            <span class="endpoint-desc">Sorted List - Highest to lowest marks</span>
          </div>
        `;
      } else {
        endpointsList.innerHTML = `
          <div class="endpoint-item">
            <span class="endpoint-url">http://localhost:3000/</span>
            <span class="endpoint-desc">Main HTTP endpoint</span>
          </div>
        `;
      }
    } else {
      serverInfoSection.classList.add('hidden');
    }
  }

  /**
   * Check URL hash for direct lab opening (#lab-01, #lab-02)
   */
  function checkUrlHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#lab-(\d+)$/i);
    if (match) {
      const labNo = parseInt(match[1], 10);
      openLabModal(labNo);
    }
  }

  /**
   * Helper: Escape HTML strings
   */
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderFallbackNotice() {
    labsGrid.innerHTML = `
      <div class="empty-state">
        <h3>Generating Portfolio Dataset...</h3>
        <p>Run <code>npm run build</code> to generate <code>labs.json</code>.</p>
      </div>
    `;
  }

  // Start initialization
  loadPortfolioData();
});
