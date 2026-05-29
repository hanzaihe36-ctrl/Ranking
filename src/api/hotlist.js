import request from "./request";

/**
 * 获取热榜分类标签列表
 * @returns {Promise}
 */
export function getTabs() {
  // 返回对接开源 DailyHotApi 支持的核心分类标识（id 需与第三方接口路径一致）
  return Promise.resolve([
    { id: "bilibili", name: "B站热榜" },
    { id: "weibo", name: "微博热搜" },
    { id: "zhihu", name: "知乎热榜" },
    { id: "toutiao", name: "头条热点" },
  ]);
}

/**
 * 根据分类 ID 获取对应的热榜列表数据
 * @param {string} type 分类标识
 * @returns {Promise}
 */
export function getHotList(type) {
  return request({
    url: `/${type}`, // 请求对应的端点，如 /bilibili 或 /weibo
    method: "get",
  }).then((res) => {
    // 拿到原始数据后，进行数据结构统一转换
    const rawList = res.data || res;

    if (!Array.isArray(rawList)) return [];

    // 🎯 核心修改：严格在 API 层统一转换为图二要求的格式：id, title, heat
    return rawList.map((item, index) => {
      return {
        id: item.id || `${type}_${index}`, // 唯一标识
        title: item.title || "无标题", // 标题
        heat: Number(item.hot || item.heat || item.hotScore || 0), // 热度值（抹平不同平台热度字段差异）

        // 保留跳转所需的外部链接和其它非必填项
        url: item.url || "",
        publishTime: item.publishTime || new Date().toISOString(),
        thumb: item.thumbnail || item.thumb || "",
      };
    });
  });
}
