import axios from "axios";

// 模拟全局 loading 状态控制
let loadingCount = 0;
function showLoading() {
  if (loadingCount === 0) {
    console.log("=== [Loading] 开启全局加载状态 ===");
  }
  loadingCount++;
}

function hideLoading() {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    console.log("=== [Loading] 关闭全局加载状态 ===");
  }
}

// 1. 创建 axios 实例
const request = axios.create({
  // 推荐直接改用图一公开的 DailyHotApi 部署地址
  baseURL: "https://hot.imsyy.top",
  timeout: 10000, // 请求超时时间 10000ms
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 请求拦截器 (Request Interceptor)
request.interceptors.request.use(
  (config) => {
    // 在请求发送前添加 loading 状态
    showLoading();

    // 添加通用请求头 (如 token)
    const token = localStorage.getItem("token") || "mock_token_xyz123";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 打印请求日志 (Vite 环境下的开发环境判断)
    if (import.meta.env.DEV) {
      console.log(
        `🚀 [Request Log] 发送请求: ${config.method.toUpperCase()} -> ${config.url}`,
        config.data || config.params || "",
      );
    }

    return config;
  },
  (error) => {
    hideLoading();
    console.error("❌ 请求发起失败:", error);
    return Promise.reject(error);
  },
);

// 3. 响应拦截器 (Response Interceptor)
request.interceptors.response.use(
  (response) => {
    // 请求成功完成后关闭 loading 状态
    hideLoading();

    const res = response.data;
    // 兼容部分接口直接返回数组或带 code 的标准结构
    if (res.code === 200 || response.status === 200) {
      return res.data || res; // 提取并返回业务数据
    }

    alert(`业务提示: ${res.msg || "出现业务错误"}`);
    return Promise.reject(new Error(res.msg || "出现业务错误"));
  },
  (error) => {
    // 请求失败/完成后同样必须关闭 loading 状态
    hideLoading();

    // 🎯 核心修改：严格统一处理网络错误、HTTP 错误、超时错误，并给出图二指定的提示文本
    let errMsg = "未知错误";

    if (error.response) {
      // HTTP 错误 (状态码非 2xx，如 500, 404, 403)
      errMsg = "服务器异常"; // 严格对齐图二要求的提示
    } else if (error.request) {
      // 没有收到响应 (网络问题或超时)
      if (error.message.includes("timeout")) {
        errMsg = "请求超时，请稍后重试"; // 严格对齐图二要求的提示
      } else {
        errMsg = "网络连接失败"; // 严格对齐图二要求的提示
      }
    } else {
      errMsg = error.message;
    }

    // 弹出作业要求的界面友好提示
    alert(errMsg);
    console.error("🚨 [API Error Log]:", error);

    return Promise.reject(error);
  },
);

export default request;
