# 配置 Live Vitae

## 1. 站点配置

`site.config.mjs` 是公开配置，不是 Secret 文件。个人站配置示例：

```js
export const siteConfig = {
  demo: false,
  defaultLanguage: "en", // "en" or "zh"
  site: "https://your-name.github.io",
  base: "/my-homepage/",
  repository: { owner: "your-name", name: "my-homepage", branch: "main" },
  portrait: "/profile.jpg",
  favicon: "/profile.jpg",
  socialImage: "/og.png", // Prefer PNG/JPEG for social-platform support.
  scholarAuthorId: "", // Optional, e.g. the user= value in your Scholar URL.
  githubUsername: "", // Optional; do not use someone else's account.
  contributionStartYear: 2020,
};
```

保留文件中的 `resolveDeployment` 和 `withBase` 函数。只修改 `siteConfig` 对象。

- `demo: true` 关闭浏览器编辑器初始化及引用/Stars 更新，不要求页面展示提示条。
- `site` 只填域名；`base` 单独填路径，以 `/` 开头、结尾。
- 普通仓库 `my-homepage`：`base: "/my-homepage/"`。
- 用户主页仓库 `your-name.github.io`：`base: "/"`。
- 个人自定义域名：`site: "https://cv.example.org"`、`base: "/"`。
- 在 JSON 中写 `/profile.jpg`、`/cv/cv.pdf` 这样的站内路径即可；组件会自动添加 base。外部 URL、邮件链接和锚点保持不变。

### Actions 环境覆盖

Pages 构建读取 GitHub Pages 实际返回的域名与 base；仓库身份从 `GITHUB_REPOSITORY` 推导。必要时在 **Settings → Secrets and variables → Actions → Variables** 设置：

| 变量 | 示例 | 作用 |
| --- | --- | --- |
| `SITE_URL` | `https://cv.example.org` | 覆盖站点域名，可含基础路径 |
| `BASE_PATH` | `/` 或 `/research/` | 显式覆盖基础路径 |

使用自定义域名时，还需在 Pages 设置域名并配置 DNS；也可加入 `public/CNAME`。本地 shell 环境也支持同名变量，例如 PowerShell：

```powershell
$env:SITE_URL = "https://cv.example.org"
$env:BASE_PATH = "/"
npm run build
npm run test:links
```

本地与托管仓库配置保持一致，才能让本地编辑器访问正确的仓库。维护工作流默认使用 `main`；若改分支，需要同时改工作流的触发器、checkout、push、dispatch 和编辑器配置。

## 2. 从派蒙恢复为通用主页

1. 将 `src/data/ui.json` 全部替换为 `{}`。这个文件按原始英文文案索引，例如：

   ```json
   {
     "Research focus": { "en": "Research areas", "zh": "研究领域" },
     "Portrait caption": { "en": "Research portrait", "zh": "个人照片" }
   }
   ```

2. 替换 `profile.json` 的姓名、简介、联系方式、坐标、`portraitYear` 和各类记录。
3. 替换 `publications.json`。没有论文时可设为 `[]`，也可在 `sections.json` 中隐藏该导航项。
4. 替换 `sections.json` 的栏目名、介绍和 collection 条目；不需要专著页就删除该 collection，或设置 `visible: false`。
5. 替换 `public/paimon-*`、`public/media/paimon-*` 和示例 CV，并更新配置。
6. 将 `demo` 改为 `false`，选择是否初始化浏览器编辑器。

示例不包含原作者的个人简历、照片、引用记录或保险箱。角色图片的来源与授权边界见 `THIRD_PARTY_NOTICES.md`。

### Profile 约定

保留示例的 JSON 结构，只替换数据。`experience`、`funding`、`projects`、`awards`、`activities`、`news` 可为 `[]`。基础字段如 `links.cv`、`location`、`coordinates`、`researchAreas` 等应保留。

常用枚举：

- `experience.type`：`education`、`work`、`exchange`。
- `activities.type`：`talk`、`academic`、`volunteer`、`outreach`。
- `news.kind: "Media"` 进入媒体卡片，其余类型进入动态列表。
- `pinned: true`：论文进入首页精选与档案置顶，项目/奖项/自定义条目在各自栏目置顶。
- `profile.name` 用于论文作者高亮，作者字符串里请使用完整姓名。
- `links.scholar`、`links.github`、`links.orcid` 可留空，不显示对应按钮。
- CV 支持中英不同文件；把自己的 PDF 放入 `public/cv/`，修改 `links.cv.en` 和 `.zh`。

## 3. 添加论文

向 `src/data/publications.json` 数组添加：

```json
{
  "id": "my-paper-2027",
  "title": "The Original Paper Title",
  "authors": "Your Name, Another Author",
  "venue": "Full Conference or Journal Name",
  "venueShort": "Venue 2027",
  "year": 2027,
  "category": "first",
  "status": "published",
  "pinned": true,
  "badges": ["Open access"],
  "arxivId": "",
  "publishedAt": "2027-01-01",
  "doi": "",
  "links": { "paper": "https://example.org/paper", "pdf": "", "code": "" },
  "abstract": { "en": "Your abstract.", "zh": "你的摘要。" },
  "citations": { "count": 0, "source": "Manual", "updatedAt": "2027-01-01" }
}
```

`category`：`first` / `cofirst` / `coauthor` / `working`。`status`：`published` / `accepted` / `preprint`。`working` 驱动工作论文筛选。不要复制示例中的玩笑指标作为自己的真实成果。

## 4. 自定义栏目

在 `sections.json` 添加一个 `collection`，无需创建 Astro 文件：

```json
{
  "id": "teaching", "slug": "teaching",
  "nav": { "en": "Teaching", "zh": "教学" },
  "title": { "en": "Teaching & Resources", "zh": "教学与资源" },
  "intro": { "en": "Courses and learning materials.", "zh": "课程与学习资料。" },
  "template": "collection", "order": 8, "visible": true,
  "entries": [{
    "id": "course-2027", "title": "Course Title", "pinned": true,
    "eyebrow": "Spring 2027", "meta": "Teaching assistant",
    "summary": { "en": "Short description.", "zh": "简短介绍。" },
    "details": { "en": "Course details.", "zh": "课程详情。" },
    "links": { "paper": "https://example.org/course" }
  }]
}
```

路由为 `/teaching/`，自动加入导航与首页目录。`visible: false` 只从导航与目录隐藏，**不是访问控制**，URL 仍构建。slug 使用唯一小写英文/数字/连字符，不要使用 `update`、`404` 或现有路由。

内置模板：`publications`、`funding`、`experience`、`awards`、`service`、`news`、`collection`。内置数据由 profile/publications 提供；只有 collection 使用 `entries`。

## 5. 可选浏览器编辑器

仅在自己的仓库上启用，要求 HTTPS（或本地 localhost）与 Web Crypto。将 `demo` 设为 `false`，访问 `/<base>/update/`：

1. 创建限定当前仓库的 fine-grained GitHub Token，有效期尽量短，只授予 **Contents: Read and write**。
2. 使用不复用的强口令加密 Token。密文提交到 `public/admin-vault.json`。
3. 后续本地解密后，编辑器检查账号与仓库写权限，读取 JSON；保存前比对远端 SHA，避免覆盖他人的新版本。
4. 每次保存创建 Git 提交，GitHub Pages 随之构建。关闭/刷新/锁定页面会清理内存中的 Token。

GitHub Token 的写权限才是最终授权机制。公开的 AES-GCM 密文仍可能遭受离线口令猜测；本机制不替代 GitHub 账号安全，不提供服务端会话或多人权限管理。仓库名/owner 改变后旧 vault 不可复用，请撤销旧 Token 并重新初始化。组织仓库使用本地或 GitHub 网页维护。

`site.config.mjs`、`ui.json`、原始图片及 CV 需要通过代码或 GitHub 网页修改；浏览器编辑器主要管理内容记录和基础资料。

## 6. 可选引用、Stars 与元数据

### Google Scholar

配置 `scholarAuthorId`，关闭 demo 后可运行：

```bash
npm run citations:update -- --dry-run
npm run citations:update
```

Google Scholar 可能限制服务器请求或要求 CAPTCHA；更新失败不会覆盖现有快照。该工作流默认 **仅手动触发**，不承诺定时成功。也支持在 `citations.json` 放入 CiteBeat 格式：

```json
{
  "schema": "citation.snapshot", "schemaVersion": 1,
  "source": { "provider": "scholar", "authorId": "YOUR_ID", "fetchedAt": "2027-01-01T00:00:00Z" },
  "metrics": { "citations": 12, "hIndex": 2, "i10Index": 0 },
  "papers": [{ "title": "The Original Paper Title", "citations": 12 }]
}
```

authorId 必须与配置一致；论文按规范化标题匹配，未匹配时保留人工值。默认空标识或 demo 模式不会套用快照。

### GitHub Stars

配置 `githubUsername`；项目的 `links.code` 填真实 GitHub 仓库 URL：

```bash
npm run stars:update -- --dry-run
npm run stars:update
```

周一工作流使用 `GITHUB_TOKEN` 更新公开仓库数据，没有配置时安全跳过。个人 Stars 为自有非 fork 仓库之和，贡献仓库单独统计，不混为个人项目 Stars。无 Token 的本地运行可能遇到匿名 API 限流，贡献发现功能需要 Token。

### arXiv

论文填写真实 `arxivId` 后运行 `npm run publications:metadata`。没有 ID 时跳过；已有人工摘要保留。

### GitHub Actions 内容表单

Actions 的 Admin 工作流是浏览器编辑器的备用入口，只允许仓库 owner 触发实际写入；提交后显式触发部署，因为默认工作流 Token 的 push 不会递归触发另一个 push 工作流。所有内容输入通过环境变量传递，不插入 shell 脚本。

## 7. 验证

运行 `npm test`、`npm run build`、`npm run test:links`。CI 分别构建 `/` 和 `/live-vitae/`，检查导航、简历、头像、媒体、语言切换的本地 URL 是否实际存在。浏览器中另外检查语言切换、论文筛选、详情弹窗、自定义条目展开和手机宽度。
