import axios from "axios";

// 模拟全局 loading 状态控制（可根据你实际的 UI 框架如 Pinia / Element Plus 进行替换）
// 这里以控制台打印和全局变量示范
let loadingCount = 0;
function showLoading() {
  if (loadingCount === 0) {
    console.log("=== [Loading] 开启全局加载状态 ===");
    // 如果用了 UI 库，这里可以调用：ElLoading.service() 或 store.toggleLoading(true)
  }
  loadingCount++;
}

function hideLoading() {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    console.log("=== [Loading] 关闭全局加载状态 ===");
    // 如果用了 UI 库，这里可以调用：loadingInstance.close() 或 store.toggleLoading(false)
  }
}

// 1. 创建 axios 实例
const request = axios.create({
  baseURL: "https://api.example.com", // 基础路径
  timeout: 10000, // 请求超时时间 10000ms
  headers: {
    "Content-Type": "application/json", // 请求头
  },
});

// 2. 请求拦截器 (Request Interceptor) - 必须实现
request.interceptors.request.use(
  (config) => {
    // 核心要求 ①：在请求发送前添加 loading 状态
    showLoading();

    // 核心要求 ②：添加通用请求头 (如 token)
    const token = localStorage.getItem("token") || "mock_token_xyz123";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 核心要求 ③：打印请求日志 (开发环境)
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `🚀 [Request Log] 发送请求: ${config.method.toUpperCase()} -> ${config.url}`,
        config.data || config.params || "",
      );
    }

    return config;
  },
  (error) => {
    // 请求错误时也需要关闭 loading
    hideLoading();
    console.error("❌ 请求发起失败:", error);
    return Promise.reject(error);
  },
);

// 3. 响应拦截器 (Response Interceptor) - 完善实现
request.interceptors.response.use(
  (response) => {
    // 核心要求 ①：请求成功完成后关闭 loading 状态
    hideLoading();

    // 核心要求 ②：统一处理响应数据 (提取 data)
    const res = response.data;

    // 假设后端标准返回格式中，用 code 表示业务状态
    if (res.code === 200 || response.status === 200) {
      return res.data || res; // 提取并返回业务数据 data
    }

    // 核心要求 ③ & ④：业务错误统一处理与提示
    const businessError = res.msg || "出现业务错误";
    alert(`业务提示: ${businessError}`); // 弹窗或控制台提示
    return Promise.reject(new Error(businessError));
  },
  (error) => {
    // 核心要求 ①：请求失败/完成后同样必须关闭 loading 状态
    hideLoading();

    // 核心要求 ③ & ④：统一处理网络错误、HTTP 错误，并给出提示
    let errMsg = "未知网络错误";

    if (error.response) {
      // HTTP 错误 (状态码非 2xx，如 400, 403, 404, 500)
      switch (error.response.status) {
        case 401:
          errMsg = "未授权，请重新登录";
          break;
        case 403:
          errMsg = "拒绝访问";
          break;
        case 404:
          errMsg = "请求地址不存在";
          break;
        case 500:
          errMsg = "服务器内部错误";
          break;
        default:
          errMsg = `服务器错误(${error.response.status})`;
      }
    } else if (error.request) {
      // 网络错误或请求超时 (没有收到响应)
      if (error.message.includes("timeout")) {
        errMsg = "请求超时，请检查网络后重试";
      } else {
        errMsg = "网络连接断开，请检查网络";
      }
    } else {
      errMsg = error.message;
    }

    // 错误提示 (同时满足 console.error 和界面友好提示)
    console.error("🚨 [API Error Log]:", error);
    alert(`系统错误: ${errMsg}`);

    return Promise.reject(error);
  },
);

export default request;
