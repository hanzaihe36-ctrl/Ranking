<template>
  <div class="hot-item-card" @click="goExternalSource">
    <div
      :class="['rank-badge', `rank-${index + 1}`, { 'top-three': index < 3 }]"
    >
      {{ index + 1 }}
    </div>

    <div class="item-main-content">
      <h3 class="item-title">{{ item.title }}</h3>
      <div class="item-meta-info">
        <span :class="['platform-tag', item.platform]">
          {{ getPlatformName(item.platform) }}
        </span>
        <span class="hot-value">🔥 {{ formatHotValue(item.heat) }}</span>
        <span class="dot">·</span>
        <span class="time-stamp">{{ formatTime(item.publishTime) }}</span>
        <span v-if="clickCount > 0" class="click-tag"
          >已读 {{ clickCount }}次</span
        >
      </div>
    </div>

    <div v-if="item.thumb" class="item-thumb-wrapper">
      <img :src="item.thumb" alt="thumb" loading="lazy" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const clickCount = ref(0);

// 从本地存储读取该条目的独立点击深度统计
onMounted(() => {
  const storedClicks = localStorage.getItem(`click_hot_${props.item.id}`);
  if (storedClicks) {
    clickCount.value = parseInt(storedClicks, 10);
  }
});

// 🎯 严格对齐最新 PDF 要求：将转换后的平台标识英文标识转化为中文文字展示
const getPlatformName = (platform) => {
  const nameMap = {
    weibo: "微博",
    zhihu: "知乎",
    bilibili: "B站",
  };
  return nameMap[platform] || "热点";
};

// 人性化热度转换数据机制
const formatHotValue = (score) => {
  if (!score) return "0";
  if (score >= 10000) {
    return (score / 10000).toFixed(1) + "万";
  }
  return score.toLocaleString();
};

// 格式化时间串
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 60) return diffMin <= 0 ? "刚刚" : `${diffMin}分钟前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}小时前`;

  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 安全重定向外部原始源链接链接并累计统计
const goExternalSource = () => {
  clickCount.value++;
  localStorage.setItem(
    `click_hot_${props.item.id}`,
    clickCount.value.toString(),
  );

  if (props.item.url) {
    window.open(props.item.url, "_blank", "noopener,noreferrer");
  }
};
</script>

<style scoped>
.hot-item-card {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f2f3f5;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s;
}
.hot-item-card:hover {
  background-color: #f8fafc;
}

.rank-badge {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: #86909c;
  margin-right: 14px;
  border-radius: 4px;
  flex-shrink: 0;
}
.rank-badge.top-three {
  color: #fff;
}
.rank-1 {
  background-color: #ff4d4f;
}
.rank-2 {
  background-color: #ff7a45;
}
.rank-3 {
  background-color: #ffec3d;
  color: #d46b08 !important;
}

.item-main-content {
  flex: 1;
  padding-right: 8px;
}
.item-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1d2129;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #86909c;
  flex-wrap: wrap;
  gap: 6px;
}

/* 🎯 新增平台彩色文字标签样式 */
.platform-tag {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.platform-tag.weibo {
  background-color: #fbeeed;
  color: #eb5757;
}
.platform-tag.zhihu {
  background-color: #e8f3ff;
  color: #165dff;
}
.platform-tag.bilibili {
  background-color: #feeff7;
  color: #f5319d;
}

.dot {
  margin: 0 2px;
}
.hot-value {
  color: #ff7a45;
}
.click-tag {
  margin-left: auto;
  background-color: #f2f3f5;
  padding: 2px 6px;
  border-radius: 10px;
  color: #4e5969;
}

.item-thumb-wrapper {
  width: 80px;
  height: 56px;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 8px;
  flex-shrink: 0;
}
.item-thumb-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
