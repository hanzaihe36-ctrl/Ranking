import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"; // 全局通用基础样式文件

// 创建并实例化应用
const app = createApp(App);

// 挂载至公共 HTML DOM 节点
app.mount("#app");
