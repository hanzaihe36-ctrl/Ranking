<template>
  <div class="empty-wrapper">
    <div class="empty-icon">📭</div>
    <p class="empty-text">{{ message || "暂无相关热榜数据" }}</p>
    <button class="retry-btn" @click="$emit('retry')">点击刷新</button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "",
  },
});
defineEmits(["retry"]);
</script>

<style scoped>
.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.empty-text {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 16px;
}
.retry-btn {
  background-color: #3491fa;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.retry-btn:hover {
  background-color: #165dff;
}
</style>
