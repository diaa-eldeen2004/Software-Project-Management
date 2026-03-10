(function () {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    themeToggle.addEventListener('click', () => {
      const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  const page = document.body.dataset.page;

  // Utility: simple section switching for side navs
  function setupSectionNav(navId, containerId) {
    const nav = document.getElementById(navId);
    const container = document.getElementById(containerId);
    if (!nav || !container) return;

    const links = nav.querySelectorAll("a[data-section]");
    const panels = container.querySelectorAll("[data-section-panel]");

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.section;

        links.forEach((l) => l.classList.toggle("is-active", l === link));
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.sectionPanel !== target;
        });
      });
    });
  }

  // IT workspace
  function initIT() {
    setupSectionNav("itNav", "itSections");

    const statusData = [
      { service: "Auth gateway", status: "ok", region: "eu-west-1", latency: "42 ms" },
      { service: "Metadata index", status: "ok", region: "eu-west-1", latency: "65 ms" },
      { service: "Full-text search", status: "warn", region: "eu-west-1", latency: "210 ms" },
      { service: "Object storage", status: "ok", region: "eu-central-1", latency: "58 ms" },
      { service: "Notification service", status: "warn", region: "eu-west-1", latency: "190 ms" },
      { service: "Reporting", status: "crit", region: "eu-west-1", latency: "–" }
    ];

    const statusTable = document.getElementById("itStatusTable");
    if (statusTable) {
      const tbody = statusTable.querySelector("tbody");
      const filterButtons = document.querySelectorAll("[data-status-filter]");

      function renderStatus(filter) {
        tbody.innerHTML = "";
        statusData
          .filter((row) => filter === "all" || row.status === filter)
          .forEach((row) => {
            const tr = document.createElement("tr");
            const dotClass =
              row.status === "ok" ? "status-ok" : row.status === "warn" ? "status-warn" : "status-crit";
            const label = row.status === "ok" ? "Healthy" : row.status === "warn" ? "Degraded" : "Issue";
            tr.innerHTML = `
              <td>${row.service}</td>
              <td><span class="status-dot ${dotClass}"></span>${label}</td>
              <td>${row.region}</td>
              <td>${row.latency}</td>
            `;
            tbody.appendChild(tr);
          });
      }

      let currentFilter = "all";
      renderStatus(currentFilter);

      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          currentFilter = btn.dataset.statusFilter || "all";
          renderStatus(currentFilter);
        });
      });
    }

    const integrationsData = [
      { system: "Campus SSO", type: "Identity", status: "Connected", last: "5 min ago" },
      { system: "Library catalog", type: "Metadata", status: "Connected", last: "12 min ago" },
      { system: "LMS", type: "Courses", status: "Connected", last: "27 min ago" },
      { system: "Analytics lake", type: "Exports", status: "Pending setup", last: "—" }
    ];
    const integrationsTable = document.getElementById("itIntegrationsTable");
    if (integrationsTable) {
      const tbody = integrationsTable.querySelector("tbody");
      integrationsData.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.system}</td>
          <td>${row.type}</td>
          <td>${row.status}</td>
          <td>${row.last}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    const logsData = [
      { user: "Student 284", role: "Reader", action: "Opened item: Climate Policy & Data", time: "12:04" },
      { user: "Prof. Jensen", role: "Publisher", action: "Uploaded draft: Quiet Interfaces", time: "11:51" },
      { user: "Librarian 07", role: "Admin", action: "Updated lending policy: Postgraduate", time: "11:32" },
      { user: "Student 102", role: "Reader", action: "Added item to reading list", time: "11:21" },
      { user: "System", role: "Service", action: "Completed backup window", time: "03:14" }
    ];
    const logList = document.getElementById("itLogList");
    const logSearch = document.getElementById("logSearch");
    if (logList && logSearch) {
      function renderLogs(query) {
        const q = (query || "").toLowerCase();
        logList.innerHTML = "";
        logsData
          .filter(
            (row) =>
              !q ||
              row.user.toLowerCase().includes(q) ||
              row.role.toLowerCase().includes(q) ||
              row.action.toLowerCase().includes(q)
          )
          .forEach((row) => {
            const li = document.createElement("li");
            li.className = "list-item";
            li.innerHTML = `
              <div class="list-item-main">
                <strong>${row.user}</strong> · <span class="muted">${row.role}</span><br>
                <span class="muted">${row.action}</span>
              </div>
              <div class="list-item-meta">
                <span>${row.time}</span>
              </div>
            `;
            logList.appendChild(li);
          });
      }

      renderLogs("");
      logSearch.addEventListener("input", () => renderLogs(logSearch.value));
    }
  }

  // Admin workspace
  function initAdmin() {
    setupSectionNav("adminNav", "adminSections");

    const collections = [
      { name: "Core undergraduate reading", items: 1820, access: "Local", lending: "Digital & print" },
      { name: "Postgraduate research theses", items: 460, access: "Local", lending: "Reading room only" },
      { name: "Climate policy shared archive", items: 220, access: "Shared", lending: "Digital only" },
      { name: "Open methods repository", items: 95, access: "Global", lending: "Open access" }
    ];

    const collectionSummary = document.getElementById("adminCollectionSummary");
    if (collectionSummary) {
      const total = collections.reduce((sum, c) => sum + c.items, 0);
      const shared = collections.filter((c) => c.access === "Shared").length;
      const global = collections.filter((c) => c.access === "Global").length;

      collectionSummary.innerHTML = `
        <li class="list-item">
          <div class="list-item-main">
            <strong>Total items</strong><br>
            <span class="muted">Across all digital collections</span>
          </div>
          <div class="list-item-meta">
            ${total.toLocaleString()}
          </div>
        </li>
        <li class="list-item">
          <div class="list-item-main">
            <strong>Shared collections</strong><br>
            <span class="muted">Visible to partner institutions</span>
          </div>
          <div class="list-item-meta">
            ${shared}
          </div>
        </li>
        <li class="list-item">
          <div class="list-item-main">
            <strong>Global collections</strong><br>
            <span class="muted">Openly discoverable in ICDLS</span>
          </div>
          <div class="list-item-meta">
            ${global}
          </div>
        </li>
      `;
    }

    const activitySummary = document.getElementById("adminActivitySummary");
    if (activitySummary) {
      activitySummary.innerHTML = `
        <li class="list-item">
          <div class="list-item-main">
            <strong>Today’s lending events</strong><br>
            <span class="muted">Illustrative figure, not live</span>
          </div>
          <div class="list-item-meta">138</div>
        </li>
        <li class="list-item">
          <div class="list-item-main">
            <strong>Active reading rooms</strong><br>
            <span class="muted">Scheduled access windows</span>
          </div>
          <div class="list-item-meta">7</div>
        </li>
        <li class="list-item">
          <div class="list-item-main">
            <strong>Pending policy changes</strong><br>
            <span class="muted">Awaiting committee review</span>
          </div>
          <div class="list-item-meta">3</div>
        </li>
      `;
    }

    const collectionsTable = document.getElementById("adminCollectionsTable");
    const collectionFilter = document.getElementById("collectionFilter");
    if (collectionsTable && collectionFilter) {
      const tbody = collectionsTable.querySelector("tbody");

      function renderCollections(scope) {
        tbody.innerHTML = "";
        collections
          .filter((c) => scope === "all" || c.access.toLowerCase() === scope)
          .forEach((c) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${c.name}</td>
              <td>${c.items}</td>
              <td>${c.access}</td>
              <td>${c.lending}</td>
            `;
            tbody.appendChild(tr);
          });
      }

      renderCollections("all");
      collectionFilter.addEventListener("change", () => renderCollections(collectionFilter.value));
    }

    const usersTable = document.getElementById("adminUsersTable");
    if (usersTable) {
      const tbody = usersTable.querySelector("tbody");
      const groups = [
        { name: "Undergraduate students", count: 8400, role: "Reader", notes: "Semester-based access" },
        { name: "Postgraduate researchers", count: 1250, role: "Reader & publisher", notes: "Extended holdings" },
        { name: "Faculty", count: 620, role: "Reader & publisher", notes: "Committee participation" },
        { name: "Librarians", count: 34, role: "Admin", notes: "Collection & policy management" }
      ];
      groups.forEach((g) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${g.name}</td>
          <td>${g.count}</td>
          <td>${g.role}</td>
          <td>${g.notes}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    const policiesList = document.getElementById("adminPoliciesList");
    if (policiesList) {
      const policies = [
        {
          name: "Undergraduate course texts",
          text: "Digital loans mirror physical holdings. One digital copy per physical copy, with short loan windows."
        },
        {
          name: "Postgraduate monographs",
          text: "Extended loan windows with automatic early-return on inactivity."
        },
        {
          name: "Open methods collection",
          text: "No lending limits. Materials are open access within ICDLS and beyond."
        }
      ];
      policiesList.innerHTML = "";
      policies.forEach((p) => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
          <div class="list-item-main">
            <strong>${p.name}</strong><br>
            <span class="muted">${p.text}</span>
          </div>
        `;
        policiesList.appendChild(li);
      });
    }
  }

  // Reader workspace
  function initReader() {
    setupSectionNav("readerNav", "readerSections");

    const resultsEl = document.getElementById("readerResults");
    const historyEl = document.getElementById("readerHistory");
    const listEl = document.getElementById("readerList");
    const search = document.getElementById("readerSearch");
    const discipline = document.getElementById("readerDiscipline");
    const selectedEmpty = document.getElementById("readerSelectedEmpty");
    const selectedPanel = document.getElementById("readerSelected");
    const selectedTitle = document.getElementById("readerSelectedTitle");
    const selectedMeta = document.getElementById("readerSelectedMeta");
    const selectedAbstract = document.getElementById("readerSelectedAbstract");
    const addToListBtn = document.getElementById("readerAddToListBtn");

    if (!resultsEl) return;

    const items = [
      {
        id: "1",
        title: "Designing Quiet Interfaces for Libraries",
        author: "M. Jensen",
        discipline: "library-science",
        year: 2025,
        abstract: "Explores how interface choices impact cognitive load in digital academic portals."
      },
      {
        id: "2",
        title: "Open Data in Climate Policy",
        author: "L. Okafor",
        discipline: "climate",
        year: 2024,
        abstract: "Case studies of cross-institutional data sharing for climate modelling."
      },
      {
        id: "3",
        title: "Methods in Digital Scholarship",
        author: "A. Singh",
        discipline: "education",
        year: 2023,
        abstract: "Introduces a framework for teaching digital research skills."
      },
      {
        id: "4",
        title: "Archiving Community Knowledge",
        author: "R. Silva",
        discipline: "library-science",
        year: 2023,
        abstract: "Discusses participatory archival practices in local communities."
      }
    ];

    let readingList = [
      { id: "2", added: "Today", note: "Course: Climate governance" },
      { id: "3", added: "Yesterday", note: "Seminar preparation" }
    ];

    const history = [
      { title: "Digital Preservation Fundamentals", when: "Today · 09:14" },
      { title: "Open Data in Climate Policy", when: "Yesterday · 21:03" },
      { title: "Designing Quiet Interfaces for Libraries", when: "Mon · 18:27" }
    ];

    function renderResults() {
      const q = (search?.value || "").toLowerCase();
      const d = discipline?.value || "all";

      resultsEl.innerHTML = "";
      items
        .filter(
          (i) =>
            (d === "all" || i.discipline === d) &&
            (!q ||
              i.title.toLowerCase().includes(q) ||
              i.author.toLowerCase().includes(q) ||
              i.abstract.toLowerCase().includes(q))
        )
        .forEach((i) => {
          const li = document.createElement("li");
          li.className = "list-item";
          li.dataset.itemId = i.id;
          li.innerHTML = `
            <div class="list-item-main">
              <strong>${i.title}</strong><br>
              <span class="muted">${i.author} · ${i.year}</span>
            </div>
            <div class="list-item-meta">
              <span class="pill">${i.discipline.replace("-", " ")}</span>
            </div>
          `;
          li.addEventListener("click", () => selectItem(i));
          resultsEl.appendChild(li);
        });
    }

    function renderHistory() {
      if (!historyEl) return;
      historyEl.innerHTML = "";
      history.forEach((h) => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
          <div class="list-item-main">
            <strong>${h.title}</strong>
          </div>
          <div class="list-item-meta">
            <span class="muted">${h.when}</span>
          </div>
        `;
        historyEl.appendChild(li);
      });
    }

    function renderReadingList() {
      if (!listEl) return;
      listEl.innerHTML = "";
      readingList.forEach((entry) => {
        const item = items.find((i) => i.id === entry.id);
        if (!item) return;
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
          <div class="list-item-main">
            <strong>${item.title}</strong><br>
            <span class="muted">${item.author}</span>
          </div>
          <div class="list-item-meta">
            <span>${entry.added}</span><br>
            <span class="muted">${entry.note}</span>
          </div>
        `;
        listEl.appendChild(li);
      });
    }

    let currentSelection = null;
    function selectItem(i) {
      currentSelection = i;
      if (!selectedPanel || !selectedEmpty || !selectedTitle || !selectedMeta || !selectedAbstract) return;
      selectedEmpty.hidden = true;
      selectedPanel.hidden = false;
      selectedTitle.textContent = i.title;
      selectedMeta.textContent = `${i.author} · ${i.year}`;
      selectedAbstract.textContent = i.abstract;
    }

    if (addToListBtn) {
      addToListBtn.addEventListener("click", () => {
        if (!currentSelection) return;
        if (!readingList.some((e) => e.id === currentSelection.id)) {
          readingList = [{ id: currentSelection.id, added: "Today", note: "Added from demo" }, ...readingList];
          renderReadingList();
        }
      });
    }

    const openBook = document.getElementById("openBook");
    const openPaper = document.getElementById("openPaper");
    const demoContent = document.getElementById("demoContent");
    const demoBook = document.getElementById("demoBook");
    const demoPaper = document.getElementById("demoPaper");

    if (openBook) {
      openBook.addEventListener("click", (e) => {
        e.preventDefault();
        demoContent.hidden = false;
        demoBook.hidden = false;
        demoPaper.hidden = true;
      });
    }

    if (openPaper) {
      openPaper.addEventListener("click", (e) => {
        e.preventDefault();
        demoContent.hidden = false;
        demoBook.hidden = true;
        demoPaper.hidden = false;
      });
    }

    renderResults();
    renderHistory();
    renderReadingList();

    if (search) search.addEventListener("input", renderResults);
    if (discipline) discipline.addEventListener("change", renderResults);
  }

  // Publisher workspace
  function initPublisher() {
    setupSectionNav("publisherNav", "publisherSections");

    const summaryEl = document.getElementById("publisherSummary");
    const recentEl = document.getElementById("publisherRecent");
    const table = document.getElementById("publisherManuscriptsTable");
    const form = document.getElementById("publisherForm");

    let manuscripts = [
      { title: "Quiet Interfaces in Academic Portals", status: "Under review", scope: "Shared", updated: "Today" },
      { title: "Archiving Community Knowledge", status: "Published", scope: "Global", updated: "Last week" },
      { title: "Reading Journeys in Digital Libraries", status: "Draft", scope: "Local", updated: "Yesterday" }
    ];

    function renderSummary() {
      if (!summaryEl) return;
      const draft = manuscripts.filter((m) => m.status === "Draft").length;
      const review = manuscripts.filter((m) => m.status === "Under review").length;
      const published = manuscripts.filter((m) => m.status === "Published").length;
      summaryEl.innerHTML = `
        <li class="list-item">
          <div class="list-item-main">
            <strong>Drafts</strong><br>
            <span class="muted">Works not yet submitted</span>
          </div>
          <div class="list-item-meta">${draft}</div>
        </li>
        <li class="list-item">
          <div class="list-item-main">
            <strong>Under review</strong><br>
            <span class="muted">Currently evaluated</span>
          </div>
          <div class="list-item-meta">${review}</div>
        </li>
        <li class="list-item">
          <div class="list-item-main">
            <strong>Published</strong><br>
            <span class="muted">Visible in ICDLS</span>
          </div>
          <div class="list-item-meta">${published}</div>
        </li>
      `;
    }

    function renderRecent() {
      if (!recentEl) return;
      recentEl.innerHTML = "";
      manuscripts.slice(0, 3).forEach((m) => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
          <div class="list-item-main">
            <strong>${m.title}</strong><br>
            <span class="muted">${m.status}</span>
          </div>
          <div class="list-item-meta">
            <span class="muted">${m.updated}</span><br>
            <span class="pill">${m.scope}</span>
          </div>
        `;
        recentEl.appendChild(li);
      });
    }

    function renderTable() {
      if (!table) return;
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";
      manuscripts.forEach((m) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.title}</td>
          <td>${m.status}</td>
          <td>${m.scope}</td>
          <td>${m.updated}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    renderSummary();
    renderRecent();
    renderTable();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("manuscriptTitle")?.value.trim();
        const scope = document.getElementById("manuscriptScope")?.value || "Local";
        if (!title) return;
        manuscripts = [{ title, status: "Draft", scope, updated: "Just now" }, ...manuscripts];
        renderSummary();
        renderRecent();
        renderTable();
        form.reset();
      });
    }
  }

  if (page === "it") initIT();
  if (page === "admin") initAdmin();
  if (page === "reader") initReader();
  if (page === "publisher") initPublisher();
})();

