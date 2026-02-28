# 爽文生成器

一个基于Hexo的爽文创作与发布平台，支持多小说多章节管理，自动生成GitHub Pages文档网站。

## 功能特性

- 📝 **多小说管理**：支持创建、编辑多个小说
- 📖 **章节管理**：为每个小说添加、更新章节内容
- 🌐 **自动生成网站**：使用Hexo自动生成静态网站
- 🚀 **一键部署**：部署到GitHub Pages，全球访问
- 📱 **响应式设计**：支持手机、平板、电脑等多种设备

## 快速开始

### 1. 安装依赖

```bash
npm install -g hexo-cli
cd novel-generator
npm install
```

### 2. 使用CLI管理小说

```bash
# 启动CLI
node agent/cli.js

# 创建新小说
create-novel "我的第一个爽文" "张三" "这是一个精彩的爽文故事"

# 添加章节
add-chapter <小说ID> "第一章: 开局即巅峰"
# 然后输入章节内容，按Ctrl+D结束

# 列出所有小说
list-novels

# 构建网站
build

# 部署到GitHub Pages
deploy
```

### 3. 配置GitHub Pages

在`_config.yml`中修改部署配置：

```yaml
deploy:
  type: 'git'
  repo: https://github.com/your-username/your-repo.git
  branch: gh-pages
  message: 'Deploy: {{ now("YYYY-MM-DD HH:mm:ss") }}'
```

## 项目结构

```
novel-generator/
├── agent/                 # 爽文生成agent
│   ├── novel_agent.js    # 核心agent逻辑
│   ├── cli.js            # 命令行工具
│   └── memory/           # 记忆存储
│       └── novels.json   # 小说数据
├── source/               # Hexo源文件
│   └── novels/           # 自动生成的小说页面
├── themes/               # Hexo主题
│   └── landscape/        # 自定义主题布局
├── _config.yml           # Hexo配置
└── package.json          # 项目依赖
```

## 使用说明

### 创建小说

使用`create-novel`命令创建新小说，需要提供标题，可选作者和简介。

### 添加章节

使用`add-chapter`命令为指定小说添加章节，需要提供小说ID和章节标题，然后输入章节内容。

### 更新章节

使用`update-chapter`命令更新章节内容，需要提供小说ID和章节ID，然后输入新的章节内容。

### 构建网站

使用`build`命令将小说内容生成为静态网站，生成的文件在`public/`目录。

### 部署网站

使用`deploy`命令将静态网站部署到GitHub Pages，需要先配置好GitHub仓库信息。

## 技术栈

- **Node.js**: 后端运行环境
- **Hexo**: 静态网站生成器
- **GitHub Pages**: 网站部署平台
- **JavaScript**: agent核心逻辑

## 许可证

MIT License