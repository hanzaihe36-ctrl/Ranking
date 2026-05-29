<template>
  <div id="app-container">
    <header class="app-global-header">
      <div class="header-inner">
        <span class="logo-emoji">⚡</span>
        <h1>今日热榜聚光灯</h1>
      </div>
    </header>
    <main class="app-main-layout">
      <HomeView />
    </main>
  </div>
</template>

<script setup>
import HomeView from "./views/Home.vue";
</script>

<style>
/* 全局基础样式重置 */
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  background-color: #f4f5f5;
  color: #1d2129;
  -webkit-font-smoothing: antialiased;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-global-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e6eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 16px;
  height: 54px;
  display: flex;
  align-items: center;
}

.header-inner h1 {
  font-size: 18px;
  margin: 0 0 0 8px;
  font-weight: 600;
  color: #1d2129;
}

.logo-emoji {
  font-size: 20px;
}

.app-main-layout {
  flex: 1;
  width: 100%;
}
</style>
