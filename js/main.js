/* ============================================================
   FJNUSLW Personal Website — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initTypewriter();
  initBackToTop();
  initActiveNavLink();
});

/* ===== Navbar ===== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ===== Scroll Reveal Animation ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ===== Typewriter Effect ===== */
function initTypewriter() {
  const el = document.querySelector('.hero-typed');
  if (!el) return;

  const texts = [
    'LLM 应用开发',
    'RAG 系统搭建',
    'Agent 架构设计',
    'AI 工具探索者',
    'Prompt Engineering'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 120;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 500; // Pause before next word
    }

    setTimeout(type, delay);
  }

  type();
}

/* ===== Back to Top Button ===== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Active Nav Link ===== */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ===== Blog Posts Loader ===== */
async function loadBlogPosts(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch('blog/posts.json');
    if (!response.ok) throw new Error('Failed to load posts');
    const posts = await response.json();

    const displayPosts = limit ? posts.slice(0, limit) : posts;

    if (displayPosts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>暂无文章</h3>
          <p>第一篇文章正在酝酿中，敬请期待...</p>
        </div>
      `;
      return;
    }

    container.innerHTML = displayPosts.map((post, i) => `
      <a href="${post.url}" class="card card-blog reveal reveal-delay-${i % 4 + 1}">
        <div class="card-meta">
          <span>${post.date}</span>
          <span>·</span>
          <span>${post.readTime || '5 min'}</span>
        </div>
        <h3>${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="tags-group" style="margin-top: var(--space-3)">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </a>
    `).join('');

    // Re-init scroll reveal for new elements
    initScrollReveal();
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无文章</h3>
        <p>第一篇文章正在酝酿中，敬请期待...</p>
      </div>
    `;
  }
}

/* ===== Blog Filter ===== */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Future: implement tag filtering
    });
  });
}
