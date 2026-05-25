# DocuMark 部署指南 - Cloudflare Pages + GitHub Actions

本指南将帮助你将 DocuMark 部署到 Cloudflare Pages，并使用 GitHub Actions 实现自动部署。

## 前置要求

1. GitHub 账户
2. Cloudflare 账户（免费即可）

## 步骤 1: 创建 GitHub 仓库

### 方法一：使用 GitHub CLI

```bash
# 在 GitHub 上创建新仓库
gh auth login
gh repo create doc-mark --public --source=. --push
```

### 方法二：手动创建

1. 访问 https://github.com/new
2. 仓库名称填写：`doc-mark`
3. 选择 Public（公开）
4. 点击 "Create repository"
5. 按照提示添加远程仓库并推送

## 步骤 2: 配置 Cloudflare

### 2.1 获取 Cloudflare Credentials

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Account Home**
3. 复制你的 **Account ID**（在右侧边栏）

### 2.2 创建 API Token

1. 进入 **My Profile** > **API Tokens**
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 设置以下权限：
   - Account: `Edit`
   - Zone: `None`
5. 点击 **Create Token**
6. 复制生成的 Token（只会显示一次）

## 步骤 3: 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**，添加：

### Secret 1: CLOUDFLARE_API_TOKEN
- Name: `CLOUDFLARE_API_TOKEN`
- Secret: 你刚才创建的 API Token

### Secret 2: CLOUDFLARE_ACCOUNT_ID
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Secret: 你的 Cloudflare Account ID

## 步骤 4: 启用 GitHub Actions

1. 推送代码到 `main` 分支
2. 进入仓库的 **Actions** 标签页
3. 你会看到 "Deploy to Cloudflare Pages" 工作流
4. 点击工作流 > **Enable workflow**

## 步骤 5: 推送代码触发部署

```bash
cd doc-mark
git branch -M main
git push -u origin main
```

这将自动触发 GitHub Actions，部署到 Cloudflare Pages！

## 部署验证

部署完成后：

1. 访问 `https://pages.cloudflare.com` 查看部署状态
2. 默认域名格式：`https://<project-name>.<username>.pages.dev`
3. 你也可以绑定自定义域名

## 手动部署（可选）

如果你想手动部署而不是使用 GitHub Actions：

### 使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy .
```

### 使用 Cloudflare Dashboard

1. 访问 https://pages.cloudflare.com
2. 点击 "Create a project"
3. 选择 "Import an existing Git repository"
4. 选择你的 GitHub 仓库
5. 配置构建命令（为空）和输出目录（为 `/`）
6. 点击 "Deploy site"

## 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中
2. 进入 **Custom domains**
3. 添加你的域名
4. 按照指示配置 DNS

## 自动部署说明

GitHub Actions 工作流配置为：
- ✅ 推送到 `main` 分支时自动部署
- ✅ 手动触发（workflow_dispatch）
- ✅ 推送 Pull Request 时预览部署

## 故障排除

### 部署失败
- 检查 GitHub Secrets 是否正确配置
- 确认 API Token 有正确的权限
- 查看 Actions 日志中的具体错误信息

### 构建问题
- 确保 `wrangler.toml` 配置正确
- 检查 `_redirects` 和 `_headers` 文件格式

### 域名问题
- 确认 DNS 记录已正确添加
- 等待 DNS 传播（通常需要几分钟）

## 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## 费用说明

- Cloudflare Pages: **免费**（无限带宽，无限请求）
- GitHub Actions: **免费**（公共仓库 2000 分钟/月）
- 自定义域名: **免费**

总成本：**$0** 🎉
