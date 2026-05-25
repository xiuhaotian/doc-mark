# DocuMark - 文档转Markdown工具

一款精美的在线工具，支持将 Word、PDF、Excel、PowerPoint 文档转换为 Markdown 格式。

✨ **在线访问**: https://doc-mark.pages.dev

## 功能特点

- 📝 **Word 文档** - 保留标题、列表、表格等格式
- 📕 **PDF 文件** - 文本内容提取
- 📊 **Excel 表格** - 转换为 Markdown 表格
- 📊 **PowerPoint** - 按幻灯片提取内容
- 🔒 **隐私安全** - 纯本地处理，文件不会上传至服务器
- ⚡ **极速转换** - 浏览器端即时处理
- 📥 **直接下载** - 一键下载转换后的 Markdown 文件

## 技术栈

- Tailwind CSS - 美观的UI设计
- Mammoth.js - Word文档转换
- PDF.js - PDF文本提取
- SheetJS - Excel表格处理
- JSZip - PowerPoint解析

## 部署

本项目可以轻松部署到 Cloudflare Pages。

### 方式一：手动部署

1. 安装 Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. 登录 Cloudflare:
   ```bash
   wrangler login
   ```

3. 部署:
   ```bash
   wrangler pages deploy .
   ```

### 方式二：GitHub Actions 自动部署

1. Fork 此仓库

2. 在 Cloudflare Dashboard 获取:
   - Account ID (Account Settings > Account ID)
   - API Token (My Profile > API Tokens > Create Token)
     - 选择 "Edit Cloudflare Workers" 模板

3. 在 GitHub 仓库 Settings > Secrets 中添加:
   - `CLOUDFLARE_API_TOKEN`: 你的 API Token
   - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

4. 推送代码到 `main` 分支，GitHub Actions 会自动部署

## 使用方法

1. 访问 https://doc-mark.pages.dev
2. 拖拽或点击上传文件
3. 点击"开始转换"
4. 预览 Markdown 结果
5. 复制或下载转换后的文件

## 本地运行

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用任何静态服务器
npx serve .
```

然后访问 http://localhost:8080

## 项目结构

```
doc-mark/
├── index.html          # 主页面
├── wrangler.toml      # Cloudflare 配置文件
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions 部署脚本
```

## License

MIT License
