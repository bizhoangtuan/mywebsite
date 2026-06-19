(function () {
  const C = typeof CONFIG !== 'undefined' ? CONFIG : (window.CONFIG || {});
  const profile = C.profile || {};
  const links = C.links || {};
  const rootPath = window.location.pathname.includes('/content/') ? '../../' : '';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function initMeta() {
    if (!C.meta) return;
    document.title = C.meta.title || document.title;
    const metaDesc = $('#meta-desc');
    const ogTitle = $('#og-title');
    const ogDesc = $('#og-desc');
    const ogImage = $('#og-image');
    const metaTitle = $('#meta-title');
    if (metaTitle) metaTitle.textContent = C.meta.title || '';
    if (metaDesc) metaDesc.setAttribute('content', C.meta.description || '');
    if (ogTitle) ogTitle.setAttribute('content', C.meta.title || '');
    if (ogDesc) ogDesc.setAttribute('content', C.meta.description || '');
    if (ogImage && C.meta.ogImage) ogImage.setAttribute('content', C.meta.ogImage);
  }

  function initProfile() {
    const navLogo = $('#nav-logo');
    if (navLogo && profile.firstName) navLogo.textContent = `${profile.firstName} ${profile.lastName || ''}`.trim();

    const eyebrow = $('#hero-eyebrow');
    if (eyebrow && profile.eyebrow) eyebrow.textContent = profile.eyebrow;

    const role = $('#hero-role');
    if (role && profile.role) role.textContent = `${profile.role} · ${profile.company || ''}`.trim();

    const bio = $('#hero-bio');
    if (bio && profile.bio) bio.innerHTML = profile.bio;

    const sloganRow = $('#slogan-row');
    if (sloganRow && Array.isArray(profile.pillars)) {
      const pillars = profile.pillars.map((pillar) => `<span class="pill">${escapeHtml(pillar)}</span>`).join('');
      sloganRow.innerHTML = `<div class="marquee-track">${pillars}${pillars}</div>`;
    }

    $$('[data-link="facebook"]').forEach((node) => node.href = links.facebook || '#');
    $$('[data-link="linkedin"]').forEach((node) => node.href = links.linkedin || '#');
  }

  function initStats() {
    const grid = $('#stats-grid');
    if (!grid || !Array.isArray(C.stats)) return;
    grid.innerHTML = C.stats.map((item) => `
      <div class="stat">
        <div class="stat-num">${escapeHtml(item.number)}</div>
        <div class="stat-label">${escapeHtml(item.label)}</div>
      </div>
    `).join('');
  }

  async function loadJson(url, fallback = []) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Cannot load ${url}`);
      const data = await response.json();
      return Array.isArray(data) ? data.filter((item) => item.status !== 'draft') : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function iconLabel(item, fallback = 'N') {
    if (item.category) {
      const parts = item.category.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
      return item.category.slice(0, 3).toUpperCase();
    }
    return fallback;
  }

  function articleCard(item, type = 'article') {
    const url = item.url || `content/${item.slug}.html`;
    const label = type === 'framework' ? 'FW' : iconLabel(item, 'BL');
    return `
      <a class="card article-card" href="${escapeHtml(url)}" data-content-type="${escapeHtml(type)}">
        <div class="article-icon">${escapeHtml(label)}</div>
        <div>
          <div class="article-meta">${escapeHtml(item.category)} · ${escapeHtml(item.readTime || '')}</div>
          <div class="article-title">${escapeHtml(item.title)}</div>
          ${item.excerpt ? `<div class="article-excerpt">${escapeHtml(item.excerpt)}</div>` : ''}
        </div>
        <div class="arrow">→</div>
      </a>
    `;
  }

  function serviceCard(item, compact = false) {
    const topic = item.formTopic || item.name;
    const consultHref = `https://zalo.me/0919073456`;
    const isServicesPage = document.body.dataset.page === 'services';
    const formHref = isServicesPage ? '#contact' : `services.html?service=${encodeURIComponent(topic)}#contact`;
    return `
      <article class="card service-card" id="${escapeHtml(item.slug)}">
        <div class="service-category">${escapeHtml(item.category)}</div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(compact ? item.summary : item.pain)}</p>
        ${!compact ? `<p><strong>Kết quả mong muốn:</strong> ${escapeHtml(item.outcome)}</p>` : ''}
        <div class="tag-row">
          ${(item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="service-actions">
          <a class="btn btn-primary" href="${escapeHtml(consultHref)}" target="_blank" rel="noopener">Trao đổi qua Zalo</a>
          <a class="btn btn-secondary" href="${escapeHtml(formHref)}" data-service-form="${escapeHtml(topic)}">Gửi bài toán</a>
        </div>
      </article>
    `;
  }

  function renderList(container, items, renderer, emptyText) {
    if (!container) return;
    container.innerHTML = items.length ? items.map(renderer).join('') : `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  function initTabs() {
    const tabs = $('[data-content-tabs]');
    if (!tabs) return;
    tabs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      const filter = button.dataset.filter;
      $$('[data-filter]', tabs).forEach((tab) => tab.classList.toggle('is-active', tab === button));
      $$('[data-content-type]').forEach((card) => {
        card.style.display = filter === 'all' || card.dataset.contentType === filter ? '' : 'none';
      });
    });
  }

  function populateServiceSelect(services) {
    $$('[data-service-select]').forEach((select) => {
      const current = select.value;
      const first = select.querySelector('option[value=""]')?.outerHTML || '<option value="" disabled selected>Bài toán muốn trao đổi *</option>';
      select.innerHTML = first + services.map((service) => `
        <option value="${escapeHtml(service.formTopic || service.name)}">${escapeHtml(service.name)}</option>
      `).join('');
      if (current) select.value = current;
      const requestedService = new URLSearchParams(window.location.search).get('service');
      if (requestedService) select.value = requestedService;
    });
  }

  function scrollToContact() {
    const contact = $('#contact');
    if (!contact) return;
    const top = contact.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  function applyRequestedService() {
    const requestedService = new URLSearchParams(window.location.search).get('service');
    if (requestedService) {
      const select = $('[data-service-select]');
      if (select) select.value = requestedService;
    }
    if (window.location.hash === '#contact') {
      window.setTimeout(scrollToContact, 80);
    }
  }

  function initServiceCtas() {
    document.addEventListener('click', (event) => {
      const cta = event.target.closest('[data-service-form]');
      if (!cta) return;
      if (document.body.dataset.page !== 'services') return;
      const topic = cta.dataset.serviceForm;
      const select = $('[data-service-select]');
      if (!select) return;
      event.preventDefault();
      if (topic) select.value = topic;
      const url = new URL(window.location.href);
      url.searchParams.set('service', topic || '');
      url.hash = 'contact';
      window.history.pushState({}, '', url);
      scrollToContact();
    });
  }

  function initForms() {
    $$('[data-lead-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const payload = {};
        new FormData(form).forEach((value, key) => { payload[key] = value; });
        payload.page = document.body.dataset.page || 'website';
        payload.submittedAt = new Date().toISOString();

        if (C.form?.webhookUrl) {
          fetch(C.form.webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }

        const success = $('[data-form-success]', form);
        if (success) success.style.display = 'block';
        form.reset();
      });
    });
  }

  async function initContent() {
    const [articles, frameworks, services] = await Promise.all([
      loadJson(`${rootPath}data/articles.json`),
      loadJson(`${rootPath}data/frameworks.json`),
      loadJson(`${rootPath}data/services.json`)
    ]);

    renderList($('[data-articles-list]'), articles, (item) => articleCard(item, 'article'), 'Chưa có bài Góc nhìn quản trị.');
    renderList($('[data-frameworks-list]'), frameworks, (item) => articleCard(item, 'framework'), 'Chưa có bài Framework kinh doanh.');
    renderList($('[data-services-list]'), services, (item) => serviceCard(item), 'Chưa có hướng đồng hành nào.');
    renderList($('[data-services-preview]'), services.slice(0, 3), (item) => serviceCard(item, true), 'Chưa có hướng đồng hành nào.');

    const latest = [...articles.map((item) => ({ ...item, type: 'article' })), ...frameworks.map((item) => ({ ...item, type: 'framework' }))]
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .slice(0, 4);
    renderList($('[data-latest-content]'), latest, (item) => articleCard(item, item.type), 'Chưa có nội dung nào.');

    populateServiceSelect(services);
    applyRequestedService();
  }

  initMeta();
  initProfile();
  initStats();
  initForms();
  initTabs();
  initServiceCtas();
  initContent();
})();
