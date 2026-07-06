import fs from 'node:fs';
import path from 'node:path';

const SOURCE_PATH = process.argv[2] || String.raw`D:\AI_Workspace\work\llm_interview_prep\06_面试题精准解答.md`;
const OUT_PATH = process.argv[3] || path.join('ai-prep', 'data', 'interview-question-bank.json');

const CATEGORY_IDS = ['rag', 'agent', 'prompt', 'frameworks', 'finetune', 'engineering', 'scenarios'];
const CATEGORY_COLORS = ['blue', 'violet', 'emerald', 'cyan', 'amber', 'slate', 'rose'];
const CATEGORY_ICONS = ['RAG', 'Agent', 'Prompt', 'Tools', 'SFT', 'Ops', 'Case'];
const BLOCK_LABELS = new Map([
  ['核心概念', 'core'],
  ['原理机制', 'mechanism'],
  ['实践要点', 'practice'],
  ['常见追问', 'followUps'],
  ['面试话术', 'talkTrack'],
]);

const DOMAIN_TERMS = [
  'RAG', 'Retriever', 'Embedding', 'Rerank', 'Cross-Encoder', 'BM25', 'RRF', 'HyDE',
  'Query改写', 'Query扩展', 'Chunk', 'Chunk size', 'GraphRAG', '知识图谱', '向量数据库',
  'Qdrant', 'Milvus', 'FAISS', 'HNSW', 'LangChain', 'LlamaIndex', 'Agent', 'Tool Use',
  'Function Calling', 'ReAct', 'Plan-and-Execute', '多Agent', 'Memory', '短期记忆',
  '长期记忆', 'Prompt', 'Few-shot', 'CoT', 'Self-Consistency', '微调', 'SFT', 'LoRA',
  'QLoRA', 'PEFT', '推理加速', '量化', 'vLLM', 'llama.cpp', 'KV Cache', '幻觉',
  '拒答', '引用溯源', 'Recall', 'Precision', 'MRR', 'NDCG', '监控', '可观测性',
  '安全', 'Prompt Injection', '权限', '灰度发布', '缓存', '流式输出',
];

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_>#|~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBlock(text) {
  return text
    .replace(/^\s*---\s*$/gm, '')
    .replace(/^\n+|\n+$/g, '');
}

function extractBlocks(markdown) {
  const blocks = {
    core: '',
    mechanism: '',
    practice: '',
    followUps: '',
    talkTrack: '',
    extra: '',
  };
  let current = 'extra';
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  for (const line of lines) {
    const match = line.match(/^\*\*(核心概念|原理机制|实践要点|常见追问|面试话术)[：:]\*\*\s*(.*)$/);
    if (match) {
      current = BLOCK_LABELS.get(match[1]);
      if (match[2]) blocks[current] += `${match[2]}\n`;
      continue;
    }
    blocks[current] += `${line}\n`;
  }

  for (const key of Object.keys(blocks)) {
    blocks[key] = cleanBlock(blocks[key]);
  }
  return blocks;
}

function inferDifficulty(title, categoryId, sectionTitle) {
  const haystack = `${title} ${sectionTitle}`;
  if (categoryId === 'scenarios') return 'hard';
  if (/设计|优化|评估|生产|架构|安全|合规|多Agent|GraphRAG|可观测性|部署|性能|成本|故障/.test(haystack)) {
    return 'hard';
  }
  if (/什么是|基础|区别|流程|怎么选|优缺点/.test(haystack)) {
    return 'easy';
  }
  return 'medium';
}

function extractKeywords(question) {
  const text = `${question.title}\n${Object.values(question.blocks).join('\n')}`;
  const plain = stripMarkdown(text);
  const keywords = new Set();

  for (const term of DOMAIN_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'i');
    if (re.test(plain)) keywords.add(term);
  }

  const englishTerms = plain.match(/\b[A-Za-z][A-Za-z0-9+._/-]{1,}\b/g) || [];
  for (const term of englishTerms) {
    if (term.length >= 3 && !/^(and|the|for|with|from|this|that)$/i.test(term)) {
      keywords.add(term);
    }
  }

  if (keywords.size < 5) {
    const titleTerms = question.title
      .split(/[？?、/｜|，,：:（）()\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && s.length <= 12);
    for (const term of titleTerms) keywords.add(term);
  }

  return Array.from(keywords).slice(0, 10);
}

function parseBank(markdown) {
  const categories = [];
  const sections = [];
  const questions = [];
  const missingBlocks = [];
  let currentCategory = null;
  let currentSection = null;
  let currentQuestion = null;
  let buffer = [];

  const finishQuestion = () => {
    if (!currentQuestion) return;
    const blocks = extractBlocks(buffer.join('\n'));
    const plainText = stripMarkdown(`${currentQuestion.title}\n${Object.values(blocks).join('\n')}`);
    const question = {
      ...currentQuestion,
      blocks,
      plainText,
      keywords: [],
      difficulty: inferDifficulty(currentQuestion.title, currentQuestion.categoryId, currentQuestion.sectionTitle),
      isScenario: currentQuestion.categoryId === 'scenarios',
    };
    question.keywords = extractKeywords(question);

    for (const [label, key] of BLOCK_LABELS.entries()) {
      if (!question.blocks[key]) {
        missingBlocks.push(`${question.id} 缺少 ${label}`);
      }
    }

    questions.push(question);
    const category = categories.find((item) => item.id === question.categoryId);
    if (category) category.count += 1;
    const section = sections.find((item) => item.id === question.sectionId);
    if (section) section.count += 1;
    currentQuestion = null;
    buffer = [];
  };

  const lines = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n');

  for (const line of lines) {
    const categoryMatch = line.match(/^##\s+(.+)$/);
    if (categoryMatch) {
      finishQuestion();
      if (/面试题来源|参考资料/.test(categoryMatch[1])) {
        currentCategory = null;
        currentSection = null;
        continue;
      }
      const index = categories.length;
      currentCategory = {
        id: CATEGORY_IDS[index] || `category-${index + 1}`,
        title: categoryMatch[1].replace(/^[一二三四五六七八九十]+、/, ''),
        rawTitle: categoryMatch[1],
        count: 0,
        color: CATEGORY_COLORS[index] || 'blue',
        icon: CATEGORY_ICONS[index] || 'Topic',
      };
      categories.push(currentCategory);
      currentSection = null;
      continue;
    }

    const sectionMatch = line.match(/^###\s+(.+)$/);
    if (sectionMatch && currentCategory) {
      finishQuestion();
      currentSection = {
        id: `${currentCategory.id}-${String(sections.filter((s) => s.categoryId === currentCategory.id).length + 1).padStart(2, '0')}`,
        title: sectionMatch[1],
        categoryId: currentCategory.id,
        categoryTitle: currentCategory.title,
        count: 0,
      };
      sections.push(currentSection);
      continue;
    }

    const questionMatch = line.match(/^####\s+Q(\d+):\s*(.+)$/);
    if (questionMatch && currentCategory && currentSection) {
      finishQuestion();
      const number = Number(questionMatch[1]);
      currentQuestion = {
        id: `q${String(number).padStart(3, '0')}`,
        number,
        title: questionMatch[2].trim(),
        categoryId: currentCategory.id,
        categoryTitle: currentCategory.title,
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
      };
      continue;
    }

    if (currentQuestion) buffer.push(line);
  }

  finishQuestion();
  return {
    meta: {
      source: path.basename(SOURCE_PATH),
      generatedAt: new Date().toISOString(),
      total: questions.length,
      categoryCount: categories.length,
      sectionCount: sections.length,
    },
    categories,
    sections,
    questions,
    diagnostics: {
      missingBlocks,
    },
  };
}

if (!fs.existsSync(SOURCE_PATH)) {
  console.error(`Source markdown not found: ${SOURCE_PATH}`);
  process.exit(1);
}

const markdown = fs.readFileSync(SOURCE_PATH, 'utf8');
const bank = parseBank(markdown);
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');

console.log(`Generated ${OUT_PATH}`);
console.log(`Questions: ${bank.questions.length}`);
console.log(`Categories: ${bank.categories.length}`);
console.log(`Sections: ${bank.sections.length}`);
for (const category of bank.categories) {
  console.log(`- ${category.title}: ${category.count}`);
}
if (bank.questions.length !== 128) {
  console.error(`Expected 128 questions, got ${bank.questions.length}`);
  process.exit(1);
}
if (bank.diagnostics.missingBlocks.length) {
  console.warn(`Missing blocks: ${bank.diagnostics.missingBlocks.length}`);
  console.warn(bank.diagnostics.missingBlocks.slice(0, 20).join('\n'));
}
