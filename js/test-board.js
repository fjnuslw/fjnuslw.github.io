(function () {
  const DATA_URL = 'data/interview-question-bank.json';
  const STORAGE_KEY = 'interview-test-board:v1';

  const STATUS = {
    new: { label: '未测', score: 0 },
    wrong: { label: '不会', score: 0 },
    fuzzy: { label: '模糊', score: 60 },
    known: { label: '基本会', score: 80 },
    mastered: { label: '熟练', score: 100 },
  };

  const DIFFICULTY = {
    easy: '基础',
    medium: '进阶',
    hard: '高阶',
  };

  const BLOCK_TITLES = [
    ['core', '核心概念'],
    ['mechanism', '原理机制'],
    ['practice', '实践要点'],
    ['followUps', '常见追问'],
    ['talkTrack', '面试话术'],
    ['extra', '补充内容'],
  ];

  let bank = null;
  let progress = loadProgress();
  let activeCategory = 'all';
  let selectedQuestionId = null;
  let activeSession = null;
  let timer = null;

  const el = {};

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    if (!document.getElementById('question-list')) return;
    bindElements();
    bindEvents();
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bank = await res.json();
      selectedQuestionId = bank.questions[0]?.id || null;
      populateFilters();
      renderAll();
    } catch (error) {
      el.questionList.innerHTML = `<div class="detail-empty">题库加载失败：${escapeHtml(error.message)}</div>`;
    }
  }

  function bindElements() {
    Object.assign(el, {
      statTotal: document.getElementById('stat-total'),
      statCategories: document.getElementById('stat-categories'),
      statSections: document.getElementById('stat-sections'),
      statToday: document.getElementById('stat-today'),
      statMastery: document.getElementById('stat-mastery'),
      categoryRail: document.getElementById('category-rail'),
      questionList: document.getElementById('question-list'),
      questionListTitle: document.getElementById('question-list-title'),
      questionCount: document.getElementById('question-count'),
      detailPanel: document.getElementById('detail-panel'),
      search: document.getElementById('question-search'),
      categoryFilter: document.getElementById('category-filter'),
      statusFilter: document.getElementById('status-filter'),
      difficultyFilter: document.getElementById('difficulty-filter'),
      testRange: document.getElementById('test-range'),
      testCount: document.getElementById('test-count'),
      testMode: document.getElementById('test-mode'),
      startSession: document.getElementById('start-session-btn'),
      resetSession: document.getElementById('reset-session-btn'),
      sessionCard: document.getElementById('session-card'),
      randomStartTop: document.getElementById('random-start-top'),
      dailyFive: document.getElementById('daily-five-btn'),
      toast: document.getElementById('toast'),
    });
  }

  function bindEvents() {
    document.querySelectorAll('.test-tab').forEach((button) => {
      button.addEventListener('click', () => switchView(button.dataset.view));
    });

    el.search.addEventListener('input', renderOverview);
    el.categoryFilter.addEventListener('change', () => {
      activeCategory = el.categoryFilter.value;
      renderOverview();
    });
    el.statusFilter.addEventListener('change', renderOverview);
    el.difficultyFilter.addEventListener('change', renderOverview);
    el.startSession.addEventListener('click', () => startSessionFromControls());
    el.resetSession.addEventListener('click', () => {
      activeSession = null;
      stopTimer();
      renderSession();
    });
    el.randomStartTop.addEventListener('click', () => {
      switchView('selftest');
      startSessionFromControls();
    });
    el.dailyFive.addEventListener('click', () => {
      switchView('selftest');
      el.testRange.value = 'weak';
      el.testCount.value = '5';
      el.testMode.value = 'weak';
      startSessionFromControls();
    });

    el.questionList.addEventListener('click', (event) => {
      const row = event.target.closest('[data-question-id]');
      if (!row) return;
      selectedQuestionId = row.dataset.questionId;
      renderOverview();
    });
  }

  function populateFilters() {
    const categoryOptions = [
      `<option value="all">全部主类</option>`,
      ...bank.categories.map((category) => `<option value="${category.id}">${escapeHtml(category.title)}</option>`),
    ].join('');
    el.categoryFilter.innerHTML = categoryOptions;

    el.testRange.innerHTML = [
      `<option value="all">全部题库</option>`,
      `<option value="weak">弱项优先</option>`,
      `<option value="new">未测题</option>`,
      `<option value="wrong">错题</option>`,
      `<option value="fuzzy">模糊题</option>`,
      `<option value="favorite">收藏题</option>`,
      ...bank.categories.map((category) => `<option value="cat:${category.id}">${escapeHtml(category.title)}</option>`),
    ].join('');
  }

  function renderAll() {
    renderStats();
    renderOverview();
    renderSession();
  }

  function renderStats() {
    const total = bank.questions.length;
    const records = Object.entries(progress.questions);
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = records.filter(([, record]) => (record.lastTestedAt || '').slice(0, 10) === today).length;
    const masteredCount = records.filter(([, record]) => record.status === 'mastered').length;

    el.statTotal.textContent = total;
    el.statCategories.textContent = bank.categories.length;
    el.statSections.textContent = bank.sections.length;
    el.statToday.textContent = todayCount;
    el.statMastery.textContent = `${Math.round((masteredCount / total) * 100)}%`;
  }

  function renderOverview() {
    const questions = getFilteredQuestions();
    renderCategoryRail();
    renderQuestionList(questions);
    renderDetail();
    renderStats();
  }

  function renderCategoryRail() {
    const currentQuestions = getFilteredQuestions({ ignoreCategory: true });
    const countByCategory = new Map();
    for (const question of currentQuestions) {
      countByCategory.set(question.categoryId, (countByCategory.get(question.categoryId) || 0) + 1);
    }

    const allCount = currentQuestions.length;
    const buttons = [
      categoryButtonHtml('all', '全部题目', allCount),
      ...bank.categories.map((category) => categoryButtonHtml(category.id, category.title, countByCategory.get(category.id) || 0)),
    ];
    el.categoryRail.innerHTML = buttons.join('');
    el.categoryRail.querySelectorAll('[data-category-id]').forEach((button) => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.categoryId;
        el.categoryFilter.value = activeCategory;
        renderOverview();
      });
    });
  }

  function categoryButtonHtml(id, title, count) {
    return `
      <button class="category-button ${activeCategory === id ? 'active' : ''}" type="button" data-category-id="${id}">
        <span>${escapeHtml(title)}</span>
        <span class="category-count">${count}</span>
      </button>
    `;
  }

  function renderQuestionList(questions) {
    const categoryTitle = activeCategory === 'all'
      ? '全部题目'
      : bank.categories.find((category) => category.id === activeCategory)?.title || '题目';
    el.questionListTitle.textContent = categoryTitle;
    el.questionCount.textContent = `${questions.length} 题`;

    if (!questions.length) {
      el.questionList.innerHTML = `<div class="detail-empty">没有匹配的题目</div>`;
      selectedQuestionId = null;
      return;
    }

    if (!questions.some((question) => question.id === selectedQuestionId)) {
      selectedQuestionId = questions[0].id;
    }

    el.questionList.innerHTML = questions.map((question) => {
      const record = getRecord(question.id);
      const status = record.status || 'new';
      const favorite = record.favorite ? ' · 收藏' : '';
      return `
        <button class="question-row ${question.id === selectedQuestionId ? 'active' : ''}" type="button" data-question-id="${question.id}">
          <span class="question-row-title">
            <span class="q-number">Q${question.number}</span>
            <span>${escapeHtml(question.title)}</span>
          </span>
          <span class="question-row-meta">
            <span class="mini-pill">${escapeHtml(question.categoryTitle)}</span>
            <span class="mini-pill">${escapeHtml(question.sectionTitle)}</span>
            <span class="mini-pill">${DIFFICULTY[question.difficulty] || question.difficulty}</span>
            <span class="status-pill status-${status}">${STATUS[status]?.label || '未测'}${favorite}</span>
          </span>
        </button>
      `;
    }).join('');
  }

  function renderDetail() {
    const question = getQuestion(selectedQuestionId);
    if (!question) {
      el.detailPanel.innerHTML = `<div class="detail-empty">选择一道题查看完整答案</div>`;
      return;
    }

    const record = getRecord(question.id);
    const status = record.status || 'new';
    const favoriteText = record.favorite ? '取消收藏' : '收藏';
    const blockHtml = BLOCK_TITLES
      .filter(([key]) => question.blocks[key])
      .map(([key, title]) => `
        <section class="answer-section">
          <h3>${title}</h3>
          <div class="markdown-body">${renderMarkdown(question.blocks[key])}</div>
        </section>
      `).join('');

    el.detailPanel.innerHTML = `
      <div class="detail-content">
        <div class="question-row-meta" style="padding-left:0">
          <span class="mini-pill">Q${question.number}</span>
          <span class="mini-pill">${escapeHtml(question.categoryTitle)}</span>
          <span class="mini-pill">${escapeHtml(question.sectionTitle)}</span>
          <span class="status-pill status-${status}">${STATUS[status]?.label || '未测'}</span>
        </div>
        <h2 class="detail-title">${escapeHtml(question.title)}</h2>
        <div class="keyword-list">${question.keywords.map((keyword) => `<span class="mini-pill">${escapeHtml(keyword)}</span>`).join('')}</div>
        <div class="detail-actions">
          <button class="small-button ${record.favorite ? 'active' : ''}" type="button" data-action="favorite">${favoriteText}</button>
          <button class="small-button primary" type="button" data-action="test">自测此题</button>
        </div>
        <div class="status-actions">
          ${Object.entries(STATUS).filter(([key]) => key !== 'new').map(([key, meta]) => `
            <button class="small-button ${status === key ? 'active' : ''}" type="button" data-status="${key}">${meta.label}</button>
          `).join('')}
        </div>
        ${blockHtml}
      </div>
    `;

    el.detailPanel.querySelector('[data-action="favorite"]').addEventListener('click', () => toggleFavorite(question.id));
    el.detailPanel.querySelector('[data-action="test"]').addEventListener('click', () => {
      switchView('selftest');
      startSession([question.id], 'practice');
    });
    el.detailPanel.querySelectorAll('[data-status]').forEach((button) => {
      button.addEventListener('click', () => setQuestionStatus(question.id, button.dataset.status));
    });
  }

  function getFilteredQuestions(options = {}) {
    const query = (el.search.value || '').trim().toLowerCase();
    const categoryId = options.ignoreCategory ? 'all' : activeCategory;
    const statusFilter = el.statusFilter.value;
    const difficulty = el.difficultyFilter.value;

    return bank.questions.filter((question) => {
      const record = getRecord(question.id);
      const status = record.status || 'new';
      const haystack = `${question.title}\n${question.categoryTitle}\n${question.sectionTitle}\n${question.keywords.join(' ')}\n${question.plainText}`.toLowerCase();

      if (categoryId !== 'all' && question.categoryId !== categoryId) return false;
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false;
      if (statusFilter === 'favorite' && !record.favorite) return false;
      if (statusFilter !== 'all' && statusFilter !== 'favorite' && status !== statusFilter) return false;
      if (query && !haystack.includes(query)) return false;
      return true;
    });
  }

  function switchView(view) {
    document.querySelectorAll('.test-tab').forEach((button) => {
      button.classList.toggle('active', button.dataset.view === view);
    });
    document.querySelectorAll('.test-view').forEach((section) => {
      section.classList.toggle('active', section.id === `${view}-view`);
    });
  }

  function startSessionFromControls() {
    const ids = pickQuestionIds(el.testRange.value, Number(el.testCount.value), el.testMode.value);
    if (!ids.length) {
      showToast('当前范围没有可抽的题');
      return;
    }
    startSession(ids, el.testMode.value);
  }

  function startSession(ids, mode) {
    stopTimer();
    activeSession = {
      id: `session-${Date.now()}`,
      ids,
      mode,
      index: 0,
      answer: '',
      submitted: false,
      evaluation: null,
      remaining: mode === 'quick' ? 90 : null,
      startedAt: new Date().toISOString(),
    };
    renderSession();
  }

  function pickQuestionIds(range, count, mode) {
    let candidates = bank.questions;
    if (range === 'new') candidates = candidates.filter((question) => (getRecord(question.id).status || 'new') === 'new');
    if (range === 'wrong') candidates = candidates.filter((question) => getRecord(question.id).status === 'wrong');
    if (range === 'fuzzy') candidates = candidates.filter((question) => getRecord(question.id).status === 'fuzzy');
    if (range === 'favorite') candidates = candidates.filter((question) => getRecord(question.id).favorite);
    if (range.startsWith('cat:')) candidates = candidates.filter((question) => question.categoryId === range.slice(4));

    if (range === 'weak' || mode === 'weak') {
      candidates = weightedWeakPool(candidates);
    } else {
      candidates = shuffle(candidates.map((question) => question.id));
    }

    return Array.from(new Set(candidates)).slice(0, count);
  }

  function weightedWeakPool(questions) {
    const weighted = [];
    for (const question of questions) {
      const status = getRecord(question.id).status || 'new';
      const weight = status === 'wrong' ? 5 : status === 'fuzzy' ? 4 : status === 'new' ? 3 : status === 'known' ? 2 : 1;
      for (let i = 0; i < weight; i += 1) weighted.push(question.id);
    }
    return shuffle(weighted);
  }

  function renderSession() {
    stopTimer();
    if (!activeSession) {
      el.sessionCard.innerHTML = `
        <div class="session-placeholder">
          <div>
            <h2>准备抽题</h2>
            <p>先选范围和模式，再开始本轮自测。</p>
          </div>
        </div>
      `;
      return;
    }

    const question = getQuestion(activeSession.ids[activeSession.index]);
    if (!question) return;
    const progressText = `${activeSession.index + 1} / ${activeSession.ids.length}`;
    const timerHtml = activeSession.mode === 'quick'
      ? `<span id="session-timer">${activeSession.remaining}s</span>`
      : `<span>${modeLabel(activeSession.mode)}</span>`;

    if (!activeSession.submitted) {
      el.sessionCard.innerHTML = `
        <div class="session-topline">
          <span>${progressText}</span>
          ${timerHtml}
        </div>
        <div class="question-row-meta" style="padding-left:0; margin-bottom: var(--space-3)">
          <span class="mini-pill">${escapeHtml(question.categoryTitle)}</span>
          <span class="mini-pill">${escapeHtml(question.sectionTitle)}</span>
          <span class="mini-pill">Q${question.number}</span>
        </div>
        <h2 class="session-question">${escapeHtml(question.title)}</h2>
        <div class="answer-box">
          <textarea id="session-answer" placeholder="把你会在面试里说的话写下来"></textarea>
        </div>
        <div class="session-actions">
          <button class="small-button primary" type="button" id="submit-answer-btn">提交自评</button>
          <button class="small-button" type="button" id="skip-question-btn">跳过</button>
        </div>
      `;
      const textarea = document.getElementById('session-answer');
      textarea.value = activeSession.answer || '';
      textarea.addEventListener('input', (event) => {
        activeSession.answer = event.target.value;
      });
      document.getElementById('submit-answer-btn').addEventListener('click', submitAnswer);
      document.getElementById('skip-question-btn').addEventListener('click', () => rateAndNext('wrong', 0));
      if (activeSession.mode === 'quick') startTimer();
      return;
    }

    const evaluation = activeSession.evaluation;
    el.sessionCard.innerHTML = `
      <div class="session-topline">
        <span>${progressText}</span>
        <span>自评反馈</span>
      </div>
      <div class="question-row-meta" style="padding-left:0; margin-bottom: var(--space-3)">
        <span class="mini-pill">${escapeHtml(question.categoryTitle)}</span>
        <span class="mini-pill">${escapeHtml(question.sectionTitle)}</span>
        <span class="mini-pill">Q${question.number}</span>
      </div>
      <h2 class="session-question">${escapeHtml(question.title)}</h2>
      <div class="evaluation">
        <div class="eval-grid">
          <div class="eval-tile"><strong>${evaluation.score}</strong><span>参考分</span></div>
          <div class="eval-tile"><strong>${evaluation.hitKeywords.length}/${question.keywords.length}</strong><span>关键词覆盖</span></div>
          <div class="eval-tile"><strong>${evaluation.structurePass}/${evaluation.structure.length}</strong><span>结构覆盖</span></div>
        </div>
        <div>
          <h3>关键词</h3>
          <div class="keyword-list">
            ${question.keywords.map((keyword) => `<span class="mini-pill ${evaluation.hitKeywords.includes(keyword) ? 'hit' : 'miss'}">${escapeHtml(keyword)}</span>`).join('')}
          </div>
        </div>
        <div>
          <h3>结构检查</h3>
          <div class="checklist">
            ${evaluation.structure.map((item) => `
              <div class="check-item ${item.pass ? 'pass' : ''}">
                <span class="check-dot"></span>
                <span>${escapeHtml(item.label)}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <h3>参考答案</h3>
          <div class="markdown-body">${renderReference(question)}</div>
        </div>
        <div class="status-actions">
          <button class="small-button" type="button" data-rate="wrong">不会</button>
          <button class="small-button" type="button" data-rate="fuzzy">模糊</button>
          <button class="small-button" type="button" data-rate="known">基本会</button>
          <button class="small-button primary" type="button" data-rate="mastered">熟练</button>
        </div>
      </div>
    `;
    el.sessionCard.querySelectorAll('[data-rate]').forEach((button) => {
      button.addEventListener('click', () => rateAndNext(button.dataset.rate, evaluation.score));
    });
  }

  function submitAnswer() {
    const question = getQuestion(activeSession.ids[activeSession.index]);
    activeSession.evaluation = evaluateAnswer(question, activeSession.answer || '');
    activeSession.submitted = true;
    renderSession();
  }

  function evaluateAnswer(question, answer) {
    const normalized = answer.toLowerCase();
    const hitKeywords = question.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
    const structure = [
      { key: 'core', label: '讲清核心概念或本质', pass: /是|指|核心|本质|定义|解决/.test(answer) || answer.length > 80 },
      { key: 'mechanism', label: '说明原理、流程或机制', pass: /流程|机制|原理|步骤|链路|先|再|然后|→/.test(answer) },
      { key: 'practice', label: '给出实践要点或项目经验', pass: /项目|实践|生产|上线|优化|指标|召回|延迟|成本|监控|评估/.test(answer) },
      { key: 'followUps', label: '能处理边界、风险或追问', pass: /如果|失败|不足|限制|风险|权衡|兜底|拒答|幻觉|安全/.test(answer) },
      { key: 'talkTrack', label: '表达像面试现场可直接说出口', pass: /我会|我做过|在.+项目|可以从|面试/.test(answer) || answer.length > 220 },
    ];
    const structurePass = structure.filter((item) => item.pass).length;
    const lengthScore = answer.length > 240 ? 15 : answer.length > 140 ? 10 : answer.length > 60 ? 6 : 0;
    const keywordScore = question.keywords.length ? Math.round((hitKeywords.length / question.keywords.length) * 60) : 0;
    const structureScore = Math.round((structurePass / structure.length) * 25);
    const score = Math.min(100, keywordScore + structureScore + lengthScore);
    return { score, hitKeywords, structure, structurePass };
  }

  function rateAndNext(status, score) {
    const questionId = activeSession.ids[activeSession.index];
    const record = getRecord(questionId);
    progress.questions[questionId] = {
      ...record,
      status,
      attempts: (record.attempts || 0) + 1,
      lastScore: score,
      lastTestedAt: new Date().toISOString(),
    };
    saveProgress();

    if (activeSession.index >= activeSession.ids.length - 1) {
      progress.sessions.unshift({
        id: activeSession.id,
        mode: activeSession.mode,
        questionIds: activeSession.ids,
        finishedAt: new Date().toISOString(),
      });
      progress.sessions = progress.sessions.slice(0, 30);
      saveProgress();
      activeSession = null;
      showToast('本轮完成，进度已保存');
      renderAll();
      return;
    }

    activeSession.index += 1;
    activeSession.answer = '';
    activeSession.submitted = false;
    activeSession.evaluation = null;
    activeSession.remaining = activeSession.mode === 'quick' ? 90 : null;
    renderAll();
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => {
      activeSession.remaining -= 1;
      const node = document.getElementById('session-timer');
      if (node) node.textContent = `${activeSession.remaining}s`;
      if (activeSession.remaining <= 0) {
        stopTimer();
        submitAnswer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function renderReference(question) {
    return BLOCK_TITLES
      .filter(([key]) => question.blocks[key])
      .map(([key, title]) => `<h3>${title}</h3>${renderMarkdown(question.blocks[key])}`)
      .join('');
  }

  function toggleFavorite(id) {
    const record = getRecord(id);
    progress.questions[id] = { ...record, favorite: !record.favorite };
    saveProgress();
    renderOverview();
  }

  function setQuestionStatus(id, status) {
    const record = getRecord(id);
    progress.questions[id] = {
      ...record,
      status,
      lastScore: STATUS[status]?.score || 0,
      lastTestedAt: new Date().toISOString(),
    };
    saveProgress();
    renderOverview();
    showToast(`已标记为：${STATUS[status]?.label || status}`);
  }

  function getQuestion(id) {
    return bank?.questions.find((question) => question.id === id);
  }

  function getRecord(id) {
    return progress.questions[id] || {};
  }

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '');
      if (parsed && parsed.version === 1) return parsed;
    } catch {}
    return { version: 1, questions: {}, sessions: [] };
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    window.setTimeout(() => el.toast.classList.remove('show'), 1800);
  }

  function modeLabel(mode) {
    if (mode === 'weak') return '弱项优先';
    if (mode === 'quick') return '快问快答';
    return '练习模式';
  }

  function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderMarkdown(markdown) {
    const lines = (markdown || '').replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let paragraph = [];
    let listType = null;
    let listItems = [];
    let tableRows = [];
    let codeLines = [];
    let inCode = false;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      html.push(`<p>${formatInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (!listItems.length) return;
      html.push(`<${listType}>${listItems.map((item) => `<li>${formatInline(item)}</li>`).join('')}</${listType}>`);
      listItems = [];
      listType = null;
    };
    const flushTable = () => {
      if (!tableRows.length) return;
      const rows = tableRows
        .filter((row) => !/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(row))
        .map((row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()));
      if (rows.length) {
        const [head, ...body] = rows;
        html.push(`
          <table>
            <thead><tr>${head.map((cell) => `<th>${formatInline(cell)}</th>`).join('')}</tr></thead>
            <tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        `);
      }
      tableRows = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.replace(/\s+$/g, '');

      if (line.startsWith('```')) {
        if (inCode) {
          html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
          codeLines = [];
          inCode = false;
        } else {
          flushParagraph();
          flushList();
          flushTable();
          inCode = true;
        }
        continue;
      }

      if (inCode) {
        codeLines.push(rawLine);
        continue;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        flushTable();
        continue;
      }

      if (/^\s*>/.test(line)) {
        flushParagraph();
        flushList();
        flushTable();
        html.push(`<blockquote>${formatInline(line.replace(/^\s*>\s?/, ''))}</blockquote>`);
        continue;
      }

      if (line.includes('|') && line.split('|').length >= 3) {
        flushParagraph();
        flushList();
        tableRows.push(line);
        continue;
      }

      const unordered = line.match(/^\s*[-*]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph();
        flushTable();
        const nextType = unordered ? 'ul' : 'ol';
        if (listType && listType !== nextType) flushList();
        listType = nextType;
        listItems.push((unordered || ordered)[1]);
        continue;
      }

      flushList();
      flushTable();
      paragraph.push(line);
    }

    flushParagraph();
    flushList();
    flushTable();
    if (inCode) html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    return html.join('');
  }

  function formatInline(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
