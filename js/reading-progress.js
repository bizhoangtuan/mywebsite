(function () {
  const article = document.querySelector('article');
  if (!article) return;

  const style = document.createElement('style');
  style.textContent =
    '.read-progress{position:fixed;top:0;left:0;height:3px;width:100%;z-index:100;background:transparent;pointer-events:none}' +
    '.read-progress i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f4b7bd,#e65f35);border-radius:0 3px 3px 0;transition:width .1s linear}';
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);
  const fill = bar.firstChild;

  function update() {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), total);
    fill.style.width = (total > 0 ? (done / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
