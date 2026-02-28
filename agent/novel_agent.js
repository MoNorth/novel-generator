const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NovelAgent {
  constructor() {
    this.memoryPath = path.join(__dirname, 'memory', 'novels.json');
    this.sourcePath = path.join(__dirname, '..', 'source', '_posts');
    this.novels = this.loadMemory();
  }

  loadMemory() {
    try {
      const data = fs.readFileSync(this.memoryPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return { novels: [] };
    }
  }

  saveMemory() {
    fs.writeFileSync(this.memoryPath, JSON.stringify(this.novels, null, 2), 'utf8');
  }

  createNovel(novelData) {
    const novel = {
      id: Date.now().toString(),
      title: novelData.title,
      author: novelData.author || '佚名',
      description: novelData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: []
    };

    this.novels.novels.push(novel);
    this.saveMemory();
    this.generateNovelPage(novel);
    return novel;
  }

  addChapter(novelId, chapterData) {
    const novel = this.novels.novels.find(n => n.id === novelId);
    if (!novel) {
      throw new Error('小说不存在');
    }

    const chapter = {
      id: Date.now().toString(),
      title: chapterData.title,
      content: chapterData.content,
      chapterNumber: novel.chapters.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    novel.chapters.push(chapter);
    novel.updatedAt = new Date().toISOString();
    this.saveMemory();
    this.generateChapterPage(novel, chapter);
    this.updateNovelPage(novel);
    return chapter;
  }

  updateChapter(novelId, chapterId, chapterData) {
    const novel = this.novels.novels.find(n => n.id === novelId);
    if (!novel) {
      throw new Error('小说不存在');
    }

    const chapter = novel.chapters.find(c => c.id === chapterId);
    if (!chapter) {
      throw new Error('章节不存在');
    }

    chapter.title = chapterData.title || chapter.title;
    chapter.content = chapterData.content || chapter.content;
    chapter.updatedAt = new Date().toISOString();
    novel.updatedAt = new Date().toISOString();
    this.saveMemory();
    this.generateChapterPage(novel, chapter);
    this.updateNovelPage(novel);
    return chapter;
  }

  getNovel(novelId) {
    return this.novels.novels.find(n => n.id === novelId);
  }

  getAllNovels() {
    return this.novels.novels;
  }

  generateNovelPage(novel) {
    const novelDir = path.join(this.sourcePath, 'novels', novel.id);
    if (!fs.existsSync(novelDir)) {
      fs.mkdirSync(novelDir, { recursive: true });
    }

    const content = `---
title: ${novel.title}
date: ${novel.createdAt}
updated: ${novel.updatedAt}
author: ${novel.author}
description: ${novel.description}
layout: post
---

# ${novel.title}

**作者：** ${novel.author}

${novel.description ? `## 简介

${novel.description}
` : ''}

## 章节列表

${novel.chapters.map(chapter => 
  `- [第${chapter.chapterNumber}章：${chapter.title}](/novels/${novel.id}/chapter-${chapter.chapterNumber}.html)`
).join('\n')}
`;

    fs.writeFileSync(path.join(novelDir, 'index.md'), content, 'utf8');
  }

  updateNovelPage(novel) {
    this.generateNovelPage(novel);
  }

  generateChapterPage(novel, chapter) {
    const novelDir = path.join(this.sourcePath, 'novels', novel.id);
    if (!fs.existsSync(novelDir)) {
      fs.mkdirSync(novelDir, { recursive: true });
    }

    const content = `---
title: 第${chapter.chapterNumber}章：${chapter.title}
date: ${chapter.createdAt}
updated: ${chapter.updatedAt}
novelTitle: ${novel.title}
novelId: ${novel.id}
chapterNumber: ${chapter.chapterNumber}
layout: post
---

# 第${chapter.chapterNumber}章：${chapter.title}

[返回小说目录](/novels/${novel.id}/index.html)

${chapter.content}

---

${chapter.chapterNumber > 1 ? `[上一章：第${chapter.chapterNumber - 1}章](/novels/${novel.id}/chapter-${chapter.chapterNumber - 1}.html)` : ''}
${chapter.chapterNumber < novel.chapters.length ? `[下一章：第${chapter.chapterNumber + 1}章](/novels/${novel.id}/chapter-${chapter.chapterNumber + 1}.html)` : ''}
`;

    fs.writeFileSync(path.join(novelDir, `chapter-${chapter.chapterNumber}.md`), content, 'utf8');
  }

  generateHomePage() {
    const homeContent = `---
title: 爽文生成器
date: ${new Date().toISOString()}
layout: post
---

# 爽文生成器

欢迎使用爽文生成器！在这里你可以创建、管理和阅读你的专属爽文。

## 小说列表

${this.novels.novels.map(novel => 
  `### [${novel.title}](/novels/${novel.id}/index.html)

**作者：** ${novel.author}
${novel.description ? `**简介：** ${novel.description}\n` : ''}
**章节数：** ${novel.chapters.length}章
**更新时间：** ${new Date(novel.updatedAt).toLocaleString('zh-CN')}
`
).join('\n\n')}
`;

    fs.writeFileSync(path.join(this.sourcePath, 'index.md'), homeContent, 'utf8');
  }

  buildSite() {
    this.generateHomePage();
    execSync('cd ' + path.join(__dirname, '..') + ' && hexo generate');
    console.log('网站构建完成！');
  }

  deploySite() {
    this.buildSite();
    execSync('cd ' + path.join(__dirname, '..') + ' && hexo deploy');
    console.log('网站部署完成！');
  }
}

module.exports = NovelAgent;