# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Technical peers, AI/Agent researchers, engineering leads, and collaborators visiting `https://fjnuslw.github.io/` to evaluate Linwei Song's (宋林蔚) actual engineering depth, research publications, post-training experiments, and competition work. They arrive from GitHub, ACL Anthology / OpenReview, Kaggle, or direct referral, and want verifiable facts, clear architectures, and direct entry points to papers, repos, weights, and notes — not decorative personal-brand prose.

## Product Purpose

Serve as Linwei Song's canonical public technical portfolio and research archive in Chinese (`zh-CN`), presenting his current focus on Agent post-training (SFT / distillation / GRPO), multi-hop retrieval & Agentic RAG, production Agent systems, competition solutions, and engineering notes. Success means a technical visitor grasps his core research and engineering trajectory within seconds, inspects verifiable evidence (papers, Kaggle reports, open-source repos, Hugging Face weights, fixed-protocol evaluations), and never hits stale positioning, cluttered widgets, or unsubstantiated claims.

## Positioning

Unlike generic developer portfolios built around boilerplate slogans, mock demos, and unverified badges, this site anchors every claim directly to concrete research artifacts, experimental protocols, and reproducible public repositories — spanning published EMNLP 2026 research, active industrial Agent post-training (3D live-tour datasets, skill hot-swap harnesses, 8×A800 GRPO), top-3.9% Kaggle silver-zone solutions, and open-weight LoRA releases with explicit scope and boundary disclosures.

## Operating Context

- Static HTML/CSS/JS site hosted on GitHub Pages at `https://fjnuslw.github.io/`.
- Built via `node tools/build-site.mjs` into `dist/` using an explicit public whitelist (`tools/site-manifest.mjs`); validated via `node tools/validate-site.mjs` and `git diff --check`; previewed locally via `node tools/preview-site.mjs`.
- Must work cleanly on desktop and 320px mobile viewports, with keyboard navigation, touch input, no-JS fallback, `prefers-reduced-motion`, and print support.
- No backend server, no trackers, no third-party remote font requests, and no browser-side LLM/model API calls.

## Capabilities and Constraints

- **Public scope boundary (confirmed)**: Technical researcher & engineer homepage featuring latest publications, three engineering internships (明源云, 友达光电, 福建新意科技), Kaggle & national competitions, flagship open-source project (`WenQu / RepoSocratic`), and technical notes. Must NOT include phone numbers, ID photos, job-seeking banners ("可连续实习 6 个月以上", "正在寻找实习"), resume downloads, or interview-prep materials.
- **Content refresh & pruning (confirmed)**: Retire the "数字花园 / 林蔚手记 / 园主" persona framing, 3D flip-book folio, homepage mascot Playground widget, and ambient particle distractions. Move legacy projects (`星途知汇`, `Local Window Copilot`, `video-to-knowledge`, `SilentDeck`, `Research-to-Spec`) out of primary homepage/featured slots into a subordinate archive while preserving all existing public URLs (`projects/local-window-copilot.html`, `projects/research-to-spec.html`, `projects/reposocratic.html`, `demos/local-window-copilot/index.html`, and all 6 historical articles under `blog/*.html`) so no inbound links break.
- **Technical & validation constraints**:
  - Static HTML/CSS/JS; shared styles in `css/style.css` and `css/portfolio.css`; shared scripts in `js/main.js`.
  - Every formal public page (`publicPages` in `tools/site-manifest.mjs`) requires `lang="zh-CN"`, `viewport`, unique `<title>`, exact canonical URL under `https://fjnuslw.github.io/`, exactly one `<h1>`, `<main>`, `.skip-link` (except standalone demo), sequential heading hierarchy (`h1 -> h2 -> h3` without skipping levels), valid `alt` on images, and `<title>` + `<desc>` on non-decorative SVGs.
  - All 6 historical blog posts in `blog/*.html` preserve their original text, dates, URLs, and `blog/posts.json` entries (with `blog.html` keeping the exact `6 篇公开笔记` count validated by `tools/validate-site.mjs`).
  - Preserve untracked/uncommitted author work in `resume-redesign/` and never ship `.private/`, `ai-prep/`, `resume-redesign/`, `specs/`, `docs/`, `tmp/`, or `.impeccable/` into `dist/`.
  - Keep factual precision: distinguish published vs. under-review papers, public/synthetic validation sets vs. enterprise internal data, and fixed-protocol evaluation denominators/boundaries.

## Brand Commitments

- **Author identity**: 宋林蔚 (Linwei Song), M.Eng. candidate in Software Engineering at Fujian Normal University (福建师范大学, 2025.09–2028.06; 2025 & 2026 First-Class Academic Scholarships, 2026 Merit Student); B.Eng. in Computer Science & Technology, Zhicheng College of Fuzhou University (福州大学至诚学院, 2020.09–2024.06). Base: 福建 · 福州.
- **Voice**: Direct, technical, evidence-first, grounded in specific systems, mechanisms, and honest boundaries — explicitly rejecting literary/poetic "digital garden" affectation and generic AI-generated portfolio clichés.
- **Contact & public handles**: GitHub (`https://github.com/fjnuslw`), Email (`1147214246@qq.com`), OpenReview (`https://openreview.net/profile?id=%7ELinwei_Song1`).

## Evidence on Hand

- **Research publications**:
  - *Intrinsic Attention as Navigator: A Non-Generative Retrieval Method for Multi-Hop Queries* (IN-Retriever) — Findings of EMNLP 2026, Published, First Author. URL: `https://aclanthology.org/2026.findings-emnlp.1449/`. Method: BFS attention-head selection + Beam Search + orthogonal-projection residual reranking; training-free, non-generative; Qwen3-Embedding-4B outperforms two 7B/8B embedding baselines on MuSiQue / 2Wiki evidence recall.
  - *ESRA: Training-Free Multi-Hop Agentic RAG with Explicit Evidence-State Transitions* — NAACL, Under Review, Co-First Author with Advisor. OpenReview author page: `https://openreview.net/profile?id=%7ELinwei_Song1`. Method: branch/dependency planning, `taskState` execution tracking, Search/Probe + LLM candidate verification with rejection/query-rewrite loop and step-wise confirmed evidence retention.
- **Engineering internships**:
  - **明源云 · 橙果算法组 | Agent 算法实习** (2026.10 – 至今): CarTourAgent 3D live-tour interaction dataset (multi-turn danmaku + robot waypoint scheduling across proactive marketing, Q&A, interruption recovery, cold-start engagement); Harness iterative training framework decoupling runtime, user-simulator Agent, and hot-swappable Skills for cross-brand/auto/real-estate transfer (1,000 trajectories/round, API-assisted expert calibration of thinking & tool calls, isolated replay, incremental LoRA SFT + closed-loop eval); 8×A800 SFT cold-start + multi-branch GRPO with same-origin group sampling, action-masked policy gradient, hybrid outcome/process reward, and hard-constraint violation veto.
  - **友达光电 · 卓越工程师计划 | AI 专案实习生** (2026.07 – 2026.08): Industrial multimodal Agent for FIDM new-product SOP authoring via LangGraph + MCP into AUO native `sAgent` platform (exploded-view + BOM structured parsing); independently built open-source `OpenSOP-Agent` (`https://github.com/fjnuslw/OpenSOP-Agent`) on public/synthetic data with neuro-symbolic guardrails (constrained semantics decoupled from master-data ground truth, citation whitelist), Critic–Repair bounded self-repair, VLM candidate scoring, LangGraph two-level process/quality interrupt-resume, 40 OI / 324 Step validation set.
  - **福建新意科技有限公司 | 大模型应用开发** (2025.07 – 2026.02): Private enterprise inference architecture on self-hosted Dify decoupling heterogeneous compute (CPU Xinference for multi-way embedding/reranking, GPU vLLM dedicated to Qwen-32B); hierarchical tree indexing + parent-child multi-granularity indexing with level metadata; Golden Cases ablation for layered failure attribution (retrieval recall miss vs. generation hallucination).
- **Competitions & honors**:
  - **Kaggle · Name That LLM** (2026.11): Public BA 0.703, Public Silver Zone (255 / 6,514, Top 3.9%). Multi-layer readout + two-stage LoRA on Qwen3.8-27B / Qwen3.5-9B (dev OOF BA 0.688 / 0.671), ensemble with strong baseline, dual-T4 length-batched inference cutting forward latency by 34.4% / 30.4%. Report: `https://www.kaggle.com/code/fjnulinweisong/name-that-llm-g07-technical-report`; Code: `https://github.com/fjnuslw/name-that-llm`.
  - **Kaggle · Gemma 4 Developer Agent** (2026.10 – 2026.11): Public 0.18, Top 23%. Coding Agent trajectory SFT freezing 990 audited ADK turns; Gemma-31B 4-GPU FSDP2 27k-token LoRA + vLLM export. Report: `https://www.kaggle.com/code/fjnulinweisong/gemma-agent-trajectory-sft`; Code: `https://github.com/fjnuslw/gemma-agent-trajectory-sft`.
  - **第十七届蓝桥杯 · 人工智能赛 智能体开发大学组** (2026): National First Prize (Rank 5 nationally), Fujian First Prize (Rank 1 provincially), FastGPT × Feishu. Certificates: `awards/lanqiao-17-national-agent-dev.pdf`, `awards/lanqiao-17-fujian-agent-dev.pdf`.
- **Flagship independent project**:
  - **WenQu / RepoSocratic** (2026.08 – 至今): Personalized interview Agent & post-training pipeline. Pi + Harness + read-only repo tools for multi-turn source evidence collection; trajectory distillation (`ms-swift` / LoRA SFT) over 20 repos, 100 scenarios, 820 targets, vLLM Top-32 logprobs, CE + grouped KL from Qwen3.8-27B → Qwen3.5-9B (SP2/FSDP2, activation checkpointing, chunked loss, up to 117k tokens on 2 GPUs); online Agentic GRPO with action mask preserving context (73 rollouts, 67 updates, checkpoint recovery); fixed-protocol evaluation on 24 out-of-distribution repo families (96 tasks × 3 models = 288 trajectories, 2026-09-25 snapshot) reaching 86.5% completion (83/96, +10.4 pp over 76.0% base; +1 task over 85.4% K2 distillation). Note: WenQu online sessions do not yet call the 9B model service live. Links: `https://github.com/fjnuslw/WenQu`, `https://github.com/fjnuslw/RepoSocratic`, `https://huggingface.co/xiongsir1/reposocratic-interviewer`, detail page `projects/reposocratic.html`.
- **Historical notes (preserved intact)**: 6 technical articles in `blog/*.html` indexed in `blog/posts.json` (dates 2026-07-04 to 2026-08-13).
- **Archived earlier projects (preserved URLs, subordinate prominence)**: `Local Window Copilot` (`projects/local-window-copilot.html`, `demos/local-window-copilot/index.html`), `星途知汇` (`https://github.com/fjnuslw/xingtu-knowledge-platform`), `Research-to-Spec` (`projects/research-to-spec.html`), `video-to-knowledge-skill`, `SilentDeck`.
- **Absences not to fabricate**: Do not invent unreleased paper PDFs for ESRA, enterprise internal screenshots/metrics from 明源云/友达/新意, live model inference on this static website, or unverified third-party testimonials.

## Product Principles

1. **Evidence over atmosphere**: Lead every project, paper, and practice entry with concrete mechanisms, metrics with denominators/conditions, and direct links to verifiable artifacts (papers, repos, weights, Kaggle reports, certificates).
2. **Focus on the present trajectory**: Center primary navigation and first-viewport hierarchy on current Agent post-training, retrieval research, industrial Agent engineering, and Kaggle work; keep older exploratory works accessible as archive without diluting signal.
3. **Honest technical boundaries**: Explicitly separate published vs. under-review status, public/synthetic validation vs. internal enterprise data, and offline trained weights vs. online product integration.
4. **Zero-dependency resilience**: Deliver complete semantics, readability, and navigation in pure static HTML/CSS without remote font calls, server runtimes, or JS-gated core content.

## Accessibility & Inclusion

- WCAG AA contrast for all body text, metadata, badges, and callouts.
- Full keyboard navigation, visible focus states, skip links, touch-friendly hit targets, 320px viewport resilience (no horizontal page overflow; scoped horizontal scroll for wide tables/code), `prefers-reduced-motion`, no-JS usability, and clean print layout.
