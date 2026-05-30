// Khởi tạo các hàm cơ bản render từ config
(function(){
  var C = CONFIG, P = C.profile;

  // Meta
  document.title = C.meta.title;
  document.getElementById('meta-title').textContent = C.meta.title;
  document.getElementById('meta-desc').setAttribute('content', C.meta.description);
  document.getElementById('og-title').setAttribute('content', C.meta.title);
  document.getElementById('og-desc').setAttribute('content', C.meta.description);
  if (C.meta.ogImage) document.getElementById('og-image').setAttribute('content', C.meta.ogImage);

  // Nav
  document.getElementById('nav-logo').textContent = P.firstName + ' ' + P.lastName;
  var navSite = document.getElementById('nav-website');
  if (navSite) navSite.href = C.links.website;

  // Hero
  document.getElementById('hero-eyebrow').textContent = P.eyebrow;
  document.getElementById('hero-firstname').textContent = P.firstName;
  document.getElementById('hero-lastname').textContent = P.lastName;
  document.getElementById('hero-role').textContent = P.role + ' · ' + P.company;
  document.getElementById('hero-bio').innerHTML = P.bio;

  var sloganRow = document.getElementById('slogan-row');
  if (sloganRow) P.pillars.forEach(function(p) {
    var s = document.createElement('span');
    s.className = 'slogan-pill';
    s.textContent = p;
    sloganRow.appendChild(s);
  });

  var fbBtn = document.getElementById('btn-facebook');
  if (fbBtn) fbBtn.href = C.links.facebook;
  var liBtn = document.getElementById('btn-linkedin');
  if (liBtn) liBtn.href = C.links.linkedin;

  // Stats
  var statsGrid = document.getElementById('stats-grid');
  if (statsGrid) C.stats.forEach(function(s) {
    var d = document.createElement('div');
    d.className = 'stat-item';
    d.innerHTML = '<div class="stat-num">' + s.number + '</div><div class="stat-label">' + s.label + '</div>';
    statsGrid.appendChild(d);
  });

  // Service options
  var svcSel = document.getElementById('service-select');
  if (svcSel) C.services.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s.name;
    o.textContent = s.name;
    svcSel.appendChild(o);
  });

  // Form submit handler
  window.handleSubmit = function(e) {
    e.preventDefault();
    var form = e.target;
    var payload = {};
    new FormData(form).forEach(function(v, k) { payload[k] = v; });
    fetch(C.form.webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function() {});
    form.style.display = 'none';
    var ok = document.getElementById('form-success');
    if (ok) ok.style.display = 'block';
  };
})();

// Fetch API bài viết JSON
fetch('posts.json')
  .then(res => res.json())
  .then(posts => {
    const iconMap = {
      'Vận hành': '⚙️',
      'Tư duy quản lý': '🧩',
      'TMĐT': '📊',
      'AI & Automation': '🤖',
    };

    const rows = posts.map(post => {
      const icon = iconMap[post.category] || '📝';
      return `
        <a href="content/${post.slug}.html" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:var(--bg2);border-bottom:1px solid var(--border);text-decoration:none;transition:background .2s;"
           onmouseenter="this.style.background='var(--bg3)'"
           onmouseleave="this.style.background='var(--bg2)'">
          <div style="flex-shrink:0;width:38px;height:38px;border-radius:8px;background:rgba(200,164,90,0.1);border:1px solid rgba(200,164,90,0.2);display:flex;align-items:center;justify-content:center;font-size:17px;margin-top:1px;">
            ${icon}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:4px;">
              ${post.category} · ${post.readTime}
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--cream);line-height:1.4;">
              ${post.title}
            </div>
          </div>
          <div style="flex-shrink:0;color:var(--text3);font-size:16px;margin-top:8px;">→</div>
        </a>
      `;
    }).join('');

    document.getElementById('blog-container').innerHTML = `
      <div style="border:1px solid var(--border);border-radius:14px;overflow:hidden;">
        ${rows}
      </div>
    `;
  })
  .catch(() => {
    document.getElementById('blog-container').innerHTML =
      '<p style="color:var(--text2);font-size:13px;">Chưa có bài viết nào.</p>';
  });