import request from "./request";

/**
 * 获取热榜分类标签列表
 * @returns {Promise}
 */
export function getTabs() {
  // 模拟/返回支持的分类：如 综合、科技、娱乐、体育 等
  return Promise.resolve([
    { id: "all", name: "综合" },
    { id: "tech", name: "科技" },
    { id: "ent", name: "娱乐" },
    { id: "finance", name: "财经" },
  ]);
}

/**
 * 根据分类 ID 获取对应的热榜列表数据
 * @param {string} type 分类标识
 * @returns {Promise}
 */
export function getHotList(type) {
  return request({
    url: `/hotlist/${type}`,
    method: "get",
  });
}
