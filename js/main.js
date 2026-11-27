/* PC-98 十六色固定视窗 · 共享渐进增强交互（无 JS 完整可读可用） */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHomeStickyNavbar();
  initRailScrollSpy();
  initBlogFilter();
  initLocalClock();
  initActiveNavLink();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!navbar || !toggle || !menu) return;

  if (!menu.id) menu.id = 'primary-navigation';
  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');

  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-label', '关闭菜单');
    overlay.hidden = true;
    document.body.appendChild(overlay);
  }

  let closeButton = menu.querySelector('.nav-close');
  if (!closeButton) {
    const closeItem = document.createElement('li');
    closeItem.className = 'nav-menu-close';
    closeItem.innerHTML = '<button class="nav-close" type="button" aria-label="关闭菜单"><span aria-hidden="true">×</span></button>';
    menu.prepend(closeItem);
    closeButton = closeItem.querySelector('.nav-close');
  }

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  let lastFocused = null;
  const isOpen = () => menu.classList.contains('active');

  function syncA11y(open) {
    if (mobileQuery.matches) {
      menu.setAttribute('aria-hidden', String(!open));
      if ('inert' in menu) menu.inert = !open;
    } else {
      menu.removeAttribute('aria-hidden');
      if ('inert' in menu) menu.inert = false;
    }
  }

  function openMenu() {
    if (!mobileQuery.matches) return;
    lastFocused = document.activeElement;
    menu.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '关闭菜单');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('active'));
    syncA11y(true);
    requestAnimationFrame(() => { if (isOpen()) closeButton.focus({ preventScroll: true }); });
  }

  function closeMenu(returnFocus = true) {
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
    overlay.classList.remove('active');
    syncA11y(false);
    window.setTimeout(() => { if (!isOpen()) overlay.hidden = true; }, 190);
    if (returnFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  toggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));
  closeButton.addEventListener('click', () => closeMenu());
  overlay.addEventListener('click', () => closeMenu());
  menu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && isOpen()) closeMenu(); });
  mobileQuery.addEventListener('change', () => { if (!mobileQuery.matches && isOpen()) closeMenu(false); else syncA11y(isOpen()); });
  syncA11y(false);
}

function initHomeStickyNavbar() {
  if (!document.body.classList.contains('home-page')) return;
  const stage = document.querySelector('.pc98-stage');
  if (!stage || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (!entry) return;
    document.body.classList.toggle('is-scrolled', !entry.isIntersecting && window.scrollY > 120);
  }, { threshold: 0.05 });

  observer.observe(stage);
}

function initRailScrollSpy() {
  const links = [...document.querySelectorAll('[data-rail-link]')];
  if (!links.length || !('IntersectionObserver' in window)) return;

  const ids = [...new Set(links.map(link => link.dataset.railLink))];
  const sections = ids
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(item => item.el);

  const setCurrent = activeId => {
    links.forEach(link => {
      const active = link.dataset.railLink === activeId;
      link.classList.toggle('is-active', active);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) setCurrent(visible[0].target.id);
  }, { rootMargin: '-18% 0px -55% 0px', threshold: [0.1, 0.35] });

  sections.forEach(({ el }) => observer.observe(el));
}

function initBlogFilter() {
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.writing-entry[data-tags]')];
  if (!buttons.length || !cards.length) return;

  const status = document.getElementById('blog-filter-status');

  function applyFilter(tag) {
    const wanted = tag.toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').toLowerCase().split(',').map(s => s.trim());
      const match = wanted === 'all' || tags.includes(wanted);
      card.hidden = !match;
      if (match) shown += 1;
    });
    buttons.forEach(btn => {
      const active = (btn.dataset.tag || '').toLowerCase() === wanted;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    if (status) {
      status.textContent = wanted === 'all' ? `显示全部 ${shown} 篇笔记` : `主题「${tag}」：${shown} 篇笔记`;
    }
  }

  buttons.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => applyFilter(btn.dataset.tag || 'all'));
  });
}

function initLocalClock() {
  const nodes = [...document.querySelectorAll('[data-clock]')];
  if (!nodes.length) return;
  const fmt = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
  const render = () => {
    const text = `UTC+8 ${fmt.format(new Date())}`;
    nodes.forEach(node => { node.textContent = text; });
  };
  render();
  window.setInterval(render, 60000);
}

function initActiveNavLink() {
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    const rawHref = link.getAttribute('href') || '';
    if (rawHref.startsWith('#')) return;
    const target = new URL(rawHref, window.location.href).pathname.replace(/\/index\.html$/, '/');
    const isMatch = path === target || (target.endsWith('/blog.html') && path.includes('/blog/')) || (target.endsWith('/projects.html') && path.includes('/projects/'));
    link.classList.toggle('active', isMatch);
    if (isMatch) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
