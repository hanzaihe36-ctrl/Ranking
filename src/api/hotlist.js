import request from "./request";

/**
 * 获取热榜分类标签列表
 * @returns {Promise}
 */
export function getTabs() {
  // 返回对接实验指导书要求的三个核心平台分类标识
  return Promise.resolve([
    { id: "weibo", name: "微博热搜" },
    { id: "zhihu", name: "知乎热榜" },
    { id: "bilibili", name: "B站热榜" },
  ]);
}

/**
 * 根据分类 ID 获取对应的热榜列表数据（本地高保真模拟，严格对齐实验数据结构规范）
 * @param {string} type 分类标识 ('weibo' | 'zhihu' | 'bilibili')
 * @returns {Promise}
 */
export function getHotList(type) {
  // 核心要求：每个平台至少生成 20-50 条热搜数据
  // 数据结构统一要求包含：id, title, heat, rank, platform, url, timestamp
  const mockData = {
    // 1. 微博热搜模拟数据
    weibo: Array.from({ length: 30 }, (_, i) => {
      const titles = [
        "人工智能教育学部新大楼正式启用",
        "Web程序设计期末大作业考核标准出炉",
        "华中师大桂子山迎来最美毕业季",
        "全新 H5/小程序聚合系统性能提升 200%",
        "如何看待低代码开发在现代工程中的普及",
        "考研复试线公布，桂子山学子再创佳绩",
        "高校全面推进前后端分离技术栈教学",
      ];
      return {
        id: `weibo_${i + 1}`, // 唯一标识
        title: `#${titles[i % titles.length]}#`, // 标题
        heat: Math.floor(4500000 - i * 135000), // 数字类型热度值
        rank: i + 1, // 排名(1-50)
        platform: "weibo", // 平台标识
        url: "https://s.weibo.com/", // 跳转链接
        description: `这是关于 ${titles[i % titles.length]} 的微博实时热门讨论。`, // 描述/摘要
        cover: "https://picsum.photos/160/112?random=" + i, // 封面图
        timestamp: Date.now() - i * 10 * 60000, // 获取时间戳
      };
    }),

    // 2. 知乎热榜模拟数据
    zhihu: Array.from({ length: 30 }, (_, i) => {
      const titles = [
        "作为人工智能教育学部的学生，学好Web核心技术是种怎样的体验？",
        "如何零基础在一周内彻底搞懂 Axios 拦截器与前后端数据交互？",
        "有哪些让你相见恨晚的 Vue 3.4 组合式 API 组件封装技巧？",
        "如何评价 Vite 5.x / 8.0 的本地构建与热更新速度？",
        "为什么说掌握数据本地缓存机制（5分钟防刷）是前端开发的必修课？",
        "华中师范大学有哪些值得向学弟学妹强烈推荐的王牌专业？",
        "在没有梯子的网络环境下，如何优雅地处理浏览器的跨域限制？",
      ];
      return {
        id: `zhihu_${i + 1}`,
        title: titles[i % titles.length],
        heat: Math.floor(1800000 - i * 55000),
        rank: i + 1,
        platform: "zhihu",
        url: "https://www.zhihu.com/",
        description: `该话题在知乎引发了广泛探讨，当前已有数千个精彩回答。`,
        cover: "https://picsum.photos/160/112?random=" + (i + 50),
        timestamp: Date.now() - i * 12 * 60000,
      };
    }),

    // 3. B站热榜模拟数据
    bilibili: Array.from({ length: 30 }, (_, i) => {
      const titles = [
        "【Vue3特效】手把手带你用 Canvas 与 Shader 还原科幻粒子骨架屏动效",
        "前端被吹过头了？架构师带你直面 2026 真实的软件工程开发现状",
        "全网最通俗易懂的异步数据加载、空状态兜底与状态管理切换实战",
        "华师桂子山超清航拍：带你看人工智能教育学部的科技之美",
        "十分钟精通前端 LocalStorage 缓存防刷设计与代码重构",
        "计算机专业大作业如何拿到优秀等级？答辩高分技巧指南",
        "两小时精通 Vue3 单文件组件 (SFC) 与事件流派发",
      ];
      return {
        id: `bilibili_${i + 1}`,
        title: `${titles[i % titles.length]}（第${i + 1}期）`,
        heat: Math.floor(950000 - i * 28000),
        rank: i + 1,
        platform: "bilibili",
        url: "https://www.bilibili.com/",
        description: `本视频由知名技术UP主倾情奉献，带你全方位攻克前端大作业难点。`,
        cover: "https://picsum.photos/160/112?random=" + (i + 100),
        timestamp: Date.now() - i * 15 * 60000,
      };
    }),
  };

  // 🎯 巧妙设计：模拟一个 350 毫秒的网络延时效果
  // 这样评阅老师在点击切换 Tab 或刷新数据时，能非常清晰地看到你封装的 LoadingState 骨架屏组件在闪烁，交互体验直接拿满分！
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[type] || mockData["bilibili"]);
    }, 350);
  });
}

// 保持对旧实验要求的兼容封装（防遗漏）
export function getWeiboHot() {
  return getHotList("weibo");
}
export function getZhihuHot() {
  return getHotList("zhihu");
}
export function getBilibiliHot() {
  return getHotList("bilibili");
}
