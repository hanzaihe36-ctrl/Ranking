import request from "./request";

/**
 * 获取热榜分类标签列表
 * @returns {Promise}
 */
export function getTabs() {
  return Promise.resolve([
    { id: "weibo", name: "微博热搜" },
    { id: "zhihu", name: "知乎热榜" },
    { id: "bilibili", name: "B站热榜" },
  ]);
}

// 模拟每个平台 30 条的高保真数据源仓库（保证必填字段齐全且热度值为数字类型）
const mockDatabase = {
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
      id: `weibo_${i + 1}`,
      title: `#${titles[i % titles.length]}#`,
      heat: Math.floor(4500000 - i * 135000),
      rank: i + 1,
      platform: "weibo",
      url: "https://s.weibo.com/",
      description: `这是关于 ${titles[i % titles.length]} 的微博实时热门讨论。`,
      cover: "https://picsum.photos/160/112?random=" + i,
      timestamp: Date.now() - i * 10 * 60000,
    };
  }),

  zhihu: Array.from({ length: 30 }, (_, i) => {
    const titles = [
      "作为人工智能教育学部的学生，学好Web核心技术是种怎样的体验？",
      "如何零基础在一周内彻底搞懂 Axios 拦截器与前后端数据交互？",
      "有哪些让你相见慢晚的 Vue 3.4 组合式 API 组件封装技巧？",
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

/**
 * 🎯 严格对齐 PDF 任务 1.4：封装特定平台的具名导出函数
 */
export function getWeiboHot() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDatabase.weibo), 350);
  });
}

export function getZhihuHot() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDatabase.zhihu), 350);
  });
}

export function getBilibiliHot() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDatabase.bilibili), 350);
  });
}

/**
 * 基础动态路由请求分发函数（供主页调用，完美关联具名函数）
 */
export function getHotList(type) {
  if (type === "weibo") return getWeiboHot();
  if (type === "zhihu") return getZhihuHot();
  return getBilibiliHot();
}
