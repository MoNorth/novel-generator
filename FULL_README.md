# 爽文生成器 Skill

一个基于Hexo的爽文创作与发布平台，包含独立agent与记忆系统，支持多小说多章节创作与更新，自动生成GitHub Pages文档网站。

## 🎯 核心功能

### 🧠 独立Agent与记忆系统
- **智能小说管理**：独立的NovelAgent，支持创建、编辑、删除多本小说
- **持久化记忆**：使用JSON文件存储所有小说和章节数据，重启不丢失
- **章节版本管理**：支持章节内容的更新和修改，保留历史记录

### 📝 多小说多章节创作
- **小说创建**：支持输入小说标题、作者、简介等信息
- **章节管理**：为每本小说添加、更新章节内容
- **章节导航**：自动生成章节间的前后跳转链接
- **目录生成**：自动为每本小说生成章节列表

### 🌐 GitHub Pages + Hexo文档网站
- **自动生成**：将小说内容自动转换为Hexo静态网站
- **响应式设计**：基于Hexo Landscape主题，支持手机、平板、电脑等多种设备
- **一键部署**：集成hexo-deployer-git，一键部署到GitHub Pages
- **分类导航**：通过Hexo的分类功能自动组织小说内容

## 📁 项目结构

```
novel-generator/
├── agent/                 # 爽文生成Agent核心
│   ├── novel_agent.js    # 原始版本Agent（自定义路径）
│   ├── novel_agent_simple.js # 简化版Agent（使用Hexo分类）
│   ├── cli.js            # 原始版本CLI
│   ├── cli_simple.js     # 简化版本CLI
│   └── memory/           # 记忆存储目录
│       └── novels.json   # 小说数据持久化文件
├── source/               # Hexo源文件目录
│   └── _posts/           # 自动生成的小说章节文件
├── themes/               # Hexo主题目录
│   └── landscape/        # 响应式主题
├── _config.yml           # Hexo配置文件
├── package.json          # 项目依赖
├── README.md             # 项目说明
└── test_build.sh         # 测试脚本
```

## 🚀 快速开始

### 1. 环境准备

```bash
# 安装Node.js（v16+）和npm
# 安装Hexo CLI
npm install -g hexo-cli

# 克隆或下载项目
cd novel-generator

# 安装依赖
npm install
```

### 2. 配置GitHub Pages

编辑`_config.yml`文件，修改部署配置：

```yaml
deploy:
  type: 'git'
  repo: https://github.com/your-username/your-repo.git
  branch: gh-pages
  message: 'Deploy: {{ now("YYYY-MM-DD HH:mm:ss") }}'
```

### 3. 使用Agent管理小说

#### 使用CLI交互模式

```bash
# 启动简化版CLI
./agent/cli_simple.js

# 或使用原始版本CLI
./agent/cli.js
```

#### 可用命令

```
create-novel <标题> [作者] [简介] - 创建新小说
add-chapter <小说ID> <章节标题> - 添加新章节
update-chapter <小说ID> <章节ID> - 更新章节内容
list-novels - 列出所有小说
get-novel <小说ID> - 获取小说详情
build - 构建网站
deploy - 部署网站
exit - 退出
```

#### 示例操作

```bash
# 创建新小说
create-novel "都市战神归来" "佚名" "一代战神回归都市，开启传奇人生"

# 查看小说列表，获取小说ID
list-novels

# 添加章节（替换<小说ID>为实际ID）
add-chapter <小说ID> "第一章: 开局即巅峰"
# 然后输入章节内容，按Ctrl+D结束

# 构建网站
build

# 部署到GitHub Pages
deploy
```

### 4. 直接使用API（适合集成）

```javascript
const NovelAgent = require('./agent/novel_agent_simple');
const agent = new NovelAgent();

// 创建小说
const novel = agent.createNovel({
  title: '都市战神归来',
  author: '佚名',
  description: '一代战神回归都市，开启传奇人生'
});

// 添加章节
const chapter = agent.addChapter(novel.id, {
  title: '第一章: 开局即巅峰',
  content: '林一凡从边境战场归来，身上带着无上荣耀与惊人实力。\n他推开家门，却发现曾经的豪门已经落魄，亲人受尽欺凌。'
});

// 构建网站
agent.buildSite();

// 部署网站
agent.deploySite();
```

## 🎨 自定义配置

### 1. 主题自定义

修改Hexo主题配置：

```bash
# 编辑主题配置文件
vi themes/landscape/_config.yml
```

### 2. 网站配置

修改Hexo网站配置：

```bash
# 编辑网站配置文件
vi _config.yml
```

### 3. Agent配置

修改Agent的存储路径等配置：

```bash
vi agent/novel_agent_simple.js
```

## 🔧 技术栈

- **后端**：Node.js + JavaScript
- **静态网站生成**：Hexo v7+
- **部署**：GitHub Pages + hexo-deployer-git
- **主题**：Hexo Landscape（响应式设计）
- **数据存储**：JSON文件持久化

## 📝 注意事项

1. **章节内容输入**：在CLI中输入章节内容时，按Ctrl+D（Linux/Mac）或Ctrl+Z（Windows）结束输入
2. **GitHub Pages部署**：需要先配置GitHub仓库信息，确保本地有Git权限
3. **数据备份**：定期备份`agent/memory/novels.json`文件，防止数据丢失
4. **网站构建**：每次修改小说内容后，需要重新执行`build`或`deploy`命令更新网站

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至your-email@example.com
