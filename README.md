# Live Vitae

**A living research archive, not just another CV page.**

一个数据驱动、支持中英切换的学术主页模板。保留简洁的首页，把论文、专著、项目、经历、荣誉与动态放进可持续扩展的档案。

[**在线示例 · 派蒙学术主页**](https://sci-m-wang.github.io/live-vitae/) · [快速配置](docs/customization.md) · [English quick start](#quick-start)

> 示例由派蒙本人负责学术表达，旅行者负责通讯钱包。三部代表专著：《我的大贤者老师》《我的朋友布耶尔》《我的降临者伙伴》。请勿空腹同行评审。

## Features

- **中英双语**：切换界面与叙述内容，论文、专著等正式标题保持原文。
- **内容与布局分离**：JSON 管资料，Astro 管页面，无需每次改组件。
- **论文档案**：作者高亮、分类筛选、置顶、详情弹窗、摘要和引用量。
- **任意自定义栏目**：专著、教学、软件、数据集、指导经历都可使用 collection 模板。
- **完整学术履历**：教育与工作、访问与实习、项目资助、荣誉、报告服务、动态媒体。
- **浏览器编辑器**：公开沙盒可直接体验新增、编辑、删除、保存和导出。个人站支持本地解密、GitHub 提交与版本冲突保护。
- **可选数据同步**：Google Scholar 引用快照、GitHub Stars、arXiv 元数据；未配置时安全跳过。
- **静态部署**：GitHub Pages 自动化、项目子路径、用户主页根路径、自定义域名。
- **轻量交互**：响应式、键盘可用的弹窗、减少动态效果偏好支持、无第三方分析脚本。

## 5 分钟创建自己的主页

1. 点击仓库右上角 **Use this template → Create a new repository**。
2. 修改 [`site.config.mjs`](site.config.mjs)：站点地址、路径、仓库、图片与默认语言。
3. 把 `src/data/profile.json`、`publications.json`、`sections.json` 换成自己的资料。
4. 把 `src/data/ui.json` 改为 `{}`，去掉派蒙专属口吻；也可以保留这个机制自定义全部界面文案。
5. 在 **Settings → Pages → Source** 选择 **GitHub Actions**，推送 `main`，等待 Deploy Live Vitae 完成。

GitHub Actions 会从新仓库自动推导 `owner/repository` 和部署子路径。**本地开发**仍使用 `site.config.mjs` 中的值，因此复制模板后也请更新配置。

## 本地开发

需要 **Node.js ≥ 22.12**、**npm ≥ 10.8.2**。

```bash
npm ci
npm run dev
```

默认示例地址：`http://localhost:4321/live-vitae/`。修改 `base` 后使用对应路径。

```bash
npm test             # 部署配置、URL 与内容结构测试
npm run build        # Astro 类型检查 + 静态构建
npm run test:links   # 检查 dist 内部链接和资源
npm run preview     # 预览生产构建
```

## 内容地图

| 文件 | 用途 |
| --- | --- |
| `site.config.mjs` | 域名、子路径、仓库、语言、图片、编辑器示例模式、可选同步标识 |
| `src/data/profile.json` | 姓名、简介、研究方向、指标、经历、项目、荣誉、服务、动态 |
| `src/data/publications.json` | 论文、作者、摘要、链接、引用和筛选标签 |
| `src/data/sections.json` | 子页面、导航顺序、可见性、自定义栏目与条目 |
| `src/data/ui.json` | 可选的中英文界面文案覆盖；`{}` 即恢复通用文案 |
| `src/data/citations.json` | 可选引用快照；未启用时为 `{}` |
| `public/` | 本地头像、媒体图片、简历等静态资源 |

稳定 `id` 不应随意更名。正式标题只存一份；叙述内容使用 `{ "en": "…", "zh": "…" }`。详见[配置指南](docs/customization.md)。

示例文案的维护规则见[内容写作约定](docs/content-style.md)。派蒙梗放在内容里，导航和页面结构保持通用。

## 浏览器编辑器与安全

默认 `demo: true`。点击示例站的“更新”即可进入[公开编辑体验](https://sci-m-wang.github.io/live-vitae/update/)，无需密码或 Token。修改保存到访客自己的浏览器，支持刷新恢复、重置和按文件导出 JSON。公开主页不随这些体验修改变化，不同访客互不影响。浏览器限制本地存储时，会提示仅在当前页面保留。

自己的主页配置完毕后，将 `demo` 设为 `false` 才会启用 GitHub 所有者编辑模式。

编辑器不是服务器端登录系统：它使用 **PBKDF2 + AES-256-GCM** 在浏览器中加密仓库专用的 GitHub Token，把密文保存到 `public/admin-vault.json`。这个文件是公开的，密码过弱会受到离线猜测攻击。请使用独立强口令、限定仓库及有效期的 fine-grained Token，仅授予 **Contents: Read and write**。Token 只留在当前页面内存，不进入浏览器持久存储。

解锁后的 Token 以明文交给浏览器调用 GitHub API，能被该浏览器的使用者读取。因此，公开解锁密码等同于共享这个 Token 的权限，不能用于公开体验。沙盒只处理内容 JSON，不使用凭证保险箱。

不要在配置、JSON、`.env` 或 Actions 日志里提交密码或 Token；不要复制其他站点的 vault。遗忘密码时，先撤销旧 Token，再删除远端 vault，重新初始化。编辑器适用于仓库由个人账号持有且 Token 属于同一账号的场景；组织账号请使用 GitHub 网页或本地维护内容。

## Quick start

1. Choose **Use this template** on GitHub.
2. Update `site.config.mjs`, replace the JSON content in `src/data/`, and replace the demo artwork/CV.
3. Set `src/data/ui.json` to `{}` to restore neutral UI text; set `defaultLanguage: "en"` for English by default.
4. Select **GitHub Actions** as the Pages source, then push to `main`.
5. For local development, run `npm ci && npm run dev` and open the configured base path.

Project Pages, `username.github.io` sites, and custom domains are supported. CI checks both root and project-path builds. See [customization](docs/customization.md) for deployment variables and optional integrations.

## Attribution & license

Originally extracted from [Ming Wang's academic homepage](https://sci-m-wang.github.io/), with personal data and credentials removed. Information architecture draws inspiration from [al-folio](https://github.com/alshedivat/al-folio), [Academic Pages](https://github.com/academicpages/academicpages.github.io), and [Hugo Academic CV](https://github.com/HugoBlox/hugo-theme-academic-cv).

Source code: [MIT](LICENSE). Paimon artwork is **not** MIT-licensed; see [third-party notices and source links](THIRD_PARTY_NOTICES.md). Replace character artwork and the playful demo records before using this template as your own academic profile.
