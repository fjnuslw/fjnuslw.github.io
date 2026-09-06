/* 数字花园共享交互 · specs/2026-09-06-digital-garden */
const siteBase = new URL('../', document.currentScript.src);
document.documentElement.classList.add('js');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
function prefersReducedMotion() { return reduceMotionQuery.matches; }
document.addEventListener('DOMContentLoaded', () => {
  initNavbar(); initMotionControl(); initGardenCanvas(); initFolio(); initExhibition(); initDynamicLab();
  initLocalClock(); initSiteGuide(); initBlogFilter(); initActiveNavLink();
});
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
    requestAnimationFrame(() => { if (isOpen()) closeButton.focus({preventScroll:true}); });
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

/* 数字花园 / progressive enhancement, no runtime dependencies. */
function canAnimate() {
  return !prefersReducedMotion() && !document.hidden && !document.body.classList.contains('motion-paused');
}
function setSiteMotion(paused) {
  document.body.classList.toggle('motion-paused', paused);
  document.dispatchEvent(new Event('site-motion-change'));
}
function initMotionControl() {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'garden-motion';
  function sync() {
    const paused = document.body.classList.contains('motion-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = prefersReducedMotion() ? '减少动态已开启' : paused ? '继续花园动态' : '暂停花园动态';
    button.disabled = prefersReducedMotion();
  }
  button.addEventListener('click', () => setSiteMotion(!document.body.classList.contains('motion-paused')));
  document.addEventListener('site-motion-change', sync);
  reduceMotionQuery.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-inactive', document.hidden));
  document.body.append(button); sync();
}

/* 流光粒子场 / specs/2026-09-06-flowing-ink
   装饰层：fixed 画布、不拦截事件；密度按视口限流；
   停止条件与全局暂停、减少动态、页签隐藏一致，暂停时保留最后一帧。 */
function initGardenCanvas() {
  if (document.getElementById('garden-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'garden-canvas'; canvas.className = 'garden-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const palette = ['#a04e67', '#315951', '#a8603a', '#6d4a80'];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pointer = { x: -1e4, y: -1e4, active: false };
  let particles = [], width = 0, height = 0, raf = 0, running = false, staticDrawn = false;

  function build() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const narrow = width < 700;
    const count = Math.min(narrow ? 40 : 90, Math.round(width * height / (narrow ? 24000 : 16000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: 1.2 + Math.random() * 2.2,
      base: .10 + Math.random() * .22,
      phase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
    staticDrawn = false;
  }
  function drawParticle(p, alpha) {
    ctx.globalAlpha = alpha; ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  function render(now) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 12100) {
          ctx.globalAlpha = .14 * (1 - Math.sqrt(d2) / 110);
          ctx.strokeStyle = '#7a6a76';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (pointer.active) {
        const dx = a.x - pointer.x, dy = a.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < 140) {
          ctx.globalAlpha = .18 * (1 - d / 140);
          ctx.strokeStyle = '#a04e67';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      if (running) {
        p.x += p.vx; p.y += p.vy; p.phase += .012;
        if (p.x < -24) p.x = width + 24; else if (p.x > width + 24) p.x = -24;
        if (p.y < -24) p.y = height + 24; else if (p.y > height + 24) p.y = -24;
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, d = Math.hypot(dx, dy);
          if (d < 140 && d > .5) { const f = (1 - d / 140) * 1.15; p.x += dx / d * f; p.y += dy / d * f; }
        }
      }
      drawParticle(p, Math.max(.04, p.base + Math.sin(p.phase) * .06));
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(render);
  }
  function sync() {
    if (canAnimate()) {
      if (!running) { running = true; raf = requestAnimationFrame(render); }
    } else if (running) {
      running = false; cancelAnimationFrame(raf); // 保留最后一帧
    } else if (!staticDrawn) {
      staticDrawn = true; render(0); // 减少动态：只画一帧静态星点
    }
  }
  window.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; pointer.x = pointer.y = -1e4; }, { passive: true });
  window.addEventListener('blur', () => { pointer.active = false; pointer.x = pointer.y = -1e4; }, { passive: true });
  document.addEventListener('site-motion-change', sync);
  document.addEventListener('visibilitychange', sync);
  reduceMotionQuery.addEventListener('change', sync);
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { build(); if (!running) { staticDrawn = true; render(0); } }, 180);
  }, { passive: true });
  build(); sync();
}

// Horizontal gestures never cancel vertical scrolling. A completed swipe suppresses only its trailing click.
function initSwipe(region, onSwipe) {
  let start = null, suppressUntil = 0;
  region.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    start = {x:event.clientX, y:event.clientY, id:event.pointerId};
  }, {passive:true});
  region.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX-start.x, dy = event.clientY-start.y; start = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)*1.5) {
      suppressUntil = performance.now()+450; onSwipe(dx < 0 ? 1 : -1);
    }
  }, {passive:true});
  region.addEventListener('pointercancel', () => { start = null; }, {passive:true});
  region.addEventListener('click', event => {
    if (performance.now() < suppressUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);
}

function initFolio() {
  const folio = document.querySelector('.folio');
  if (!folio) return;
  const works = [...document.querySelectorAll('.work-piece')];
  if (works.length !== 3) return;
  const projects = [works[1],works[0],works[2]].map(work => ({
    title:work.querySelector('.work-caption h3').textContent.trim(),
    href:work.querySelector('.work-frame').href,
    poster:work.querySelector('.poster'),
  }));
  const cover = folio.querySelector('.folio-cover');
  const controls = folio.querySelector('.folio-controls');
  const label = folio.querySelector('.folio-name');
  label.setAttribute('aria-live', 'polite'); label.setAttribute('aria-atomic', 'true');
  let selected = 0;
  controls.hidden = false;
  function select(index) {
    selected = (index+projects.length)%projects.length;
    const item = projects[selected], poster = item.poster.cloneNode(true);
    const oldHeading = poster.querySelector('h3'), heading = document.createElement('h2');
    heading.innerHTML = oldHeading.innerHTML; oldHeading.replaceWith(heading);
    cover.querySelector('.poster').replaceWith(poster);
    cover.href = item.href; cover.setAttribute('aria-label', `查看 ${item.title} 项目`);
    label.textContent = item.title;
    folio.querySelector('.folio-count').textContent = `0${selected+1} / 03`;
    if (canAnimate()) poster.animate([{opacity:.45,transform:'translateX(12px)'},{opacity:1,transform:'none'}],{duration:400,easing:'ease-out'});
  }
  folio.querySelector('[data-folio-prev]').addEventListener('click', () => select(selected-1));
  folio.querySelector('[data-folio-next]').addEventListener('click', () => select(selected+1));
  folio.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); select(selected+(event.key==='ArrowRight'?1:-1));
  });
  initSwipe(folio.querySelector('.folio-stack'), direction => select(selected+direction));
  const fine = window.matchMedia('(pointer:fine)');
  let frame = 0;
  folio.querySelector('.folio-stack').addEventListener('pointermove', event => {
    if (!fine.matches || !canAnimate()) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = folio.getBoundingClientRect();
      const x = Math.max(-.5,Math.min(.5,(event.clientX-r.left)/r.width-.5));
      const y = Math.max(-.5,Math.min(.5,(event.clientY-r.top)/r.height-.5));
      cover.style.transform = `rotateY(${-11+x*9}deg) rotateX(${-y*6}deg) rotateZ(2deg)`;
    });
  },{passive:true});
  const reset = () => { cancelAnimationFrame(frame); cover.style.removeProperty('transform'); };
  folio.addEventListener('pointerleave', reset);
  document.addEventListener('site-motion-change', reset);
  reduceMotionQuery.addEventListener('change', reset);
}

function initExhibition() {
  const gallery = document.querySelector('.exhibition');
  if (!gallery) return;
  const stage = gallery.querySelector('.exhibit-stage');
  const frames = [...stage.querySelectorAll('.exhibit-frame')];
  const descriptions = ['经过确认和审核，让散落的经验成为团队知识。','窗口滚走以后，仍然可以接着追问。','从历史材料到作业草稿，为人的确认留下位置。'];
  const modes = gallery.querySelector('.gallery-modes');
  const narrow = window.matchMedia('(max-width:768px)');
  let selected = 1, mode = narrow.matches ? 'flat' : 'space', userMode = null;
  modes.hidden = false; gallery.querySelector('.gallery-controls').hidden = false;
  function select(index, scroll = false) {
    selected = (index+frames.length)%frames.length;
    frames.forEach((item, i) => {
      let offset = i-selected;
      if (offset > 1) offset -= frames.length;
      if (offset < -1) offset += frames.length;
      item.style.setProperty('--offset', String(offset));
      item.dataset.selected = String(i===selected);
    });
    const text = gallery.querySelector('.gallery-description');
    text.replaceChildren();
    const title = document.createElement('b'); title.textContent = frames[selected].dataset.title;
    text.append(title,document.createTextNode(descriptions[selected]));
    gallery.querySelector('.gallery-count').textContent = `0${selected+1} / 03`;
    if (scroll && mode==='flat' && narrow.matches) {
      // Only move the local shelf, never the page itself.
      stage.scrollTo({left:frames[selected].offsetLeft-(stage.clientWidth-frames[selected].clientWidth)/2,behavior:canAnimate()?'smooth':'instant'});
    }
  }
  function setMode(next) {
    mode = narrow.matches ? 'flat' : next;
    gallery.dataset.mode = mode;
    modes.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
    select(selected);
  }
  modes.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    userMode = button.dataset.mode; setMode(userMode);
  }));
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => select(selected-1,true));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => select(selected+1,true));
  stage.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key==='Home'?0:event.key==='End'?frames.length-1:selected+(event.key==='ArrowRight'?1:-1);
    select(next,true);
  });
  // Tabbed links select their frame so the focused work never sits behind another frame.
  frames.forEach((item, index) => item.addEventListener('focus', () => select(index,true)));
  initSwipe(stage, direction => { if (!narrow.matches) select(selected+direction); });
  let scrollFrame = 0;
  stage.addEventListener('scroll', () => {
    if (!narrow.matches) return;
    clearTimeout(scrollFrame);
    scrollFrame = setTimeout(() => {
      const center = stage.getBoundingClientRect().left+stage.clientWidth/2;
      const distances = frames.map(item => {const r=item.getBoundingClientRect();return Math.abs(r.left+r.width/2-center);});
      const nearest = distances.indexOf(Math.min(...distances));
      if (nearest!==selected) select(nearest);
    }, 100);
  },{passive:true});
  narrow.addEventListener('change', () => setMode(userMode || (narrow.matches?'flat':'space')));
  setMode(mode);
  if (narrow.matches) select(0);
}
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
  motionButton.addEventListener('click',()=>setSiteMotion(!document.body.classList.contains('motion-paused')));
  function syncMotion() {
    paused=document.body.classList.contains('motion-paused');
    motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'继续动态':'暂停动态';run.disabled=paused;
    clear();if(!paused && running && !document.hidden && !prefersReducedMotion())timer=setTimeout(advance,1200);
  }
  document.addEventListener('site-motion-change',syncMotion);
  syncMotion();
  document.addEventListener('visibilitychange',()=>{
    clear();if(!document.hidden && running && !paused && !prefersReducedMotion())timer=setTimeout(advance,1200);
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{
    clear();if(entries[0].isIntersecting && running && !paused && !document.hidden && !prefersReducedMotion())timer=setTimeout(advance,1200);
  },{threshold:.05}).observe(lab);
  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', () => { clear(); renderProject(selected); });
  }
}

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
