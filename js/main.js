/* ============================================================
   个人网站 · 共享交互（纸墨系统，契约：specs/2026-09-ink）
   导航 / 信号地形 / 文字解码 / 项目展台 / 导览 / 筛选 / 进度
   所有动态效果均为渐进增强：无 JS 或减少动态时内容完整可用。
   ============================================================ */

const siteBase = new URL('../', document.currentScript.src);
document.documentElement.classList.add('js');

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
function prefersReducedMotion() { return reduceMotionQuery.matches; }

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initTerrainField();
  initHeroDecode();
  initLinkScramble();
  initDynamicLab();
  initMagneticButtons();
  initCursorPreview();
  initCounters();
  initLocalClock();
  initSiteGuide();
  initBlogFilter();
  initActiveNavLink();
});

/* ===== 导航栏（键盘与焦点管理沿用已验证实现） ===== */
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
    menu.dataset.interacted = 'true';
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

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
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

/* ===== 信号地形：首页 hero 的装饰点阵，指针扰动 + 点击涟漪 =====
   纯装饰画布。离屏、后台、减少动态或全局暂停时停帧。 */
function initTerrainField() {
  const canvas = document.querySelector('.terrain-field');
  if (!canvas) return;
  if (prefersReducedMotion()) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const region = canvas.parentElement;
  const glyphs = '{};<>/*·+='.split('');
  const motes = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * 9e-6, vy: (Math.random() - .5) * 9e-6,
    r: 1 + Math.random() * 1.3,
    glyph: Math.random() < .3 ? glyphs[i % glyphs.length] : null
  }));

  let width = 1, height = 1, frame = 0, lastTime = 0, elapsed = 0, visible = true;
  let pointer = null;
  let lattice = [];
  let ripples = [];

  function resize() {
    const rect = region.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    lattice = [];
    const spacing = 26;
    for (let y = spacing; y < height; y += spacing) {
      for (let x = spacing; x < width; x += spacing) lattice.push({ x, y });
    }
    draw(0);
  }

  function nearest(point, count, maxDistance) {
    const scored = [];
    for (const dot of lattice) {
      const distance = Math.hypot(dot.x - point.x, dot.y - point.y);
      if (distance < maxDistance) scored.push({ dot, distance });
    }
    scored.sort((a, b) => a.distance - b.distance);
    return scored.slice(0, count);
  }

  function draw(delta) {
    elapsed += delta;
    context.clearRect(0, 0, width, height);

    /* 点阵：靠近指针处位移并转为朱砂色 */
    for (const dot of lattice) {
      let x = dot.x, y = dot.y, alpha = .1, hot = false;
      if (pointer) {
        const dx = x - pointer.x, dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 150) {
          const force = 1 - distance / 150;
          x += (distance ? dx / distance : 0) * force * 11;
          y += (distance ? dy / distance : 0) * force * 11;
          alpha = .1 + force * .45;
          hot = force > .3;
        }
      }
      context.fillStyle = hot ? `rgba(168,53,23,${alpha})` : `rgba(29,26,21,${alpha + .03})`;
      context.fillRect(x - 1, y - 1, 2, 2);
    }

    /* 指针到最近点阵的细线 */
    if (pointer) {
      context.lineWidth = 1;
      context.strokeStyle = 'rgba(168,53,23,.3)';
      for (const { dot } of nearest(pointer, 3, 110)) {
        context.beginPath();
        context.moveTo(pointer.x, pointer.y);
        context.lineTo(dot.x, dot.y);
        context.stroke();
      }
    }

    /* 漂浮墨点与码点 */
    for (const mote of motes) {
      mote.x = (mote.x + mote.vx * delta + 1) % 1;
      mote.y = (mote.y + mote.vy * delta + 1) % 1;
      const x = mote.x * width, y = mote.y * height;
      if (mote.glyph) {
        context.fillStyle = 'rgba(29,26,21,.16)';
        context.font = '11px Consolas, monospace';
        context.fillText(mote.glyph, x, y);
      } else {
        context.fillStyle = 'rgba(29,26,21,.22)';
        context.beginPath();
        context.arc(x, y, mote.r, 0, Math.PI * 2);
        context.fill();
      }
    }

    /* 点击涟漪 */
    ripples = ripples.filter(ripple => ripple.age < 700);
    for (const ripple of ripples) {
      ripple.age += delta;
      const progress = ripple.age / 700;
      context.strokeStyle = `rgba(168,53,23,${(1 - progress) * .5})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(ripple.x, ripple.y, 14 + progress * 150, 0, Math.PI * 2);
      context.stroke();
    }
  }

  function canRun() {
    return visible && !document.hidden && !prefersReducedMotion() && !document.body.classList.contains('motion-paused');
  }
  function tick(time) {
    frame = 0;
    if (!canRun()) return;
    if (time - lastTime >= 32) {
      draw(Math.min(time - lastTime, 64));
      lastTime = time;
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = performance.now();
    if (canRun()) frame = requestAnimationFrame(tick);
  }

  region.addEventListener('pointermove', event => {
    const rect = region.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, { passive: true });
  region.addEventListener('pointerleave', () => { pointer = null; });
  region.addEventListener('pointerdown', event => {
    if (!canRun()) return;
    const rect = region.getBoundingClientRect();
    ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, age: 0 });
  }, { passive: true });

  new ResizeObserver(resize).observe(region);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: .01 }).observe(region);
  document.addEventListener('site-motion-change', sync);
  document.addEventListener('visibilitychange', sync);
  if (typeof reduceMotionQuery.addEventListener === 'function') reduceMotionQuery.addEventListener('change', sync);
  resize();
  sync();
}

/* ===== 文字解码：hero 标题一次性解码，链接 hover 轻扰 =====
   aria-label 固定原文，屏幕阅读器不受扰动影响。 */
const SCRAMBLE_CHARS = '▘▝▖▗▚▞▓░·{/}<>*';

function decodeElement(element, duration) {
  const original = element.dataset.decodeOriginal || element.textContent;
  element.dataset.decodeOriginal = original;
  if (!element.getAttribute('aria-label')) element.setAttribute('aria-label', original);
  const chars = [...original];
  const start = performance.now();

  function step(now) {
    const progress = Math.min(1, (now - start) / duration);
    element.textContent = chars.map((character, index) => {
      if (/\s/.test(character)) return character;
      if (progress >= (index + 1) / chars.length + .1) return character;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = original;
  }
  requestAnimationFrame(step);
}

function initHeroDecode() {
  const lines = document.querySelectorAll('[data-decode]');
  if (!lines.length || prefersReducedMotion()) return;
  lines.forEach((line, index) => {
    line.dataset.decodeOriginal = line.textContent;
    line.setAttribute('aria-label', line.textContent);
    window.setTimeout(() => decodeElement(line, 820), 120 + index * 130);
  });
}

function initLinkScramble() {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
  document.querySelectorAll('.nav-link').forEach(link => {
    const original = link.textContent;
    let timer = 0;
    link.addEventListener('pointerenter', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => decodeElement(link, 240), 0);
    });
    link.addEventListener('focus', () => { link.textContent = original; });
    link.addEventListener('pointerleave', () => { window.clearTimeout(timer); });
  });
}

/* ===== 项目展台：预设三步流程演示（沿用已验证交互契约）
   模拟边界：不读取桌面，不连接模型。 ===== */
function initDynamicLab() {
  const lab = document.querySelector('.live-lab');
  if (!lab) return;
  const projects = [
    {title:'Local Window Copilot',category:'01 / DESKTOP CONTEXT',image:'projects/local-window-copilot/img/mascot_idle.png',alt:'Local Window Copilot 的白色助手形象',url:'projects/local-window-copilot.html',caption:'窗口滚走了，也能接着追问刚才的内容。',nodes:['锁定窗口','读取线索','留下记录'],steps:['先固定这次观察的窗口，让焦点变化不打断目标。','把屏幕文字与位置组织起来，再补充画面中的线索。','将来源与跨帧记录关联，下一次追问可以继续。']},
    {title:'星途知汇',category:'02 / ENTERPRISE KNOWLEDGE',image:'assets/xingtu-knowledge-platform-hero.webp',alt:'星途知汇项目视觉封面，非产品界面截图',url:'projects.html#enterprise-agent',caption:'从一次经验分享，到团队能够找到的知识。',nodes:['整理分享','员工确认','权限检索'],steps:['从飞书分享出发，整理文字、文件和业务背景。','由员工确认内容，经过主管审核后形成发布版本。','检索先限定可见范围，再从发布知识中寻找依据。']},
    {title:'OpenSOP Agent',category:'03 / HUMAN IN THE LOOP',image:'projects/local-window-copilot/img/mascot_analyzing.png',alt:'流程演示中的助手分析状态，用作交互提示',url:'projects.html#workflow-agent',caption:'生成草稿，也为人的判断留好位置。',nodes:['检索材料','生成草稿','人工审核'],steps:['先查找历史路线、参数与媒体证据。','按结构化约束生成作业草稿，保留每一步的来源。','在人工审核点暂停，确认之后再继续发布和导出。']}
  ];
  const controls = lab.querySelector('.lab-projects');
  const run = lab.querySelector('.run-demo');
  const motionButton = lab.querySelector('.motion-toggle');
  const caption = lab.querySelector('#lab-caption');
  const status = lab.querySelector('#lab-step');
  const nodes = [...lab.querySelectorAll('.lab-node')];
  let selected = 0, step = -1, running = false, timer = 0, paused = false;
  controls.hidden = false; run.hidden = false; motionButton.hidden = false;
  function clear() { clearTimeout(timer); timer = 0; }
  function animate(element) {
    if (!prefersReducedMotion() && !paused) element.animate([{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});
  }
  function renderProject(index) {
    clear(); running = false; step = -1; selected = index;
    const project = projects[index]; lab.dataset.project = String(index); lab.classList.remove('is-running');
    lab.querySelector('#lab-title').textContent = project.title;
    lab.querySelector('#lab-category').textContent = project.category;
    const image = lab.querySelector('#lab-image'); image.src = new URL(project.image,siteBase).href; image.alt = project.alt;
    const link = lab.querySelector('#lab-link'); link.href = new URL(project.url,siteBase).href;
    caption.textContent = project.caption; status.textContent = 'READY'; run.textContent = '运行一次 ▷';
    nodes.forEach((node,i) => {node.querySelector('strong').textContent = project.nodes[i];node.classList.remove('is-current','is-complete');});
    controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.project)===index)));
    animate(lab.querySelector('.lab-view'));
  }
  function advance() {
    if (!running || paused) return;
    step++;
    if (step >= 3) {
      running = false; lab.classList.remove('is-running');
      nodes.forEach(node=>{node.classList.remove('is-current');node.classList.add('is-complete');});
      status.textContent = 'COMPLETE / 演示结束'; run.textContent = '再运行一次 ↻';
      return;
    }
    status.textContent = `STEP 0${step+1} / 03`;
    caption.textContent = projects[selected].steps[step];
    nodes.forEach((node,index)=>{node.classList.toggle('is-current',index===step);node.classList.toggle('is-complete',index<step);});
    animate(caption);
    if (!prefersReducedMotion()) timer = setTimeout(advance,1900);
    else run.textContent = step===2?'完成演示 ✓':'下一步 →';
  }
  run.addEventListener('click',()=>{
    if(paused)return;
    if(running && prefersReducedMotion()){advance();return;}
    if(running)return;
    clear();step=-1;running=true;lab.classList.add('is-running');run.textContent = prefersReducedMotion()?'下一步 →':'流程运行中…';advance();
  });
  controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>renderProject(Number(button.dataset.project))));
  motionButton.addEventListener('click',()=>{
    paused=!paused;document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'继续动态':'暂停动态';run.disabled=paused;
    clear();if(!paused && running && !prefersReducedMotion())timer=setTimeout(advance,1200);
    document.dispatchEvent(new Event('site-motion-change'));
  });
  document.addEventListener('visibilitychange',()=>{
    clear();if(!document.hidden && running && !paused && !prefersReducedMotion())timer=setTimeout(advance,1200);
  });
  new IntersectionObserver(entries=>{
    clear();if(entries[0].isIntersecting && running && !paused && !document.hidden && !prefersReducedMotion())timer=setTimeout(advance,1200);
  },{threshold:.05}).observe(lab);
  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', () => { clear(); renderProject(selected); });
  }
}

/* ===== 磁性按钮：精确指针下的微位移，减少动态时关闭 ===== */
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const dx = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (event.clientY - rect.top - rect.height / 2) / rect.height;
      button.style.transform = `translate(${(dx * 7).toFixed(1)}px, ${(dy * 5).toFixed(1)}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

/* ===== 索引行指针预览：装饰性浮动卡，仅精确指针 ===== */
function initCursorPreview() {
  const rows = document.querySelectorAll('.index-row[data-preview-img]');
  if (!rows.length || !window.matchMedia('(pointer: fine)').matches) return;
  document.documentElement.classList.add('fine-pointer');

  const card = document.createElement('figure');
  card.className = 'cursor-card';
  card.setAttribute('aria-hidden', 'true');
  const image = new Image();
  image.alt = '';
  const caption = document.createElement('figcaption');
  card.append(image, caption);
  document.body.appendChild(card);

  const reduced = prefersReducedMotion();
  let active = false, targetX = 0, targetY = 0, currentX = 0, currentY = 0, raf = 0;

  function loop() {
    if (reduced) { currentX = targetX; currentY = targetY; }
    else {
      currentX += (targetX - currentX) * .2;
      currentY += (targetY - currentY) * .2;
    }
    card.style.transform = `translate(${Math.min(currentX, window.innerWidth - 262)}px, ${currentY}px) translate(20px, -60%)`;
    if (active || Math.abs(targetX - currentX) > .5) raf = requestAnimationFrame(loop);
    else raf = 0;
  }
  rows.forEach(row => {
    row.addEventListener('pointerenter', () => {
      image.src = new URL(row.dataset.previewImg, siteBase).href;
      caption.textContent = row.dataset.previewLabel || '';
      card.classList.add('show');
      active = true;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    row.addEventListener('pointermove', event => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    row.addEventListener('pointerleave', () => {
      card.classList.remove('show');
      active = false;
    });
  });
}

/* ===== 数字计数：一次性，进入视口触发 ===== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  function finish(element) {
    element.textContent = element.dataset.count;
  }
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    counters.forEach(finish);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      observer.unobserve(element);
      const total = Number(element.dataset.count) || 0;
      const start = performance.now();
      function step(now) {
        const progress = Math.min(1, (now - start) / 700);
        element.textContent = String(Math.round(total * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(step);
        else finish(element);
      }
      element.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: .4 });
  counters.forEach(element => observer.observe(element));
}

/* ===== 页脚本地时钟：纯本地计算，无网络请求 ===== */
function initLocalClock() {
  const clocks = document.querySelectorAll('[data-clock]');
  if (!clocks.length) return;
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
  } catch { return; }
  function update() {
    const now = new Date();
    const text = `福州 ${formatter.format(now)}`;
    clocks.forEach(clock => {
      clock.textContent = text;
      clock.setAttribute('datetime', now.toISOString());
    });
  }
  update();
  window.setInterval(update, 30000);
}

/* ===== 子页导航高亮 ===== */
function initActiveNavLink() {
  const relative = location.pathname.slice(siteBase.pathname.length);
  const current = relative.startsWith('blog/') ? 'blog.html'
    : relative.startsWith('projects/') || relative.startsWith('demos/') ? 'projects.html'
    : relative || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = new URL(link.href).pathname === new URL(current, siteBase).pathname;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/* ===== 文章筛选 ===== */
function initBlogFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('blog-posts');
  if (!buttons.length || !grid) return;
  const status = document.createElement('p');
  status.className = 'filter-status';
  status.setAttribute('role', 'status');
  grid.before(status);
  const cards = [...grid.querySelectorAll('.card-blog')];
  function select(button) {
    buttons.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    const tag = button.dataset.tag.toLowerCase();
    cards.forEach(card => { card.hidden = tag !== 'all' && !card.dataset.tags.split(',').includes(tag); card.classList.remove('is-filtered-in'); if (!card.hidden) requestAnimationFrame(() => card.classList.add('is-filtered-in')); });
    status.textContent = `显示 ${cards.filter(card => !card.hidden).length} / ${cards.length} 篇文章`;
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button)));
  select(buttons[0]);
}

/* ===== 站内导览：本地导航与索引检索，原生 dialog 语义 ===== */
function initSiteGuide() {
  if (typeof HTMLDialogElement === 'undefined') return;
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'guide-launcher';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'site-guide');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = '<span class="guide-mark" aria-hidden="true">↗</span><span>去哪里</span><kbd>⌘ K</kbd>';
  launcher.querySelector('kbd').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  const dialog = document.createElement('dialog');
  dialog.id = 'site-guide';
  dialog.className = 'site-guide';
  dialog.setAttribute('aria-labelledby', 'guide-title');
  dialog.innerHTML = `
    <div class="guide-header"><div><p>EXPLORE / LINWEI SONG</p><h2 id="guide-title">想从哪里开始？</h2></div><button type="button" class="guide-close" aria-label="关闭站内导航">×</button></div>
    <form class="guide-search" role="search"><label for="guide-query">搜索页面、文章或本页章节</label><div><span aria-hidden="true">⌕</span><input id="guide-query" type="search" placeholder="试试：Agent、缓存、项目…" autocomplete="off" autofocus><button type="button" class="guide-clear" aria-label="清空搜索">清空</button></div></form>
    <p class="guide-status" role="status"></p><div class="guide-results"></div>
    <div class="guide-footer"><span>站内导航 · 搜索仅在本页运行</span><button type="button" class="guide-top">回到顶部 ↑</button></div>`;
  document.body.append(launcher, dialog);
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('.guide-results');
  const status = dialog.querySelector('.guide-status');
  const headings = [...document.querySelectorAll('main h2, .post-content h2')].filter(h => h.textContent.trim());
  const chapters = headings.map((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
    return { title:heading.textContent.trim(), url:`#${heading.id}`, kind:'本页章节', terms:'目录 本页 章节' };
  });
  const pages = [
    { title:'首页', url:'index.html', kind:'页面', terms:'宋林蔚 home' },
    { title:'项目现场', url:'projects.html', kind:'页面', terms:'作品 星途知汇 OpenSOP Local Window Copilot' },
    { title:'工程笔记', url:'blog.html', kind:'页面', terms:'文章 博客 writing' },
    { title:'关于我', url:'about.html', kind:'页面', terms:'作者 宋林蔚 联系 邮件' },
    { title:'Local Window Copilot 交互演示', url:'demos/local-window-copilot/', kind:'演示', terms:'demo 助手 桌宠' }
  ];
  let posts = [], loading = false, failed = false, loaded = false;
  let previousFocus = null;
  function close() { dialog.close(); }
  function render() {
    const focusedResult = results.contains(document.activeElement) ? document.activeElement : null;
    const focusedHref = focusedResult?.getAttribute('href');
    const query = input.value.trim().toLocaleLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const candidates = [...pages, ...chapters, ...posts];
    const matches = tokens.length ? candidates.filter(item => tokens.every(token => `${item.title} ${item.terms || ''} ${item.kind}`.toLocaleLowerCase().includes(token))) : [...pages, ...chapters];
    status.textContent = query ? `${matches.length} 个结果${loading ? ' · 正在读取文章索引' : failed ? ' · 文章索引暂不可用' : ''}` : '选一个入口，或者输入关键词。';
    results.replaceChildren();
    for (const item of matches) {
      const link = document.createElement('a');
      link.className = 'guide-result';
      link.href = item.url.startsWith('#') ? item.url : new URL(item.url, siteBase).href;
      const category = document.createElement('span'); category.className = 'guide-kind'; category.textContent = item.kind;
      const title = document.createElement('span'); title.className = 'guide-result-title'; title.textContent = item.title;
      const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
      link.append(category, title, arrow);
      const currentHeading = [...headings].reverse().find(heading => heading.getBoundingClientRect().top <= 150);
      if (currentHeading && item.url === `#${currentHeading.id}`) link.setAttribute('aria-current', 'location');
      if (item.url.startsWith('#')) link.addEventListener('click', () => {
        close();
        const heading = document.getElementById(item.url.slice(1));
        heading.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => heading.focus({ preventScroll:true }));
      });
      results.append(link);
    }
    if (!matches.length) {
      const empty = document.createElement('div'); empty.className = 'guide-empty';
      const message = document.createElement('p'); message.textContent = '没有找到匹配内容，换一个更短的关键词试试。';
      const clear = document.createElement('button'); clear.type = 'button'; clear.textContent = '清空搜索';
      clear.addEventListener('click', clearSearch); empty.append(message, clear); results.append(empty);
    }
    if (failed) {
      const fallback = document.createElement('div'); fallback.className = 'guide-fallback';
      const link = document.createElement('a'); link.href = new URL('blog.html', siteBase).href; link.textContent = '查看全部文章 →';
      const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = '重试文章索引'; retry.addEventListener('click', loadPosts);
      fallback.append(link, retry); results.append(fallback);
    }
    if (focusedResult) {
      const replacement = focusedHref
        ? [...results.querySelectorAll('a')].find(link => link.getAttribute('href') === focusedHref)
        : [...results.querySelectorAll('button')].find(button => button.textContent === focusedResult.textContent);
      (replacement || input).focus({preventScroll:true});
    }
  }
  async function loadPosts() {
    if (loading || loaded) return;
    loading = true; failed = false; render();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(new URL('blog/posts.json', siteBase), {signal:controller.signal});
      if (!response.ok) throw new Error('Index unavailable');
      const data = await response.json();
      if (!Array.isArray(data) || data.some(post => typeof post.title !== 'string' || typeof post.url !== 'string' || !/^blog\/[a-z0-9-]+\.html$/.test(post.url))) throw new Error('Invalid index');
      posts = data.map(post => ({title:post.title, url:post.url, kind:'文章', terms:`${Array.isArray(post.tags) ? post.tags.join(' ') : ''} ${post.excerpt || ''}`}));
      loaded = true;
    } catch { failed = true; }
    finally { clearTimeout(timeout); loading = false; if (dialog.open) render(); }
  }
  function clearSearch() { input.value = ''; render(); input.focus(); }
  function open() {
    if (dialog.open || document.body.classList.contains('menu-open')) return;
    previousFocus = document.activeElement;
    dialog.showModal(); launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('guide-open');
    input.focus(); render(); loadPosts();
  }
  launcher.addEventListener('click', open);
  dialog.querySelector('.guide-close').addEventListener('click', close);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.isComposing) { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')].filter(element => element.getClientRects().length && !element.hidden);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  dialog.querySelector('.guide-clear').addEventListener('click', clearSearch);
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); results.querySelector('a')?.click();
  });
  input.addEventListener('input', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); results.querySelector('a')?.focus(); }
  });
  results.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
    const links = [...results.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    if (next < 0) input.focus(); else links[Math.min(next, links.length - 1)]?.focus();
  });
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => { backdropPress = event.target === dialog && isOutside(event); });
  function isOutside(event) { const rect = dialog.getBoundingClientRect(); return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; }
  dialog.addEventListener('click', event => { if (backdropPress && event.target === dialog && isOutside(event)) close(); backdropPress = false; });
  dialog.addEventListener('close', () => {
    launcher.setAttribute('aria-expanded', 'false'); document.body.classList.remove('guide-open');
    if (previousFocus instanceof HTMLElement) previousFocus.focus({preventScroll:true});
  });
  dialog.querySelector('.guide-top').addEventListener('click', () => {
    close(); window.scrollTo({top:0, behavior:prefersReducedMotion() ? 'instant' : 'smooth'});
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !event.altKey && !event.isComposing) {
      event.preventDefault(); if (dialog.open) close(); else open();
    }
  });
  if (document.querySelector('.post-content')) initReadingProgress(launcher, headings);
}

/* ===== 阅读进度（文章页） ===== */
function initReadingProgress(launcher, headings) {
  const content = document.querySelector('.post-content');
  const progress = document.createElement('div'); progress.className = 'reading-progress';
  progress.setAttribute('role','progressbar'); progress.setAttribute('aria-label','文章阅读进度');
  progress.setAttribute('aria-valuemin','0'); progress.setAttribute('aria-valuemax','100');
  const current = document.createElement('span'); current.className = 'guide-reading'; launcher.prepend(current);
  document.body.append(progress);
  let queued = false;
  function update() {
    const rect = content.getBoundingClientRect();
    const start = scrollY + rect.top - 120;
    const end = Math.max(start + 1, scrollY + rect.bottom - innerHeight);
    const value = Math.round(Math.max(0, Math.min(1, (scrollY-start)/(end-start))) * 100);
    progress.style.setProperty('--read', `${value}%`); progress.setAttribute('aria-valuenow', String(value));
    current.textContent = `${value}%`;
    const active = [...headings].reverse().find(heading => heading.getBoundingClientRect().top <= 150);
    document.querySelectorAll('.guide-result[href*="#"]').forEach(link => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
    queued = false;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, {passive:true}); window.addEventListener('resize', schedule); update();
}
