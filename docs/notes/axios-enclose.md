# axios最全二次封装

待补充内容...

## Vue3+TS+Vite+element-plus如何完美二次封装axios

#### 主要实现的功能有：

1.  **Loading 动画**：在请求发起时显示加载动画，结束时关闭。
2.  **防止重复请求**：利用 `CancelToken` 防止短时间内重复请求,使用 `generateRequestKey` 函数为每个请求生成一个唯一的 key。
3.  **自动刷新 Token**：当返回 401 错误时，尝试刷新 `Token` 并重新发起请求。
4.  **文件上传支持**：根据 `Content-Type` 自动设置请求头。
5.  **禁用浏览器缓存**：确保每次请求都能从服务器获取最新的数据，而不是使用浏览器缓存的数据。
6.  **错误状态统一处理**：状态码401/403/500/502/503等等处理，后端返回报文message展示。

## 推荐项目
- 这是一个国际化全栈中后台解决方案，支持16种语言切换
- 前端：vue3.5+typescript+vite5+pinia+element-plus+unocss+sass
- 后端nodejs+express+mySQL/postgreSQL+redis的管理后台项目
- github代码仓库  [kilyicms](https://github.com/durunsong/kilyicms.git)
- 创作不易希望点个star⭐⭐⭐

## 遵循的原则：

- 二次封装`axios`很有必要，但是过度封装`害人害己`

## 经常使用axios的同学一定非常熟悉aixos两部分很重要,其他的都是按照业务需要累加上去的

- **配置对象 defaults** ：config
- **拦截器对象 interceptors**：请求拦截器 `xxx.request`，响应拦截器  `xxx.response`

## 封装思路

封装思路很简单，主要围绕以下几个方面封装

1.  axios 实例中配置请求超时时效`timeout`和请求基础路径`baseURL`(一般是后端地址/服务器地址)

 .env.development 文件如下

```bash
#.env.development
# 开发环境
VITE_MODE='development'

## 变量必须以 VITE_ 为前缀才能暴露给外部读取
VITE_BASE_API = 'http://localhost:4000'
```

2. loading 主要是基于 element-plus UI组件库ElLoading组件封装

3. 使用 `generateRequestKey` 函数为每个请求生成一个唯一的 key

   - 防止重复请求

   - 性能优化:避免发送冗余请求，节省网络资源，提高应用性能

   - 防止数据一致性问题

  ```typescript
     // 生成请求 key
    const generateRequestKey = (config: InternalAxiosRequestConfig) => {
      const { method, url, params, data } = config;
      // 使用时间戳确保每次请求 key 唯一 如果单位时间内防止重复请求的话时间条件和逻辑修改一下
      const timestamp = Date.now();
      return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}:${timestamp}`;
    };
     
     // 添加请求到 pending 中
     const addPendingRequest = (config: InternalAxiosRequestConfig) => {
       const requestKey = generateRequestKey(config);
       if (pendingRequests[requestKey]) {
         config.cancelToken = new axios.CancelToken((cancel) => {
           cancel("取消重复请求");
         });
       } else {
         pendingRequests[requestKey] = true;
       }
     };
     
     // 移除 pending 中的请求
     const removePendingRequest = (config: InternalAxiosRequestConfig) => {
       const requestKey = generateRequestKey(config);
       delete pendingRequests[requestKey];
     };
   ```

     

   

4. 请求拦截器中主要做一些请求头上面的修改(如：请求`token`放在头上，禁用缓存，文件上传设置)

```typescript
// 确保 headers 存在
 if (!config.headers) {
 config.headers = new AxiosHeaders(); // 使用 AxiosHeaders 创建 headers
 }

// 禁用缓存
config.headers.set("Cache-Control", "no-cache");
config.headers.set("Pragma", "no-cache");
config.headers.set("Expires", "0");

// 从 Cookie 中获取 token --- 后端操作Cookie时(后端set Cookie时下面的两段代码不要,删掉)
const token = getToken();

// 如果 token 存在，将其添加到请求头中
if (token) {
config.headers.set("Authorization", `Bearer ${token}`); // 使用 set 方法
}

// 文件上传设置
if (config.headers.get("Content-Type") === "multipart/form-data") {
config.headers.set("Content-Type", "multipart/form-data");
} else {
config.headers.set("Content-Type", "application/json");
}
```



 5.相应拦截器里面主要做一些移除事假,状态码判断,提示错误信息,完整错误信息`reject`出来(还有一些自动刷新`token`逻辑)

```typescript
// 关闭 loading 动画
    hideLoading();

    // 移除 pending 请求
    removePendingRequest(response.config);

    // 响应成功，返回数据
    return response.data;
  },
  async (error:any) => {
    hideLoading();

    let errorInfo = "";
    const status = error.response ? error.response.status : 0;
    const originalRequest = error.config;

    // 处理 HTTP 错误状态码
   switch (status: any) {
      case 401: {
        errorInfo = "未授权，请登录";
        // 自动刷新 token 逻辑 --- 后端操作Cookie时(后端set Cookie时下面的代码不要,逻辑修改一下，直接调用后端刷新接口即可)
        const refreshToken = setToken(CACHE_KEY.REFRESH_TOKEN);
        if (refreshToken && !originalRequest._retry) {
          originalRequest._retry = true;
          // 这里可以实现刷新 token 的逻辑
          // const newToken = await refreshAccessToken(refreshToken);
          // setToken(newToken);
          // originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          // return request(originalRequest); // 重新发起请求
        } else {
          // 退出登录
          const router = useRouter();
          router.push("/login");
          location.reload();
        }
        break;
      }
      case 403: {
        errorInfo = "拒绝访问";
        break;
      }
      case 404: {
        errorInfo = "请求地址出错";
        break;
      }
      case 408: {
        errorInfo = "请求超时";
        break;
      }
      case 500: {
        errorInfo = "服务器内部错误";
        break;
      }
      case 501: {
        errorInfo = "服务未实现";
        break;
      }
      case 502: {
        errorInfo = "网关错误";
        break;
      }
      case 503: {
        errorInfo = "服务不可用";
        break;
      }
      case 504: {
        errorInfo = "网关超时";
        break;
      }
      default: {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorInfo = error.response.data.message; // 使用后端返回的错误信息|如res.message....
        } else {
          errorInfo ="其他错误"; // 使用默认的本地化信息
        }
        break;
      }
    }
    // 提示错误信息
    ElNotification({
      message: errorInfo,
      type: "error",
      duration: 1 * 1000,
    });

    // 将错误信息返回给前端页面，方便捕获具体的 message
    return Promise.reject(error.response ? error.response.data : error);
```

## 下面是完整封装内容

! 个人觉得`loading`封装在请求里面不太好，应该封装成一个自定义`hooks函数`或者`自定义指令`，在需要的地方用即可，而不是每次请求都`loading`....

```typescript
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import { ElNotification, ElLoading } from "element-plus";
import { useRouter } from "vue-router";
import { getToken, setToken } from "@/utils/cache/cookies"; // cookies
import CACHE_KEY from "@/constants/cache-key"; // 存储对应key值

let loadingInstance: any = null;
let pendingRequests: any = {};

// 创建 axios 实例
let request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // 基础路径上会携带/api
  timeout: 5000,
});

// 展示 loading
const showLoading = () => {
   loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading...",
    background: "rgba(0, 0, 0, 0.5)",
    spinner: `
        <svg width="50" height="50" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#409eff">
            <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 67 67"
                    to="-360 67 67"
                    dur="2.5s"
                    repeatCount="indefinite"/>
            </path>
            <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 67 67"
                    to="360 67 67"
                    dur="8s"
                    repeatCount="indefinite"/>
            </path>
        </svg>
    `,
  });
};

// 关闭 loading
const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
};

// 生成请求 key
const generateRequestKey = (config: InternalAxiosRequestConfig) => {
  const { method, url, params, data } = config;
  // 使用时间戳确保每次请求 key 唯一 如果单位时间内防止重复请求的话时间条件和逻辑修改一下
  const timestamp = Date.now();
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}:${timestamp}`;
};

// 添加请求到 pending 中
const addPendingRequest = (config: InternalAxiosRequestConfig) => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests[requestKey]) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancel("取消重复请求");
    });
  } else {
    pendingRequests[requestKey] = true;
  }
};

// 移除 pending 中的请求
const removePendingRequest = (config: InternalAxiosRequestConfig) => {
  const requestKey = generateRequestKey(config);
  delete pendingRequests[requestKey];
};

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    // 显示 loading 动画
    showLoading();

    // 添加重复请求处理
    addPendingRequest(config);

    // 确保 headers 存在
    if (!config.headers) {
      config.headers = new AxiosHeaders(); // 使用 AxiosHeaders 创建 headers
    }

    // 禁用缓存
    config.headers.set("Cache-Control", "no-cache");
    config.headers.set("Pragma", "no-cache");
    config.headers.set("Expires", "0");

    // 从 Cookie 中获取 token --- 后端操作Cookie时(后端set Cookie时下面的两段代码不要,删掉)
    const token = getToken();

    // 如果 token 存在，将其添加到请求头中
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`); // 使用 set 方法
    }

    // 文件上传设置
    if (config.headers.get("Content-Type") === "multipart/form-data") {
      config.headers.set("Content-Type", "multipart/form-data");
    } else {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error:any) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 关闭 loading 动画
    hideLoading();

    // 移除 pending 请求
    removePendingRequest(response.config);

    // 响应成功，返回数据
    return response.data;
  },
  async (error:any) => {
    hideLoading();

    let errorInfo = "";
    const status = error.response ? error.response.status : 0;
    const originalRequest = error.config;

     // 处理 HTTP 错误状态码
   switch (status: any) {
      case 401: {
        errorInfo = "未授权，请登录";
        // 自动刷新 token 逻辑 --- 后端操作Cookie时(后端set Cookie时下面的代码不要,逻辑修改一下，直接调用后端刷新接口即可)
        const refreshToken = setToken(CACHE_KEY.REFRESH_TOKEN);
        if (refreshToken && !originalRequest._retry) {
          originalRequest._retry = true;
          // 这里可以实现刷新 token 的逻辑
          // const newToken = await refreshAccessToken(refreshToken);
          // setToken(newToken);
          // originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          // return request(originalRequest); // 重新发起请求
        } else {
          // 退出登录
          const router = useRouter();
          router.push("/login");
          location.reload();
        }
        break;
      }
      case 403: {
        errorInfo = "拒绝访问";
        break;
      }
      case 404: {
        errorInfo = "请求地址出错";
        break;
      }
      case 408: {
        errorInfo = "请求超时";
        break;
      }
      case 500: {
        errorInfo = "服务器内部错误";
        break;
      }
      case 501: {
        errorInfo = "服务未实现";
        break;
      }
      case 502: {
        errorInfo = "网关错误";
        break;
      }
      case 503: {
        errorInfo = "服务不可用";
        break;
      }
      case 504: {
        errorInfo = "网关超时";
        break;
      }
      default: {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorInfo = error.response.data.message; // 使用后端返回的错误信息|如res.message，根据后端返回报文数据结构变化....
        } else {
          errorInfo = "其他错误"; // 使用默认的本地化信息
        }
        break;
      }
    }
    // 提示错误信息
    ElNotification({
      message: errorInfo,
      type: "error",
      duration: 1 * 1000,
    });

    // 将错误信息返回给前端页面，方便捕获具体的 message
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default request;
```
## 拓展
- 在网站安全防护中，前端可在请求头上添加浏览器指纹，后端可通过传的浏览器指纹哈希字符串判断是否人机/刷子
- 如有更好建议欢迎留言探讨

