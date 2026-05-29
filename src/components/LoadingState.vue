<template>
  <div class="skeleton-container">
    <div class="skeleton-item" v-for="i in 8" :key="i">
      <div class="skeleton-rank"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  padding: 16px;
}
.skeleton-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.skeleton-rank {
  width: 24px;
  height: 24px;
  background: #f0f2f5;
  border-radius: 4px;
  margin-right: 12px;
  animation: pulse 1.5s infinite ease-in-out;
}
.skeleton-content {
  flex: 1;
}
.skeleton-title {
  width: 75%;
  height: 16px;
  background: #f0f2f5;
  border-radius: 4px;
  margin-bottom: 8px;
  animation: pulse 1.5s infinite ease-in-out;
}
.skeleton-meta {
  width: 40%;
  height: 12px;
  background: #f0f2f5;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
