<template>
  <div class="home-page-view">
    <header class="home-top-bar">
      <div class="app-title-row">
        <h2>🔥 全网热榜聚合聚合系统</h2>
      </div>

      <div class="search-box-wrapper">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="🔍 输入关键词，实时过滤当前热搜标题..."
          class="search-input"
        />
        <button class="refresh-action-btn" @click="handleManualRefresh">
          🔄 刷新数据
        </button>
      </div>

      <div class="sort-bar">
        <span>数据排序：</span>
        <select v-model="sortRule" class="sort-select">
          <option value="rank">按默认排名</option>
          <option value="heat">按热度值从高到低</option>
        </select>
      </div>
    </header>

    <HotListTab
      v-model="currentTab"
      :tabs="categories"
      @change="handleTabChange"
    />

    <div class="list-content-body">
      <LoadingState v-if="loading" />

      <EmptyState
        v-else-if="filteredAndSortedList.length === 0"
        :message="searchKeyword ? '未找到包含该关键词的热搜条目' : errorMsg"
        @retry="handleManualRefresh"
      />

      <div v-else class="list-group animate-fade-in">
        <HotListItem
          v-for="(news, index) in filteredAndSortedList"
          :key="news.id"
          :item="news"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import HotListTab from "../components/HotListTab.vue";
import HotListItem from "../components/HotListItem.vue";
import LoadingState from "../components/LoadingState.vue";
import EmptyState from "../components/EmptyState.vue";
import { getTabs, getHotList } from "../api/hotlist";
import { setCache, getCache, clearCache } from "../utils/cache";

const currentTab = ref("bilibili"); // 默认激活B站，可修改为'weibo'或'zhihu'
const categories = ref([]);
const listData = ref([]);
const loading = ref(false);
const errorMsg = ref("");

// 搜索与排序响应式变量
const searchKeyword = ref("");
const sortRule = ref("rank");

// 初始化挂载阶段
onMounted(async () => {
  try {
    const tabsResult = await getTabs();
    categories.value = tabsResult;
    // 加载默认分类数据
    await fetchHotList(currentTab.value);
  } catch (err) {
    errorMsg.value = "分类目录加载失败，请刷新。";
  }
});

/**
 * 实验要求核心函数 1：获取指定平台热搜数据 (fetchHotList)
 */
const fetchHotList = async (platform, forceRefresh = false) => {
  loading.value = true;
  errorMsg.value = "";

  // 严格遵循实验规范的缓存键名规则 (动态追加平台标识)
  const cacheKey = `hotlist_${platform}_cache`;

  // 优先读取本地缓存
  if (!forceRefresh) {
    const cachedArticles = getCache(cacheKey);
    if (cachedArticles) {
      listData.value = cachedArticles;
      loading.value = false;
      return;
    }
  }

  // 缓存不存在或已过期，发起真实 API 网络请求
  try {
    const data = await getHotList(platform);
    listData.value = data || [];
    if (listData.value.length > 0) {
      // 成功获取后写入缓存，时效 5 分钟 (300000ms)
      setCache(cacheKey, listData.value, 300000);
    } else {
      errorMsg.value = "暂无数据";
    }
  } catch (err) {
    listData.value = [];
    // 拦截器已弹出 alert，这里负责承载页面状态兜底文案
    errorMsg.value = "网络连接失败";
  } finally {
    loading.value = false;
  }
};

/**
 * 实验要求核心函数 2：刷新指定平台数据 (refreshHotList)
 */
const refreshHotList = async (platform) => {
  const cacheKey = `hotlist_${platform}_cache`;
  clearCache(cacheKey); // 清除该平台的本地缓存
  await fetchHotList(platform, true); // 强行发起真实网络请求并更新缓存
};

/**
 * 实验要求核心函数 3：搜索热搜(按标题筛选) (searchHotList)
 */
const searchHotList = (keyword, list) => {
  if (!keyword) return list;
  return list.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );
};

/**
 * 实验要求核心函数 4：排序(按热度或排名) (sortHotList)
 */
const sortHotList = (list, by) => {
  const targetList = [...list]; // 浅拷贝一份，避免直接污染响应式原始数组
  if (by === "heat") {
    return targetList.sort((a, b) => b.heat - a.heat); // 按热度高低降序排列
  }
  // 默认返回保持原有的 rank 排名顺序
  return targetList;
};

// 联动：利用计算属性实时获取过滤、排序完成后的最终渲染数组
const filteredAndSortedList = computed(() => {
  // 1. 执行实时关键词检索过滤
  const searchedResult = searchKeyword.value
    ? searchHotList(searchKeyword.value, listData.value)
    : listData.value;

  // 2. 执行多规则排序并向外输出
  return sortHotList(searchedResult, sortRule.value);
});

// 事件拦截处理器
const handleTabChange = (platform) => {
  searchKeyword.value = ""; // 切换平台时重置搜索内容
  fetchHotList(platform, false);
};

const handleManualRefresh = () => {
  refreshHotList(currentTab.value);
};
</script>

<style scoped>
.home-page-view {
  max-width: 680px;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 顶部搜索、工具栏与交互组件的特定样式扩展 */
.home-top-bar {
  padding: 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e6eb;
}
.app-title-row h2 {
  margin: 0 0 14px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
}
.search-box-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.search-input {
  flex: 1;
  padding: 8px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #165dff;
}
.refresh-action-btn {
  background-color: #165dff;
  color: #fff;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.2s;
}
.refresh-action-btn:hover {
  background-color: #0e42d2;
}
.sort-bar {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #4e5969;
}
.sort-select {
  padding: 4px 8px;
  border: 1px solid #cfd3dc;
  border-radius: 4px;
  outline: none;
  background-color: #fff;
}

.list-content-body {
  min-height: 400px;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
