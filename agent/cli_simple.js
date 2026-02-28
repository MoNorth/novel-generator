#!/usr/bin/env node

const NovelAgent = require('./novel_agent_simple');
const readline = require('readline');

const agent = new NovelAgent();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '爽文生成器> '
});

console.log('=== 爽文生成器 CLI ===');
console.log('可用命令：');
console.log('  create-novel <标题> [作者] [简介] - 创建新小说');
console.log('  add-chapter <小说ID> <章节标题> - 添加新章节');
console.log('  update-chapter <小说ID> <章节ID> - 更新章节内容');
console.log('  list-novels - 列出所有小说');
console.log('  get-novel <小说ID> - 获取小说详情');
console.log('  build - 构建网站');
console.log('  deploy - 部署网站');
console.log('  exit - 退出');
console.log('');

rl.prompt();

rl.on('line', (line) => {
  const args = line.trim().split(' ');
  const command = args[0];

  switch (command) {
    case 'create-novel':
      if (args.length < 2) {
        console.log('用法：create-novel <标题> [作者] [简介]');
      } else {
        const title = args[1];
        const author = args[2] || '佚名';
        const description = args.slice(3).join(' ') || '';
        const novel = agent.createNovel({ title, author, description });
        console.log(`小说创建成功！ID：${novel.id}`);
        console.log(`标题：${novel.title}`);
      }
      break;

    case 'add-chapter':
      if (args.length < 3) {
        console.log('用法：add-chapter <小说ID> <章节标题>');
      } else {
        const novelId = args[1];
        const chapterTitle = args[2];
        console.log('请输入章节内容（输入EOF结束）：');
        let content = '';
        const contentRl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: ''
        });
        contentRl.on('line', (line) => {
          content += line + '\n';
        });
        contentRl.on('close', () => {
          try {
            const chapter = agent.addChapter(novelId, { title: chapterTitle, content });
            console.log(`章节添加成功！ID：${chapter.id}`);
            console.log(`章节号：第${chapter.chapterNumber}章`);
          } catch (err) {
            console.error('错误：', err.message);
          }
          rl.prompt();
        });
      }
      break;

    case 'update-chapter':
      if (args.length < 3) {
        console.log('用法：update-chapter <小说ID> <章节ID>');
      } else {
        const novelId = args[1];
        const chapterId = args[2];
        const novel = agent.getNovel(novelId);
        if (!novel) {
          console.error('错误：小说不存在');
          rl.prompt();
          return;
        }
        const chapter = novel.chapters.find(c => c.id === chapterId);
        if (!chapter) {
          console.error('错误：章节不存在');
          rl.prompt();
          return;
        }
        console.log('当前章节内容：');
        console.log(chapter.content);
        console.log('请输入新的章节内容（输入EOF结束）：');
        let content = '';
        const contentRl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: ''
        });
        contentRl.on('line', (line) => {
          content += line + '\n';
        });
        contentRl.on('close', () => {
          try {
            const updatedChapter = agent.updateChapter(novelId, chapterId, { content });
            console.log(`章节更新成功！`);
          } catch (err) {
            console.error('错误：', err.message);
          }
          rl.prompt();
        });
      }
      break;

    case 'list-novels':
      const novels = agent.getAllNovels();
      if (novels.length === 0) {
        console.log('暂无小说');
      } else {
        console.log('小说列表：');
        novels.forEach(novel => {
          console.log(`ID: ${novel.id}`);
          console.log(`标题: ${novel.title}`);
          console.log(`作者: ${novel.author}`);
          console.log(`章节数: ${novel.chapters.length}章`);
          console.log(`创建时间: ${new Date(novel.createdAt).toLocaleString('zh-CN')}`);
          console.log(`更新时间: ${new Date(novel.updatedAt).toLocaleString('zh-CN')}`);
          console.log('---');
        });
      }
      break;

    case 'get-novel':
      if (args.length < 2) {
        console.log('用法：get-novel <小说ID>');
      } else {
        const novel = agent.getNovel(args[1]);
        if (!novel) {
          console.error('错误：小说不存在');
        } else {
          console.log(`小说详情：`);
          console.log(`ID: ${novel.id}`);
          console.log(`标题: ${novel.title}`);
          console.log(`作者: ${novel.author}`);
          console.log(`简介: ${novel.description}`);
          console.log(`创建时间: ${new Date(novel.createdAt).toLocaleString('zh-CN')}`);
          console.log(`更新时间: ${new Date(novel.updatedAt).toLocaleString('zh-CN')}`);
          console.log(`章节列表：`);
          novel.chapters.forEach(chapter => {
            console.log(`  第${chapter.chapterNumber}章: ${chapter.title} (ID: ${chapter.id})`);
          });
        }
      }
      break;

    case 'build':
      console.log('正在构建网站...');
      agent.buildSite();
      console.log('网站构建完成！');
      break;

    case 'deploy':
      console.log('正在部署网站...');
      try {
        agent.deploySite();
        console.log('网站部署完成！');
      } catch (err) {
        console.error('部署失败：', err.message);
      }
      break;

    case 'exit':
      console.log('再见！');
      process.exit(0);
      break;

    default:
      console.log(`未知命令：${command}`);
      break;
  }

  rl.prompt();
}).on('close', () => {
  console.log('再见！');
  process.exit(0);
});