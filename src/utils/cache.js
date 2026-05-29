/**
 * 带有过期时间本地缓存工具
 */
export const cache = {
  /**
   * 设置缓存
   * @param {string} key 键名
   * @param {any} value 键值
   * @param {number} expire 有效期时间（毫秒），默认5分钟 (5 * 60 * 1000)
   */
  set(key, value, expire = 300000) {
    const cachedData = {
      value,
      expireTime: Date.now() + expire,
    };
    localStorage.setItem(key, JSON.stringify(cachedData));
  },

  /**
   * 获取缓存
   * @param {string} key 键名
   * @returns {any | null} 缓存未过期则返回数据，否则返回 null
   */
  get(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      const cachedData = JSON.parse(raw);
      // 检查是否过期
      if (Date.now() > cachedData.expireTime) {
        localStorage.removeItem(key); // 过期释放空间
        return null;
      }
      return cachedData.value;
    } catch (e) {
      return null;
    }
  },

  /**
   * 清除指定缓存
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(key);
  },
};
