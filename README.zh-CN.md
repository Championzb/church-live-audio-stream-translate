# Church Live Audio Translate（音频 -> 源语言转写 -> 目标语言翻译）

Windows 与 macOS 桌面字幕应用（基于 Tauri）。

[English](./README.md) | 简体中文

文档导航页： [docs/README.md](./docs/README.md)

## 这个应用能做什么

- 采集你选择的音频输入设备中的实时讲道音频。
- 近实时输出「源语言转写 + 目标语言翻译」双轨结果。
- 支持韩语、英语、日语、中文作为输入源语言。
- 支持简体中文、繁体中文、韩语、日语、西班牙语、英语作为目标输出语言。
- 提供可选的投影窗口用于会众展示。
- 内置术语表与关键词机制，提升教会术语一致性。

## 典型使用场景

- 多语言会众的教会礼拜实时字幕。
- 双语服事团队由一名操作员统一管理音频与翻译输出。
- 希望保留本地可控流程与提示词调优能力的小团队。
- 需要审核人员看到源语言转写、会众看到目标语言字幕的场景。

## 主要优势

- 面向礼拜现场操作的目标语言优先界面。
- 采用 `音频 -> 源语言 -> 目标语言` 流程，减少中间语偏移。
- 主翻译视图与投影视图都支持源/目标显示控制。
- 支持讲章脚本 + 讲章关键词的周度准备流程，提升术语稳定性。
- 开源，可自托管，流程可按需扩展。

## 与商业实时音频翻译平台相比的限制

- 不提供 SLA、可用性合同或托管支持台。
- 对操作员的准备要求更高（音频路由、密钥、质量调优、礼拜前检查）。
- 企业能力较少（团队管理后台、分析看板、合规套件等）。
- 质量更依赖本地环境与操作员调参，而不是托管平台统一保障。
- 发布节奏与长期维护依赖项目与社区，而非商业产品路线图。

## 这个工具适合你吗？

适合：
- 你需要对翻译流程与教会术语有强控制力。
- 你需要可操作性强、支持投影的现场界面。
- 你更看重开源灵活性，而非一站式托管平台。

不太适合（可考虑商业平台）：
- 你有严格 SLA / 正式技术支持要求。
- 你希望非技术团队几乎零配置上线。
- 你需要开箱即用的企业治理/合规/报表能力。

## 安装（从 GitHub Releases）

1. 打开仓库的 GitHub Releases 页面。
2. 在最新版本资产中下载对应系统的安装包。

### macOS（`.app.zip`）

1. 下载 `*.app.zip`。
2. 解压缩。
3. 将 `.app` 拖入 `Applications`。
4. 首次启动：右键应用 -> `打开` -> 再次确认 `打开`。

### Windows（`.msi`）

1. 下载 `*.msi`。
2. 运行安装程序。
3. 若出现 SmartScreen：点击 `More info` -> `Run anyway`。

如果在 Releases 页面看不到安装包，说明该版本尚未发布资产。此时请先使用源码方式运行。

## 源码运行（开发者）

要求：

- Node.js 20+
- Rust 稳定版工具链
- OpenAI API key

运行：

```bash
npm install
npm run start
```

## 按角色快速开始

- 现场操作员（运行实时字幕）：[Operator Guide](./docs/OPERATOR_GUIDE.md)
- 教会管理员 / 配置负责人（密钥、语言辅助、音频设置、Tune Audio 选项）：[Setup And Configuration](./docs/SETUP_AND_CONFIG.md)
- 开发者 / 维护者（架构、API、延迟）：[Translation Pipeline](./docs/TRANSLATION_PIPELINE.md)
- 讲章准备辅助提示词（韩文稿 -> 中文稿 + STT 关键词）：[Script Prep Prompt](./docs/SCRIPT_PREP_PROMPT.md)

## 核心文档

- [Operator Guide](./docs/OPERATOR_GUIDE.md)
- [Setup And Configuration](./docs/SETUP_AND_CONFIG.md)
- [Translation Pipeline](./docs/TRANSLATION_PIPELINE.md)
- [Script Prep Prompt](./docs/SCRIPT_PREP_PROMPT.md)

新会话默认音频采集预设：
- `Tune Audio` 开启、`VAD Threshold` `0.050`、`Silence Hold` `1900ms`、`Max Segment` `12000ms`。

语音处理流程说明：
- 对非英语输入（韩语/日语/中文），应用先用 `/v1/audio/transcriptions` 按源语言转写，再直接从源文本翻译到目标语言。
- 后端会执行源转写质量门控（语言不匹配 / 低置信度分段混杂），可疑分段会被跳过，避免传递疑似幻觉文本。
- 会分别维护源语言上下文与目标翻译上下文，提升连续分段稳定性。
- 韩语 -> 中文内置一致性规则默认开启（锚点与极性检查），无需额外配置。

## 发布 / QA 文档

- 发布流程： [docs/DISTRIBUTION.md](./docs/DISTRIBUTION.md)
- 签名与公证： [docs/SIGNING.md](./docs/SIGNING.md)
- QA 清单： [docs/TEST_PLAN.md](./docs/TEST_PLAN.md)
- 合并/发布 QA 门禁： [docs/QA_GATE.md](./docs/QA_GATE.md)
- UI 审查标准： [docs/UI_REVIEW_RUBRIC.md](./docs/UI_REVIEW_RUBRIC.md)
- 自动版本号工作流： `.github/workflows/release-version.yml`

## 自动化测试命令

- 类型检查：`npm run typecheck`
- 单元测试：`npm run test:unit`
- 单元测试覆盖率：`npm run test:coverage`
- 视觉回归测试：`npm run test:visual`

## 开源协作文档

- 许可证： [Apache-2.0](./LICENSE)
- 贡献指南： [CONTRIBUTING.md](./CONTRIBUTING.md)
- 行为准则： [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- 安全策略： [SECURITY.md](./SECURITY.md)
- 支持说明： [SUPPORT.md](./SUPPORT.md)
