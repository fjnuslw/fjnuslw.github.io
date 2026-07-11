/* ============================================================
   个人网站 · 共享交互
   导航、渐进增强、返回顶部、博客加载与筛选
   ============================================================ */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initActiveNavLink();
});

/* ===== 导航栏 ===== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!navbar || !toggle || !menu) return;

  if (!menu.id) menu.id = 'primary-navigation';
  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '打开菜单');

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

  function isOpen() {
    return menu.classList.contains('active');
  }

  function updateMenuA11y(open) {
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
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '关闭菜单');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.classList.add('menu-open');
    updateMenuA11y(true);
    requestAnimationFrame(() => closeButton.focus());
  }

  function closeMenu(returnFocus = true) {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    updateMenuA11y(false);

    window.setTimeout(() => {
      if (!isOpen()) overlay.hidden = true;
    }, 200);

    if (returnFocus && lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  }

  toggle.addEventListener('click', () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  closeButton.addEventListener('click', () => closeMenu());
  overlay.addEventListener('click', () => closeMenu());

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => closeMenu(false));
  });

  document.addEventListener('keydown', event => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'))
      .filter(element => !element.hidden && element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function syncMenuMode() {
    if (!mobileQuery.matches) {
      closeMenu(false);
      overlay.hidden = true;
    } else {
      updateMenuA11y(isOpen());
    }
  }

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncMenuMode);
  } else {
    mobileQuery.addListener(syncMenuMode);
  }
  syncMenuMode();
}

/* ===== 滚动渐显：无 JS 时内容默认可见 ===== */
function initScrollReveal(root = document) {
  const reveals = root.querySelectorAll('.reveal:not([data-reveal-ready])');
  if (!reveals.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(element => {
      element.dataset.revealReady = 'true';
      element.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  reveals.forEach(element => {
    element.dataset.revealReady = 'true';
    observer.observe(element);
  });
}

/* ===== 返回顶部 ===== */
function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle('visible', window.scrollY > 480);
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
  button.addEventListener('click', () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  });
}

/* ===== 高亮当前页导航 ===== */
function initActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

/* ===== 博客文章加载（blog.html + index.html）===== */

const TAG_COLORS = {
  'Agent':       { c: 'var(--c-blue)', c2: 'var(--c-violet)', icon: 'AI' },
  'VLM':         { c: 'var(--c-cyan)', c2: 'var(--c-blue)', icon: 'VLM' },
  'RAG':         { c: 'var(--c-emerald)', c2: 'var(--c-cyan)', icon: 'RAG' },
  'LLM':         { c: 'var(--c-violet)', c2: 'var(--c-blue)', icon: 'LLM' },
  'Claude Code': { c: 'var(--c-amber)', c2: 'var(--c-rose)', icon: 'CC' },
  '架构':        { c: 'var(--c-rose)', c2: 'var(--c-violet)', icon: 'SYS' },
  '可视化':      { c: 'var(--c-amber)', c2: 'var(--c-violet)', icon: 'VIS' },
  '思考':        { c: 'var(--c-slate)', c2: 'var(--c-violet)', icon: 'IDEA' },
  '随笔':        { c: 'var(--c-slate)', c2: 'var(--c-violet)', icon: 'NOTE' },
  '起点':        { c: 'var(--c-emerald)', c2: 'var(--c-blue)', icon: 'START' },
};

const COLOR_NAME_MAP = {
  blue:    { c: 'var(--c-blue)', c2: 'var(--c-cyan)' },
  violet:  { c: 'var(--c-violet)', c2: 'var(--c-blue)' },
  emerald: { c: 'var(--c-emerald)', c2: 'var(--c-cyan)' },
  amber:   { c: 'var(--c-amber)', c2: 'var(--c-rose)' },
  rose:    { c: 'var(--c-rose)', c2: 'var(--c-violet)' },
  cyan:    { c: 'var(--c-cyan)', c2: 'var(--c-blue)' },
};

function resolveCover(post) {
  let colors = null;
  let icon = post.icon || '';

  if (post.color && COLOR_NAME_MAP[post.color]) {
    colors = COLOR_NAME_MAP[post.color];
  }

  if (!colors) {
    for (const tag of (post.tags || [])) {
      if (!TAG_COLORS[tag]) continue;
      colors = TAG_COLORS[tag];
      if (!icon) icon = TAG_COLORS[tag].icon;
      break;
    }
  }

  if (!colors) colors = { c: 'var(--c-violet)', c2: 'var(--c-blue)' };
  if (!icon) icon = 'POST';
  return { ...colors, icon };
}

async function loadBlogPosts(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isSubdir = window.location.pathname.includes('/blog/');
  const jsonPath = isSubdir ? '../blog/posts.json' : 'blog/posts.json';
  const compact = container.dataset.variant === 'compact';

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error('fetch failed');
    const posts = await response.json();
    const list = limit ? posts.slice(0, limit) : posts;

    if (!list.length) {
      container.innerHTML = emptyState('暂无文章', '第一篇文章正在准备中，敬请期待。');
      return;
    }

    if (compact) {
      container.innerHTML = list.map((post, index) => `
        <a href="${post.url}" class="home-post-item reveal reveal-delay-${index + 1}">
          <span class="home-post-meta">
            <time datetime="${post.date}">${post.date}</time>
            <span>· ${post.readTime || '5 min'}</span>
          </span>
          <span class="home-post-body">
            <strong>${post.title}</strong>
            <span class="home-post-excerpt">${post.excerpt}</span>
            <span class="home-post-tags">
              ${(post.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </span>
          </span>
          <span class="home-post-arrow" aria-hidden="true">→</span>
        </a>
      `).join('');
    } else {
      container.innerHTML = list.map((post, index) => {
        const cover = resolveCover(post);
        return `
          <a href="${post.url}" class="card card-blog reveal reveal-delay-${(index % 4) + 1}"
             data-tags="${(post.tags || []).join(',').toLowerCase()}"
             style="--card-color: ${cover.c}; --card-color-2: ${cover.c2};">
            <div class="card-cover">
              <div class="post-date">${post.date} · ${post.readTime || '5 min'}</div>
              <span class="card-cover-icon">${cover.icon}</span>
            </div>
            <h3>${post.title}</h3>
            <p class="card-excerpt">${post.excerpt}</p>
            <div class="tags-group">
              ${(post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </a>
        `;
      }).join('');
    }

    initScrollReveal(container);
  } catch {
    container.innerHTML = emptyState('文章暂未加载', '可以进入博客页查看全部内容。');
  }
}

function emptyState(title, description) {
  return `<div class="empty-state"><h3>${title}</h3><p>${description}</p></div>`;
}

/* ===== 博客标签筛选 ===== */
function initBlogFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('blog-posts');
  if (!buttons.length || !grid) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      const tag = (button.dataset.tag || 'all').toLowerCase();
      const cards = grid.querySelectorAll('.card-blog');
      cards.forEach(card => {
        const cardTags = (card.dataset.tags || '').split(',');
        card.style.display = tag === 'all' || cardTags.includes(tag) ? '' : 'none';
      });

      const visible = Array.from(cards).filter(card => card.style.display !== 'none');
      let empty = grid.querySelector('.filter-empty');

      if (!visible.length) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'empty-state filter-empty';
          empty.style.gridColumn = '1 / -1';
          empty.innerHTML = '<h3>暂无该标签的文章</h3><p>换个标签看看。</p>';
          grid.appendChild(empty);
        }
        empty.style.display = '';
      } else if (empty) {
        empty.style.display = 'none';
      }
    });
  });
}
