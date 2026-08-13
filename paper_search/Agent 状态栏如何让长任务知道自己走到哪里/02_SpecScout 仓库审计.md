# SpecScout / Research-to-Spec 仓库审计

> 状态说明：正文记录 2026-08-13 实施前的仓库快照，用来保留问题发现过程。主任务随后完成了一轮修正；最终状态见文末“实施后的复核”。

- 审计日期：2026-08-13
- 仓库：`D:\AI_Workspace\SpecScout`
- 远程地址：`https://github.com/fjnuslw/research-to-spec.git`
- 审计提交：`ada7eee`（`main`，与 `origin/main` 一致）
- 发布版本：`v0.1.0-alpha.1`
- 审计范围：README、Skill 元数据与正文、脚本、模板、样例、测试、评估协议、CI、安装入口、发布状态
- 审计方式：读取源码与产物，运行只读校验命令；没有修改或推送 SpecScout 仓库

## 一、结论摘要

Research-to-Spec 已经具备一个可试用 Alpha Skill 的主要骨架：触发描述清楚，`SKILL.md` 保持精简，详细协议下沉到 `references/`，三个 Python 脚本只依赖标准库，样例能够从来源一路追踪到计划与验证项，CI 也在当前提交上通过。

它最有价值的能力，是把一次长任务的依据保存在文件中：研究问题、来源、发现、决定、需求、任务和验证分别拥有稳定编号。聊天中断后，后续 Agent 仍能沿着编号恢复判断过程。

当前缺口集中在“现在走到哪里”。仓库保存了完整证据，却没有生成一份短小、统一、可校验的当前状态。相同进度分别散落在 `manifest.json`、`INDEX.md`、`TASKS.md`、`VERIFICATION.md` 和 `traceability.csv` 中，需要 Agent 自己重新拼装。

现有样例已经暴露出状态含义被挤在同一个字段里的问题：

- `manifest.json` 的状态为 `specified`；
- `INDEX.md` 写着“specified; implementation intentionally not started”；
- 16 条追踪记录的状态均为 `planned`；
- 三项任务仍未勾选；
- 三项验证仍为 `pending`；
- 用户授权边界是“只调研和制定规格”。

这些内容单独看都说得通，合在一起需要区分三个维度：材料成熟到哪一步、执行进行到哪一步、用户授权允许走到哪一步。建议下一版新增一份由现有文件自动生成的状态快照，把这三个维度拆开。

## 二、仓库状态与发布状态

### 2.1 Git 状态

审计开始时运行：

```text
git status --short --branch
## main...origin/main
```

当时没有已修改文件，也没有未跟踪文件。

审计过程中，共享工作区出现以下未跟踪内容：

```text
.tmp-installed-skill-smoke/
docs/assets/jsonl-sqlite-case.svg
docs/assets/workflow-overview.svg
docs/assets/workflow-overview.zh-CN.svg
```

这些内容由其他并行任务创建，本审计没有生成或编辑它们。后续提交前应由主任务逐项确认来源、用途和是否完成，避免把临时安装目录带入提交。

### 2.2 远程发布

只读查询确认：

- 远程标签 `v0.1.0-alpha.1` 指向 `ada7eee`；
- GitHub Release 已发布，类型为 Pre-release；
- Release 页面：`https://github.com/fjnuslw/research-to-spec/releases/tag/v0.1.0-alpha.1`；
- 当前提交最近两次 GitHub Actions 运行结果均为 `success`。

README、CHANGELOG、标签和 Release 的版本号一致。仓库中尚无单独的机器可读包版本文件；Agent Skill 规范也不强制提供该文件。Alpha 阶段可以继续依赖标签，正式发布前适合加入版本一致性检查。

## 三、当前已经具备的功能

### 3.1 Skill 包装

目录符合 Agent Skill 的常见结构：

```text
skills/research-to-spec/
├── SKILL.md
├── agents/openai.yaml
├── scripts/
├── references/
└── assets/
```

做得较好的地方：

- `SKILL.md` 只有 61 行，远低于 500 行建议上限；
- YAML frontmatter 只包含 `name` 和 `description`；
- Skill 名称与目录名一致，均为 `research-to-spec`；
- description 同时写清功能、触发场景和跳过简单任务的条件；
- 详细字段、来源分级和完成条件集中在 `references/protocol.md`；
- Skill 内没有额外 README、安装指南或 Changelog；面向使用者的文档留在仓库根目录；
- `agents/openai.yaml` 包含 `display_name`、长度合规的 `short_description` 和显式提到 `$research-to-spec` 的 `default_prompt`。

### 3.2 三种任务重量

Skill 将任务分为 Lite、Standard 和 Deep：

- Lite：一两个范围明确的不确定点；
- Standard：多个相关问题，需要完整来源到任务的连接；
- Deep：高风险或多个相互独立的问题，可使用有限数量的并行研究者。

它还要求普通小改动直接处理，避免每次都创建完整材料树。这条路由规则对控制文档负担很重要。

### 3.3 授权边界

`SKILL.md` 明确区分两类请求：

- 调研、审查、审核、规划：保持只读，交付证据、规格或计划后停止；
- 构建、修改、修复、实施：得到明确授权后才进入代码阶段。

仓库测试还会检查这两段关键说明是否仍然存在。这个设计能防止一份调研计划被 Agent 当作修改产品代码的授权。

### 3.4 文件化证据链

默认产物分为两棵树：

```text
search/<slug>/
  INDEX.md
  manifest.json
  synthesis.md
  traceability.csv
  questions/<lane>/
    question.md
    findings.md
    sources.jsonl
    artifacts/

specs/<slug>/
  SPEC.md
  PLAN.md
  TASKS.md
  VERIFICATION.md
```

稳定编号覆盖整条路径：

```text
Q → S → F → D → R → T → code → V
```

每个编号承担一种职责：

- `Q-*`：需要回答的问题；
- `S-*`：资料或本地实验；
- `F-*`：资料能够支持的发现；
- `D-*`：项目接受、拒绝或暂定的选择；
- `R-*`：可以验收的需求；
- `T-*`：可执行任务；
- `V-*`：实际运行后的验证记录。

### 3.5 确定性脚本

#### `init_case.py`

已实现：

- 创建证据树和四份规格文件；
- 支持 Lite、Standard、Deep；
- 支持多个 `--question`；
- 对 slug 做 Unicode 规范化和可移植处理；
- 规避 Windows 保留设备名；
- 拒绝覆盖已有 case 或 spec 目录；
- 拒绝 `--search-root`、`--spec-root` 逃出项目根目录；
- 创建失败时回滚本次新建的两棵目录；
- 打印 `Q-*` 到实际目录的映射，缓解长目录名难输入的问题。

#### `add_source.py`

已实现：

- 将一条来源元数据追加到指定问题的 `sources.jsonl`；
- 可通过 case 目录和 `--question Q-001` 定位问题；
- 自动生成下一个来源编号；
- 校验来源类型、证据权重、URL、时间和 SHA-256；
- 保存源码或附件时要求填写许可证；
- 只记录元数据，不下载网页，也不执行来源中的代码；
- 限制摘要最多 800 字符，降低整页转载风险；
- 拒绝最终账本为符号链接、重解析点或硬链接；
- 在 Windows 和 POSIX 分别通过文件句柄复核最终写入目标；
- 写入后执行 flush 和 fsync。

#### `validate_case.py`

已实现：

- 检查 manifest 必填字段、状态枚举、问题路径和时间格式；
- 检查来源 JSONL、编号唯一性、来源类型、权重、状态和摘要长度；
- 检查附件路径、许可证与内容哈希；
- 检查发现、决定、需求、任务、验证的声明编号；
- 检查 Markdown 中写出的上下游关系是否也存在于追踪表；
- 拦截 CSV 单元格公式前缀；
- 对 `verified` 行要求任务已勾选、代码路径存在、验证方法与观察值存在、结果为 pass；
- 区分普通模式的警告和 `--strict` 模式的错误；
- 支持 JSON 输出，适合 CI 和后续工具读取。

### 3.6 样例与评估材料

仓库包含一个完整的 JSONL 与 SQLite 选择案例：

- 3 个研究问题；
- 15 条来源；
- 4 条发现；
- 3 个决定；
- 3 条需求；
- 3 个计划任务和验证项；
- 16 条追踪记录；
- 1 个可重复运行的 Git 合并实验。

样例保留了 SQLite 的事务优势，也限制了本地 Git 实验的解释范围。样例明确披露：独立 Agent 在综合阶段因服务额度中断，后续材料由维护者完成。因此它适合证明文件契约和路线选择，暂时不能证明完整自治运行能力。

`evals/README.md` 已给出对照实验设计、任务类型、指标和盲审量表。它目前是一份评估协议，尚无成组的 baseline 结果、Skill 结果和统计汇总。

## 四、必须修复的包装缺口

以下项目建议在扩大宣传或把“Agent 状态管理”作为主卖点前完成。

### P0-1：把进度拆成三个正交字段

当前 `manifest.status` 同时承受材料阶段、执行进度和授权边界，导致样例在 `specified` 与 `planned` 之间出现语义摇摆。

建议拆分：

```text
artifact_stage: researching | synthesized | specified | planned | verified
execution_state: not_started | active | blocked | complete | stale
authorization: research_only | implementation_authorized
```

样例可以准确表达为：

```text
artifact_stage = planned
execution_state = not_started
authorization = research_only
```

这三个字段分别回答：材料准备到哪一步、代码执行到哪一步、用户允许做到哪一步。

### P0-2：状态快照必须自动派生

目前需要手动同步：

- `manifest.json` 的 case 状态和问题状态；
- `INDEX.md` 的复选框、当前综合和下一关；
- `TASKS.md` 的完成状态；
- `VERIFICATION.md` 的结果；
- `traceability.csv` 的阶段；
- `updated_at`。

手工同步在长任务和多 Agent 场景中容易遗漏。建议增加 `derive_status.py`，读取以上文件并生成短状态快照。快照不承担新的事实来源，任何字段都能追溯到现有材料。

同时增加：

```text
python scripts/derive_status.py search/<slug> --project-root . --write
python scripts/derive_status.py search/<slug> --project-root . --check
```

`--check` 比较现有快照与重新派生结果，发现漂移时返回非零状态码。

### P0-3：补跨平台 CI

`add_source.py` 包含两条差异明显的安全写入实现：Windows 使用 Win32 文件句柄，POSIX 使用 `O_NOFOLLOW`。当前 GitHub Actions 只运行：

```text
ubuntu-latest + Python 3.11
```

这无法覆盖 Windows 分支。README 又明确提到 Windows 和 Linux，测试代码也包含符号链接、硬链接与路径安全逻辑。

最低矩阵建议：

```yaml
os: [ubuntu-latest, windows-latest]
python: ["3.11", "3.13"]
```

macOS 可以放入定期任务或发布前任务。符号链接测试因权限被跳过时，CI 摘要应明确显示跳过数量。

### P0-4：验证真实安装后的副本

CI 目前直接运行仓库中的 `skills/research-to-spec`。README 的主要入口是：

```text
npx skills add fjnuslw/research-to-spec
```

尚无 CI 步骤证明安装器能找到嵌套 Skill、复制完整 assets/references/scripts，并让复制后的脚本脱离仓库根目录继续工作。

建议增加一次临时目录 smoke test：

1. 从干净目录执行安装；
2. 确认安装后存在 `SKILL.md`、`agents/openai.yaml`、`references/protocol.md`、三个脚本和全部模板；
3. 从安装目录外调用 `init_case.py`；
4. 添加一条来源；
5. 运行普通与严格校验；
6. 删除临时目录；
7. 在 Windows 与 Linux 各跑一次。

网络安装测试可以放在 release workflow；普通 PR CI 还应保留一个无网络的“复制 Skill 到临时安装目录”测试。

### P0-5：补同一问题并发写入的可观察失败

协议声明“一个问题目录同一时刻只有一个逻辑写入者”，脚本目前没有锁或 compare-and-append。两个进程可能同时扫描出相同的下一个 `S-*` 编号，然后连续写入重复编号。后续 validator 能发现重复项，写入当下仍可能都报告成功。

Alpha 文档已经将同 lane 并发列为不支持范围，这降低了风险。若要将“并行 Agent 管理”作为展示重点，至少应提供一种可观察保护：

- 创建独占锁文件并在退出时释放；或
- 调用者必须传入预分配的来源编号，写入前后复核；或
- 使用临时文件加原子替换维护一份带版本号的 ledger。

选型前先写双进程测试，要求一个写入成功，另一个清楚地失败或等待；不能让两次调用都返回成功并留给事后校验处理。

## 五、建议的状态快照契约

### 5.1 设计目标

状态快照用于每轮 Agent 开始工作时快速回答七个问题：

1. 这是什么 case？
2. 用户允许做到哪一步？
3. 材料准备到哪一阶段？
4. 当前正在处理什么？
5. 哪些内容已经完成？
6. 卡在哪里？
7. 下一步的检查关卡是什么？

完整研究材料仍留在原文件中。状态快照控制在约 2 KB 内，适合每轮加载到上下文；具体来源、发现和规格按需读取。

### 5.2 建议文件

建议在 case 根目录生成：

```text
search/<slug>/STATUS.json
```

如需方便人类阅读，可以由同一个脚本附带渲染 `STATUS.md`。两个文件都应带有“generated，禁止手改”的说明。

### 5.3 建议字段

```json
{
  "schema_version": "0.2",
  "case_id": "RTS-20260812-jsonl-vs-sqlite",
  "title": "Choose evidence-ledger storage for Research-to-Spec v0.1",
  "artifact_stage": "planned",
  "execution_state": "not_started",
  "authorization": "research_only",
  "focus": {
    "kind": "gate",
    "id": "G-IMPLEMENTATION-AUTHORIZATION",
    "title": "Wait for explicit implementation authorization"
  },
  "progress": {
    "questions": {"answered": 3, "total": 3},
    "decisions": {"accepted": 3, "total": 3},
    "requirements": {"specified": 3, "total": 3},
    "tasks": {"complete": 0, "total": 3},
    "verifications": {"pass": 0, "fail": 0, "pending": 3}
  },
  "active_lanes": [],
  "blockers": [],
  "stale_sources": [],
  "next_gate": {
    "action": "request_authorization",
    "condition": "User explicitly requests implementation",
    "then_focus": "T-001"
  },
  "checkpoint": {
    "updated_at": "2026-08-13T07:24:49+08:00",
    "git_commit": "ada7eee",
    "derived_from": [
      "manifest.json",
      "traceability.csv",
      "specs/jsonl-vs-sqlite/TASKS.md",
      "specs/jsonl-vs-sqlite/VERIFICATION.md"
    ]
  }
}
```

### 5.4 派生规则

建议将规则写进 `references/protocol.md`，并由脚本实现：

- `artifact_stage` 由现有材料和追踪表最高完整阶段计算；
- `execution_state` 由任务复选框、验证结果和 blocker 计算；
- `authorization` 由创建 case 时的明确参数或人工确认记录读取；
- `focus` 最多一个，用于告诉下一轮 Agent 当前主目标；并行问题放在 `active_lanes`；
- `progress` 只保存计数，不复制长文本；
- `blockers` 必须说明等待的人或外部条件；
- `stale_sources` 保存来源编号，详细信息仍在 `sources.jsonl`；
- `next_gate` 写可观察条件，避免“继续研究”这类没有停止点的描述；
- `updated_at` 必须带时区；
- 任务重新打开、来源变旧或实现推翻决定时，允许阶段回退，并记录原因；
- 快照内不保存网页正文、私密路径、凭据或大段研究结论。

### 5.5 更新时机

状态快照在以下时机重新生成：

- case 初始化完成后；
- 问题从 pending 进入 researching、answered、blocked 或 stale 后；
- 综合决定接受、拒绝或改为 provisional 后；
- 规格或任务计划完成后；
- 开始和结束一个任务后；
- 验证出现 pass、fail 或 blocked 后；
- 用户扩大或收回实施授权后；
- 会话交接、压缩上下文或准备提交前。

### 5.6 与 Agent 上下文的关系

每轮恢复建议按以下顺序读取：

```text
STATUS.json
  ↓
INDEX.md 与 synthesis.md
  ↓
当前 focus 对应的问题、决定、需求或任务
  ↓
需要核对时再打开 sources.jsonl 与附件
```

这样既保留完整证据，又能避免每轮把整个研究树塞进上下文。

## 六、安全边界审计

### 6.1 已有保护

当前实现已经覆盖多项关键风险：

- 外部网页、Issue、论坛和仓库内容被视为不可信数据；
- Skill 明确禁止执行来源内的指令、下载脚本和自动安装依赖；
- `add_source.py` 只记录来源元数据；
- case 与 spec 目录被限制在项目根目录内；
- 已有路径时拒绝覆盖；
- 来源账本最终写入目标接受句柄级复核；
- 符号链接、Windows 重解析点和多硬链接账本被拒绝；
- 保存源码或附件需要许可证；
- 附件可以记录 SHA-256 并由 validator 复核；
- CSV 公式前缀被拒绝；
- 验证记录必须包含实际方法、命令或过程、观察值和 pass 结果；
- `.gitignore` 已排除本地缓存、环境文件和问题附件目录中的未授权内容。

### 6.2 仍需明确或补测的边界

#### 同 lane 并发

当前无互斥机制，属于已文档化但未强制执行的限制。并行研究应保持“一条 lane 一个写入者”。

#### `file://` 来源

本地实验允许 `file://` URL。公开 case 中可能因此暴露用户名、磁盘结构或私人文件位置。建议公开材料优先使用 `local://<experiment-name>`，附件只记录项目相对路径。

#### 时间字段

`datetime.fromisoformat` 会接受不带时区的时间。来源新旧判断需要可比较时间，建议 `retrieved_at` 强制包含 `Z` 或明确偏移，并拒绝明显位于未来的时间。

#### 空白字段

`--title` 和 `--summary` 虽然是必传参数，当前脚本在追加前没有统一拒绝纯空白字符串。严格校验会在之后发现问题。更好的体验是在写入前直接拒绝，并保证失败不改变账本。

#### GitHub Actions 供应链

CI 使用 `actions/checkout@v6` 和 `actions/setup-python@v6` 的主版本标签。建议固定到经过核对的完整 commit SHA，并由 Dependabot 或 Renovate 提交升级 PR。

#### 秘密扫描

SECURITY 的发布清单要求扫描秘密，CI 尚未看到对应步骤。可以增加 Gitleaks 或 GitHub Secret Scanning；启用第三方 Action 时仍应固定 SHA。

## 七、兼容性边界

### 7.1 Python 与操作系统

- 脚本使用现代类型语法和 `Path.write_text(..., newline=...)`，README 与 CI 以 Python 3.11 为主；
- 当前 CI 只证明 Ubuntu + Python 3.11；
- Windows 安全写入路径有专门实现，但缺少远端 Windows 测试证明；
- macOS 预期走 POSIX 分支，尚无 CI 结果；
- 网络文件系统上的并发写入不在支持范围内。

README 应把“设计支持”“CI 已验证”“尚未验证”分开列出，并附日期与版本。

### 7.2 规格工具

Skill 会尽量复用项目已有的 Spec Kit、OpenSpec、Kiro 或其他规格目录。当前 validator 只支持仓库自带的四文件默认契约。文档已经如实说明此限制。

在增加兼容性声明前，每一种布局至少需要一个固定 fixture，证明：

- 如何检测布局；
- 哪些文件归宿主工具管理；
- 稳定编号放在哪里；
- 原文件如何保留；
- 严格校验如何运行；
- 测试使用的宿主版本。

### 7.3 Agent Skills 安装器

当前 README 提供 Agent Skills CLI 与 Codex 手动复制两种入口。还缺：

- CLI 安装后的自动化 smoke test；
- 支持过的 installer/host 精确版本；
- 升级与卸载说明；
- 重装时如何处理用户已修改的 Skill 副本；
- Release 标签与安装命令的固定版本示例。

Alpha 阶段可以继续推荐显式调用 `$research-to-spec`。等多个宿主完成实测后，再给出兼容矩阵。

## 八、README 与项目包装建议

### 8.1 当前优点

- 中英文 README 均有完整安装、流程、案例、限制和安全说明；
- 首屏明确标注 Alpha，未承诺生产力提升；
- 一分钟概览、真实案例和目录树能让第一次访问者理解用途；
- Release、CI、License 与 Agent Skills badge 齐全；
- README 没有掩盖独立 Agent 中断和研究-only 边界；
- CONTRIBUTING、SECURITY、CHANGELOG、评估协议和发布计划均已存在。

### 8.2 可增强项

#### 首屏再压缩

README 已接近 270 行。可以把首屏控制为：一句问题、一张状态/证据链图、一个安装命令、一个调用示例、一个真实结果链接。竞品调研和传播计划留在 `docs/`。

#### 展示“中断后恢复”

现有案例主要展示存储选择。下一份案例可以专门演示：

1. Agent 完成两个问题后中断；
2. 新 Agent 只读 `STATUS.json`、索引和当前 focus；
3. 它准确恢复到第三个问题；
4. 实现结果推翻一个暂定决定；
5. 状态快照、规格和追踪表一起更新。

这会直接支撑“Agent 状态栏”的文章主题。

#### 增加 UI 素材

`agents/openai.yaml` 的图标与品牌色是可选字段。若准备公开推广，可以增加小图标、大图标和品牌色；素材应放在 Skill 自身的 `assets/` 中，并确认安装后相对路径有效。

#### 发布入口固定版本

README 可以同时给出：

```text
npx skills add fjnuslw/research-to-spec
npx skills add fjnuslw/research-to-spec@v0.1.0-alpha.1
```

第二条命令只有在目标 CLI 实测支持标签语法后再发布，避免写出未经验证的安装方式。

## 九、测试与验证结果

### 9.1 本次成功运行

#### 官方 Skill 快速校验

```text
python C:\Users\xiongsir\.codex\skills\.system\skill-creator\scripts\quick_validate.py \
  D:\AI_Workspace\SpecScout\skills\research-to-spec

Skill is valid!
```

#### 仓库自带元数据校验

```text
python tools/check_skill.py skills/research-to-spec

PASS: research-to-spec package metadata and references are valid
```

#### 已提交样例严格校验

```text
python skills/research-to-spec/scripts/validate_case.py \
  search/jsonl-vs-sqlite \
  --project-root examples/jsonl-vs-sqlite/project \
  --strict --json
```

结果：

```json
{
  "ok": true,
  "errors": [],
  "warnings": [],
  "stats": {
    "questions": 3,
    "sources": 15,
    "findings": 4,
    "decisions": 3,
    "requirements": 3,
    "tasks": 3,
    "verifications": 3,
    "trace_rows": 16,
    "strict": true
  }
}
```

#### 命令帮助

三个脚本的 `--help` 均正常退出，参数与 README 示例一致。

#### 远端 CI

当前提交 `ada7eee` 最近两次 GitHub Actions 运行结果均为 success：

- `https://github.com/fjnuslw/research-to-spec/actions/runs/31657517032`
- `https://github.com/fjnuslw/research-to-spec/actions/runs/31657493240`

### 9.2 本地单元测试限制

本次运行：

```text
python -m unittest discover -s tests -v
```

五项测试都在 `setUp` 创建 `.tmp-tests/case-*` 时遇到 `PermissionError: [WinError 5]`，测试主体没有开始执行。该结果反映当前审计沙箱对 `D:\AI_Workspace\SpecScout` 的写入限制，不能据此判断脚本功能失败。

远端 Ubuntu CI 已在相同提交上成功运行完整 unittest。仍需 Windows CI 覆盖 Windows 文件句柄分支。

## 十、建议新增的测试清单

### 10.1 状态快照

- [ ] 初始化后生成 `artifact_stage=researching`；
- [ ] 所有问题 answered 后阶段进入 synthesized 或等待 synthesis；
- [ ] 计划文件完整后得到 `artifact_stage=planned`；
- [ ] 研究-only 授权下保持 `execution_state=not_started`；
- [ ] 一个任务执行中时只有一个主 focus；
- [ ] 多 lane 并行时 `active_lanes` 可包含多个问题；
- [ ] fail 验证使执行状态进入 blocked 或 active-with-failure；
- [ ] stale 来源能列出受影响的决定与需求；
- [ ] `--check` 能发现手工修改造成的快照漂移；
- [ ] 阶段回退必须保留原因；
- [ ] 快照不包含来源正文、绝对私人路径或凭据。

### 10.2 case 初始化

- [x] 已有目录时拒绝覆盖；
- [x] 搜索根目录逃逸时失败；
- [x] 中文 slug；
- [ ] 非常长的项目根目录与多个长问题；
- [ ] Windows 保留名大小写组合；
- [ ] 模板缺失或读取失败时只回滚本次新建目录；
- [ ] 创建过程中被中断后的残留处理；
- [ ] 父目录是 junction 或 symlink 的情况。

### 10.3 来源写入

- [x] 自动编号与显式编号重复；
- [x] 缺许可证的源码记录；
- [x] 符号链接账本；
- [x] 硬链接账本；
- [ ] Windows reparse point 在 CI 中实际执行；
- [ ] 两进程同时写同一 lane；
- [ ] 两进程分别写不同 lane；
- [ ] 标题或摘要仅含空白；
- [ ] 超长标题、换行、双向控制字符和 NUL；
- [ ] `retrieved_at` 无时区、未来时间和非法偏移；
- [ ] `file://` 绝对私人路径的公开安全提示或拒绝规则；
- [ ] fsync 或磁盘写入失败时不留下半条 JSON；
- [ ] append 成功后读取复核新增记录。

### 10.4 严格校验

- [x] 缺失关系与未声明编号；
- [x] 代码路径为空；
- [x] 验证缺少观察值；
- [x] CSV 公式注入；
- [x] 未勾选任务却标记 verified；
- [x] 跨 lane 直接引用来源；
- [ ] manifest 阶段与最高 trace 阶段冲突；
- [ ] INDEX 复选框与 manifest 问题状态冲突；
- [ ] `updated_at` 早于 `created_at`；
- [ ] 来源获取时间位于未来；
- [ ] status 为 verified 但仍存在 pending 验证；
- [ ] status 为 planned 但任务或验证编号缺失；
- [ ] Markdown 标题包含相近编号、代码块内编号和重复标签；
- [ ] 非 UTF-8、BOM、CRLF 与超大 JSONL 文件；
- [ ] JSON 输出在错误消息含中文和特殊字符时仍可解析。

### 10.5 安装与发布

- [ ] 从 GitHub 默认分支执行一次 CLI 安装；
- [ ] 从发布标签执行一次固定版本安装；
- [ ] 手动复制到 Codex Skills 目录后运行一次；
- [ ] 安装副本脱离原仓库执行 scaffold、add、validate；
- [ ] Windows 与 Linux 安装目录包含空格和中文；
- [ ] Release 标签、README、CHANGELOG 版本一致；
- [ ] 所有 README 相对链接与样例链接可访问；
- [ ] 对公开来源 URL 做定期可用性检查，但不把临时网络失败改写为内容失效；
- [ ] 发布前秘密扫描与许可证清单；
- [ ] GitHub Actions 固定到完整 SHA。

### 10.6 前向测试与评估

- [ ] 小改动正确选择 Skip；
- [ ] 一个窄问题正确选择 Lite；
- [ ] 旧项目功能案例选择 Standard 并引用本地代码惯例；
- [ ] 快速变化的依赖在实施前重新检查版本；
- [ ] 一个实现结果推翻原发现并完成回写；
- [ ] 中断后由新 Agent 只依赖状态快照恢复；
- [ ] baseline 与 Skill 使用相同模型、工具、提交和时间预算；
- [ ] 保存失败运行和人工干预；
- [ ] 盲审只看产物，不提前获知预期技术答案；
- [ ] 报告耗时、工具调用、返工和人工审阅成本。

## 十一、推荐实施顺序

### 第一批：让状态可读、可派生、可检查

1. 定义三个正交状态字段；
2. 增加 `derive_status.py`；
3. 让 validator 检查 manifest、trace、tasks、verification 的阶段一致性；
4. 为 JSONL/SQLite 样例生成状态快照；
5. 编写一次中断恢复案例。

### 第二批：让安装和平台声明有证据

1. 增加 Windows + Ubuntu CI 矩阵；
2. 增加复制后运行的无网络安装测试；
3. 在 release workflow 中实测 `npx skills add`；
4. 固定 GitHub Actions SHA；
5. 发布带版本和日期的兼容矩阵。

### 第三批：补并发与评估

1. 用测试复现同 lane 双写；
2. 选择最小的互斥或编号分配方案；
3. 增加旧项目、快速依赖、错误假设恢复三个案例；
4. 按 `evals/README.md` 运行 matched baseline；
5. 根据真实开销调整 Lite、Standard、Deep 的路由。

## 十二、最终判断

Research-to-Spec 已达到“可以邀请技术用户试用并提出反馈”的阶段。它目前最成熟的部分是证据结构、安全写入和可追踪关系；最需要补齐的部分是运行状态投影、跨平台验证和安装后的完整 smoke test。

## 十三、实施后的复核

主任务依据本审计与独立前向测试完成 `0.1.0-alpha.2` 修正。以下结果来自 2026-08-13 的最终工作树，正文中的缺口描述继续作为修正前记录保留。

### 已解决

1. 新增只读 `render_status.py`，从 manifest、问题 lane、来源账本、追踪表和任务文件派生 XML 或 JSON。投影包含材料阶段、实施授权、问题与任务计数、完整性计数、下一关和回查路径，不落一份需要手工同步的 `STATUS.json`。
2. 新 case 使用 schema `0.2`，把 `authorization` 从材料阶段中拆出；默认值为 `research-only`。`research-only + implementing/verified` 会进入完整性错误，投影不会提示继续实施。
3. schema `0.1` 继续可读。旧 case 缺少授权且已进入实施阶段时，下一关要求升级 case 并记录明确授权。
4. Markdown 模板示例改成注释。全新 case 的 finding、decision、requirement、task 与 verification 都从 0 开始，状态显示任务 `0/0`。
5. projector 会检查必需文件、manifest 与 question 字段、来源字段与枚举、来源所属 lane、时间、追踪表表头和各阶段必填关系。缺失或损坏的输入进入 `invalid_records`。
6. manifest、来源账本、追踪表和任务文件都会解析最终文件目标。目标越过各自材料根时，manifest 直接拒绝，其余输入计入完整性错误。
7. `SKILL.md` 现在要求初始化、阶段边界、中断恢复和交接时重新生成状态；实施获批时同步更新 manifest 与 INDEX 的授权、状态和时间。
8. 独立空 case 复验与仓库自用案例均已通过。自用案例严格校验记录为 3 个问题、15 条来源、4 个发现、3 个决定、3 个需求、3 个任务、3 个验证项和 16 条追踪关系。

### 最终验证

- 单元测试共 8 项：6 项通过；2 项文件符号链接测试因 Windows 缺少创建链接权限按设计跳过，Ubuntu CI 可执行这两项。
- Skill 包元数据检查通过。
- `skill-creator` 快速校验通过。
- 自用案例严格校验通过，状态投影为 `invalid_records=0`。
- `git diff --check` 通过，仅有换行格式提示。

### 仍保留的 Alpha 边界

1. 同一问题 lane 仍要求一个逻辑写入者，脚本尚未提供锁或 compare-and-append。
2. Windows 文件符号链接用例受本机权限限制；发布材料应把“测试已定义”和“本机已执行”分开写。
3. 任意 Spec Kit、OpenSpec、Kiro 或项目自定义布局仍需人工核对稳定编号连接。
4. 当前证据证明默认工作流可运行并可审查，尚未给出生产力、成功率或跨宿主兼容性的成组对照结论。

将状态快照加入后，这个项目会形成清楚的两层记忆：

```text
完整材料树：保存为什么这样决定
短状态快照：说明现在走到哪里、下一步通过什么关卡
```

这种分层很适合长任务。聊天窗口只需携带短状态，证据和规格继续留在文件中；需要核对某个判断时，再沿稳定编号打开对应材料。
