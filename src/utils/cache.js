/**
 * 严格对齐实验要求：带有过期时间本地缓存工具
 */

/**
 * 设置缓存(带过期时间)
 * @param {string} key 缓存键名规则: hotlist_${platform}_${timestamp}
 * @param {Array} data 热搜数据
 * @param {number} expire 有效期时间（毫秒），默认5分钟 (300000ms)
 */
export function setCache(key, data, expire = 300000) {
  const now = Date.now();
  const cachedData = {
    data: data, // 实验要求字段：热搜数据
    timestamp: now, // 实验要求字段：缓存时间戳
    expire: now + expire, // 实验要求字段：过期时间(毫秒)
  };
  localStorage.setItem(key, JSON.stringify(cachedData));
}

/**
 * 获取缓存(检查是否过期)
 * @param {string} key 缓存键名
 * @returns {Array | null} 缓存存在且未过期则返回数据，否则返回 null
 */
export function getCache(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const cachedData = JSON.parse(raw);
    // 检查是否过期
    if (Date.now() > cachedData.expire) {
      clearCache(key); // 过期释放空间
      return null;
    }
    return cachedData.data; // 返回热搜数据数组
  } catch (e) {
    return null;
  }
}

/**
 * 清除指定缓存
 * @param {string} key
 */
export function clearCache(key) {
  localStorage.removeItem(key);
}

/**
 * 清除所有缓存
 */
export function clearAllCache() {
  localStorage.clear();
}
