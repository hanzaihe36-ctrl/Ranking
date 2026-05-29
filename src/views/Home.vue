<template>
  <div class="home-page-view">
    <HotListTab
      v-model="currentTab"
      :tabs="categories"
      @change="handleTabChange"
    />

    <div class="list-content-body">
      <LoadingState v-if="loading" />

      <EmptyState
        v-else-if="listData.length === 0"
        :message="errorMsg"
        @retry="fetchListData(true)"
      />

      <div v-else class="list-group animate-fade-in">
        <HotListItem
          v-for="(news, index) in listData"
          :key="news.id"
          :item="news"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HotListTab from "../components/HotListTab.vue";
import HotListItem from "../components/HotListItem.vue";
import LoadingState from "../components/LoadingState.vue";
import EmptyState from "../components/EmptyState.vue";
import { getTabs, getHotList } from "../api/hotlist";
import { cache } from "../utils/cache";

const currentTab = ref("all");
const categories = ref([]);
const listData = ref([]);
const loading = ref(false);
const errorMsg = ref("");

// 初始化阶段加载 Tab
onMounted(async () => {
  try {
    const tabsResult = await getTabs();
    categories.value = tabsResult;
    // 加载默认分类数据
    await fetchListData();
  } catch (err) {
    errorMsg.value = "分类目录加载失败，请刷新。";
  }
});

/**
 * 调度获取核心热榜数据
 * @param {boolean} forceRefresh 是否强制跳过缓存从网络刷新
 */
const fetchListData = async (forceRefresh = false) => {
  loading.value = true;
  errorMsg.value = "";
  const cacheKey = `hotlist_data_${currentTab.value}`;

  // 尝试读取本地时效缓存
  if (!forceRefresh) {
    const cachedArticles = cache.get(cacheKey);
    if (cachedArticles) {
      listData.value = cachedArticles;
      loading.value = false;
      return;
    }
  }

  // 执行核心API请求
  try {
    const data = await getHotList(currentTab.value);
    listData.value = data || [];
    if (listData.value.length > 0) {
      // 写入策略：缓存 5 分钟
      cache.set(cacheKey, listData.value, 300000);
    } else {
      errorMsg.value = "该品类下暂无热搜动态";
    }
  } catch (err) {
    listData.value = [];
    errorMsg.value = "服务器开小差了，获取热榜失败";
  } finally {
    loading.value = false;
  }
};

const handleTabChange = () => {
  fetchListData(false);
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
