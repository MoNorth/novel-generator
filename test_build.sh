#!/bin/bash

cd novel-generator

# 构建网站
node << 'EOF'
const NovelAgent = require('./agent/novel_agent_simple');
const agent = new NovelAgent();

// 创建小说
const novel = agent.createNovel({
  title: '都市战神归来',
  author: '佚名',
  description: '这是一个精彩的爽文故事'
});

// 添加章节
agent.addChapter(novel.id, {
  title: '开局即巅峰',
  content: '林一凡从边境战场归来，身上带着无上荣耀与惊人实力。\n他推开家门，却发现曾经的豪门已经落魄，亲人受尽欺凌。\n"谁敢动我的家人？"林一凡眼神冰冷，一股恐怖的气息瞬间弥漫开来。\n那些曾经欺辱他家人的人，吓得瑟瑟发抖，不敢置信地看着眼前的男人。\n"从今天起，我林一凡回来了，整个江城，都将为之颤抖！"'
});

// 构建网站
agent.buildSite();
console.log('测试完成！');
EOF
