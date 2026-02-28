const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NovelAgent {
  constructor() {
    this.memoryPath = path.join(__dirname, 'memory', 'novels.json');
    this.postsPath = path.join(__dirname, '..', 'source', '_posts');
    this.novels = this.loadMemory();
    
    // 创建posts目录
    if (!fs.existsSync(this.postsPath)) {
      fs.mkdirSync(this.postsPath, { recursive: true });
    }
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
    
    // 创建小说介绍页面
    this.createNovelIntroPage(novel);
    
    return novel;
  }

  createNovelIntroPage(novel) {
    const dateStr = new Date(novel.createdAt).toISOString().split('T')[0];
    const filename = `${dateStr}-${novel.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}-intro.md`;
    
    const content = `---
title: ${novel.title} - 小说简介
date: ${novel.createdAt}
updated: ${novel.updatedAt}
author: ${novel.author}
categories:
  - ${novel.title}
tags:
  - 小说
  - ${novel.title}
description: ${novel.description}
---

# ${novel.title}

**作者：** ${novel.author}

${novel.description ? `## 简介

${novel.description}
` : ''}

## 章节列表

${novel.chapters.map(chapter => 
  `- [第${chapter.chapterNumber}章：${chapter.title}](/categories/${novel.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}/${chapter.slug}.html)`
).join('\n')}
`;

    fs.writeFileSync(path.join(this.postsPath, filename), content, 'utf8');
  }

  addChapter(novelId, chapterData) {
    const novel = this.novels.novels.find(n => n.id === novelId);
    if (!novel) {
      throw new Error('小说不存在');
    }

    const chapterNumber = novel.chapters.length + 1;
    const slug = `chapter-${chapterNumber}-${chapterData.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}`;
    
    const chapter = {
      id: Date.now().toString(),
      title: chapterData.title,
      content: chapterData.content,
      chapterNumber: chapterNumber,
      slug: slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    novel.chapters.push(chapter);
    novel.updatedAt = new Date().toISOString();
    this.saveMemory();
    
    // 创建章节页面
    this.createChapterPage(novel, chapter);
    
    // 更新小说介绍页面
    this.createNovelIntroPage(novel);
    
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
    
    // 更新章节页面
    this.createChapterPage(novel, chapter);
    
    // 更新小说介绍页面
    this.createNovelIntroPage(novel);
    
    return chapter;
  }

  createChapterPage(novel, chapter) {
    const dateStr = new Date(chapter.createdAt).toISOString().split('T')[0];
    const filename = `${dateStr}-chapter-${chapter.chapterNumber}-${chapter.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}.md`;
    
    const content = `---
title: ${novel.title} - 第${chapter.chapterNumber}章：${chapter.title}
date: ${chapter.createdAt}
updated: ${chapter.updatedAt}
author: ${novel.author}
categories:
  - ${novel.title}
tags:
  - 小说
  - ${novel.title}
  - 章节
  - 第${chapter.chapterNumber}章
description: ${novel.title}第${chapter.chapterNumber}章
---

# 第${chapter.chapterNumber}章：${chapter.title}

[返回《${novel.title}》简介](/categories/${novel.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}/${dateStr}-${novel.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}-intro.html)

${chapter.content}

---

${chapter.chapterNumber > 1 ? `[上一章：第${chapter.chapterNumber - 1}章](/categories/${novel.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}/chapter-${chapter.chapterNumber - 1}.html)` : ''}
${chapter.chapterNumber < novel.chapters.length ? `[下一章：第${chapter.chapterNumber + 1}章](/categories/${novel.title.replace(/[^\w\u4e00-\u9fa5]/g, '-')}/chapter-${chapter.chapterNumber + 1}.html)` : ''}
`;

    fs.writeFileSync(path.join(this.postsPath, filename), content, 'utf8');
  }

  getNovel(novelId) {
    return this.novels.novels.find(n => n.id === novelId);
  }

  getAllNovels() {
    return this.novels.novels;
  }

  buildSite() {
    execSync('cd ' + path.join(__dirname, '..') + ' && hexo clean && hexo generate');
    console.log('网站构建完成！');
  }

  deploySite() {
    execSync('cd ' + path.join(__dirname, '..') + ' && hexo clean && hexo generate && hexo deploy');
    console.log('网站部署完成！');
  }

  // 辅助方法：清理旧的小说文件
  cleanNovelFiles(novelTitle) {
    const files = fs.readdirSync(this.postsPath);
    const novelSlug = novelTitle.replace(/[^\w\u4e00-\u9fa5]/g, '-');
    files.forEach(file => {
      if (file.includes(novelSlug)) {
        fs.unlinkSync(path.join(this.postsPath, file));
      }
    });
  }
}

module.exports = NovelAgent;