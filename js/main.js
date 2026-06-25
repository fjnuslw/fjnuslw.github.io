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

    container.innerHTML = list.map((post, i) => `
      <a href="${post.url}" class="card card-blog reveal reveal-delay-${(i % 4) + 1}">
        <div class="post-date">${post.date} · ${post.readTime || '5 min read'}</div>
        <h3>${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="tags-group" style="margin-top:0.75rem">
          ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </a>
    `).join('');

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
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // 预留：按 data-tag 过滤
    });
  });
}
