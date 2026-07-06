/* ============================================================
   个人网站 — 主要交互逻辑（极简版）
   移除：打字机效果
   保留：导航、滚动动画、返回顶部、博客加载
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initActiveNavLink();
});

/* ===== 导航栏 ===== */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ===== 滚动渐显 ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => obs.observe(el));
}

/* ===== 返回顶部 ===== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== 高亮当前页导航 ===== */
function initActiveNavLink() {
  const page  = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

/* ===== 博客文章加载（blog.html + index.html 调用） ===== */

// 标签 → 主题色映射（用于自动生成头图色）
const TAG_COLORS = {
  'Agent':       { c: 'var(--c-blue)',   c2: 'var(--c-violet)', icon: '🤖' },
  'VLM':         { c: 'var(--c-cyan)',   c2: 'var(--c-blue)',   icon: '👁️' },
  'RAG':         { c: 'var(--c-emerald)',c2: 'var(--c-cyan)',   icon: '📚' },
  'LLM':         { c: 'var(--c-violet)', c2: 'var(--c-blue)',   icon: '🧠' },
  'Claude Code': { c: 'var(--c-amber)',  c2: 'var(--c-rose)',   icon: '✨' },
  '架构':        { c: 'var(--c-rose)',   c2: 'var(--c-violet)', icon: '🏗️' },
  '可视化':      { c: 'var(--c-amber)',  c2: 'var(--c-violet)', icon: '📊' },
  '思考':        { c: 'var(--c-slate)',  c2: 'var(--c-violet)', icon: '💭' },
  '随笔':        { c: 'var(--c-slate)',  c2: 'var(--c-violet)', icon: '✍️' },
  '起点':        { c: 'var(--c-emerald)',c2: 'var(--c-blue)',   icon: '🌱' },
};

// color 字段名 → CSS 变量
const COLOR_NAME_MAP = {
  blue:    { c: 'var(--c-blue)',    c2: 'var(--c-cyan)' },
  violet:  { c: 'var(--c-violet)',  c2: 'var(--c-blue)' },
  emerald: { c: 'var(--c-emerald)', c2: 'var(--c-cyan)' },
  amber:   { c: 'var(--c-amber)',   c2: 'var(--c-rose)' },
  rose:    { c: 'var(--c-rose)',    c2: 'var(--c-violet)' },
  cyan:    { c: 'var(--c-cyan)',    c2: 'var(--c-blue)' },
};

// 根据文章数据推断头图色与图标
function resolveCover(post) {
  // 优先用显式声明的 color/icon
  let colors = null, icon = post.icon || '';
  if (post.color && COLOR_NAME_MAP[post.color]) {
    colors = COLOR_NAME_MAP[post.color];
  }
  // 否则按首个匹配标签自动选色
  if (!colors) {
    for (const tag of (post.tags || [])) {
      if (TAG_COLORS[tag]) { colors = TAG_COLORS[tag]; if (!icon) icon = TAG_COLORS[tag].icon; break; }
    }
  }
  // 兜底
  if (!colors) colors = { c: 'var(--c-violet)', c2: 'var(--c-blue)' };
  if (!icon) icon = '📝';
  return { ...colors, icon };
}

async function loadBlogPosts(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 判断当前页是否在 blog/ 子目录
  const isSubdir = window.location.pathname.includes('/blog/');
  const jsonPath = isSubdir ? '../blog/posts.json' : 'blog/posts.json';

  try {
    const res   = await fetch(jsonPath);
    if (!res.ok) throw new Error('fetch failed');
    const posts = await res.json();
    const list  = limit ? posts.slice(0, limit) : posts;

    if (!list.length) {
      container.innerHTML = emptyState('暂无文章', '第一篇文章正在酝酿中，敬请期待…');
      return;
    }

    container.innerHTML = list.map((post, i) => {
      const cover = resolveCover(post);
      return `
      <a href="${post.url}" class="card card-blog reveal reveal-delay-${(i % 4) + 1}"
         data-tags="${(post.tags || []).join(',').toLowerCase()}"
         style="--card-color: ${cover.c}; --card-color-2: ${cover.c2};">
        <div class="card-cover">
          <div class="post-date">${post.date} · ⏱ ${post.readTime || '5 min'}</div>
          <span class="card-cover-icon">${cover.icon}</span>
        </div>
        <h3>${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="tags-group">
          ${(post.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </a>
    `;}).join('');

    initScrollReveal();
  } catch {
    container.innerHTML = emptyState('暂无文章', '第一篇文章正在酝酿中，敬请期待…');
  }
}

function emptyState(title, desc) {
  return `<div class="empty-state col-span-2">
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
}

/* ===== 博客标签过滤 ===== */
function initBlogFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  if (!buttons.length) return;
  const grid = document.getElementById('blog-posts');
  if (!grid) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tag = (btn.dataset.tag || 'all').toLowerCase();
      const cards = grid.querySelectorAll('.card-blog');
      cards.forEach(card => {
        if (tag === 'all') {
          card.style.display = '';
        } else {
          const cardTags = (card.dataset.tags || '').split(',');
          card.style.display = cardTags.includes(tag) ? '' : 'none';
        }
      });

      // 过滤后若全部隐藏，显示空提示
      const visible = Array.from(cards).filter(c => c.style.display !== 'none');
      let empty = grid.querySelector('.filter-empty');
      if (!visible.length) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'empty-state filter-empty';
          empty.style.gridColumn = '1 / -1';
          empty.innerHTML = '<h3>暂无该标签的文章</h3><p>换个标签看看？</p>';
          grid.appendChild(empty);
        }
        empty.style.display = '';
      } else if (empty) {
        empty.style.display = 'none';
      }
    });
  });
}
