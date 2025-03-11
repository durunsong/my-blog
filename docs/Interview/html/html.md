# HTML 面试题

## 1. HTML5 新特性
1. **语义化标签**
   - `<header>` `<footer>` `<nav>` `<section>` `<article>` `<aside>` `<main>`
   - 好处：代码结构清晰、有利于SEO、方便无障碍阅读
   
2. **多媒体标签**
   - `<audio>` `<video>` 可以直接播放音视频
   - `<canvas>` `<svg>` 提供图形绘制能力

3. **表单增强**
   - 新增 input 类型：email、url、number、range、date、search 等
   - 新增表单属性：placeholder、required、pattern、autocomplete 等

4. **API与通信**
   - WebSockets：实现客户端与服务器的全双工通信
   - WebRTC：实现浏览器间的点对点通信
   - Service Workers：实现离线缓存和消息推送

## 2. 语义化的理解和好处
1. **什么是语义化**
   - 用正确的标签做正确的事情
   - 让页面内容结构化，便于浏览器、搜索引擎解析

2. **好处**
   - 有利于SEO，搜索引擎更容易理解网页内容
   - 便于团队开发和维护，代码可读性强
   - 支持多终端设备显示
   - 有利于无障碍阅读

## 3. 浏览器存储方式的区别
1. **Cookie**
   - 容量小（4KB）
   - 每次请求都会携带
   - 可设置过期时间
   - 支持跨域访问控制

2. **localStorage**
   - 容量大（5MB）
   - 永久存储
   - 不随请求携带
   - 同源策略限制

3. **sessionStorage**
   - 容量大（5MB）
   - 会话级别存储
   - 不随请求携带
   - 同源策略限制

4. **IndexedDB**
   - 容量非常大（几百MB）
   - 支持事务和索引
   - 适合存储大量结构化数据
   - 异步API，不会阻塞主线程

## 4. 重排(回流)和重绘的区别
1. **重排(Reflow)**
   - 当DOM的尺寸、结构或元素位置发生改变时触发
   - 影响性能，开销大
   - 触发条件：添加/删除DOM、改变元素位置、改变元素尺寸等

2. **重绘(Repaint)**
   - 当元素外观改变但不影响布局时触发
   - 性能影响相对较小
   - 触发条件：改变颜色、背景、阴影等

3. **优化策略**
   - 批量修改DOM，使用DocumentFragment
   - 使用transform替代top/left
   - 适当使用will-change属性
   - 避免频繁读取引起强制同步布局的属性(offsetHeight等)

## 5. 浏览器渲染过程
1. **解析HTML生成DOM树**
2. **解析CSS生成CSSOM树**
3. **将DOM和CSSOM合并成渲染树**
4. **布局（Layout）计算元素位置和大小**
5. **绘制（Paint）渲染页面**
6. **合成（Composite）图层合成并显示到屏幕上**

## 6. 跨域解决方案
1. **CORS**
   - 服务器设置 Access-Control-Allow-Origin
   - 支持所有请求方式
   
2. **JSONP**
   - 利用 `<script>` 标签不受跨域限制
   - 只支持 GET 请求

3. **代理服务器**
   - 同源策略是浏览器行为
   - 服务器之间请求无跨域限制

4. **postMessage**
   - HTML5提供的API，用于不同窗口间的消息传递
   - 可以跨域传递数据

## 7. 性能优化相关
1. **资源加载优化**
   - 使用 CDN
   - 图片懒加载
   - 资源预加载（preload/prefetch）
   - 合理使用缓存

2. **渲染优化**
   - 避免频繁操作DOM
   - 使用 DocumentFragment
   - CSS选择器优化
   - 使用 transform 代替位移

3. **加载策略优化**
   - 关键CSS内联
   - JavaScript异步加载（async/defer）
   - 代码分割与按需加载
   - 资源提示（preconnect/dns-prefetch）

## 8. Web Worker
1. **作用**
   - 在后台线程中运行脚本
   - 不阻塞主线程

2. **使用场景**
   - 复杂计算
   - 大文件处理
   - 数据加密

3. **通信机制**
   ```javascript
   // 主线程
   const worker = new Worker('worker.js');
   worker.postMessage({data: 'some data'});
   worker.onmessage = function(e) {
     console.log('Worker said: ', e.data);
   };
   
   // worker.js
   self.onmessage = function(e) {
     self.postMessage('Received: ' + e.data.data);
   };
   ```

## 9. 响应式布局方案
1. **媒体查询**
   ```css
   @media screen and (max-width: 768px) {
     /* 样式 */
   }
   ```

2. **百分比布局**
3. **rem/em 布局**
4. **vw/vh 布局**
5. **flex 布局**
6. **grid 布局**
7. **响应式图片**
   ```html
   <picture>
     <source media="(min-width: 768px)" srcset="large.jpg">
     <source media="(min-width: 480px)" srcset="medium.jpg">
     <img src="small.jpg" alt="响应式图片">
   </picture>
   ```

## 10. SEO 优化方案
1. **合理使用标签**
   - `<title>` `<meta>` 标签优化
   - 语义化标签使用

2. **内容优化**
   - 关键词密度
   - 原创内容
   - 图片 alt 属性

3. **链接优化**
   - 合理使用内部链接
   - 友情链接
   - 避免死链

4. **结构化数据**
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "文章标题",
     "author": {
       "@type": "Person",
       "name": "作者名"
     },
     "datePublished": "2023-01-01T08:00:00+08:00"
   }
   </script>
   ```

## 11. 前端安全
1. **XSS攻击**
   - 跨站脚本攻击
   - 防范：输入过滤、输出转义、CSP策略
   
   ```javascript
   // 转义HTML
   function escapeHTML(str) {
     return str.replace(/[&<>"']/g, m => ({
       '&': '&amp;',
       '<': '&lt;',
       '>': '&gt;',
       '"': '&quot;',
       "'": '&#39;'
     }[m]));
   }
   ```

2. **CSRF攻击**
   - 跨站请求伪造
   - 防范：Token验证、Referer验证、SameSite Cookie

3. **点击劫持**
   - 防范：X-Frame-Options
   - CSP策略
   ```html
   <meta http-equiv="Content-Security-Policy" content="frame-ancestors 'none'">
   ```

## 12. 移动端适配
1. **viewport 设置**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **1px 问题解决**
   ```css
   .border-1px {
     position: relative;
   }
   .border-1px::after {
     content: '';
     position: absolute;
     left: 0;
     bottom: 0;
     width: 100%;
     height: 1px;
     background-color: #000;
     transform: scaleY(0.5);
     transform-origin: 0 100%;
   }
   ```

3. **软键盘问题**
   - 监听 window 的 resize 事件
   - 使用 scrollIntoView() 确保输入框可见

4. **触屏事件处理**
   - touchstart, touchmove, touchend
   - 解决300ms延迟问题
   ```html
   <meta name="viewport" content="width=device-width">
   ```

## 13. Web Components
1. **组成部分**
   - Custom Elements：自定义HTML标签
   - Shadow DOM：封装组件的内部结构
   - HTML Templates：`<template>` 定义可复用的HTML

2. **使用示例**
   ```javascript
   // 定义自定义元素
   class MyComponent extends HTMLElement {
     constructor() {
       super();
       // 创建Shadow DOM
       const shadow = this.attachShadow({mode: 'open'});
       
       // 创建组件内部结构
       const wrapper = document.createElement('div');
       wrapper.textContent = '这是自定义组件';
       
       // 添加到Shadow DOM
       shadow.appendChild(wrapper);
     }
   }
   
   // 注册自定义元素
   customElements.define('my-component', MyComponent);
   ```

3. **使用HTML模板**
   ```html
   <template id="my-template">
     <style>
       p { color: blue; }
     </style>
     <p>模板内容</p>
   </template>
   
   <script>
     class TemplateComponent extends HTMLElement {
       constructor() {
         super();
         const template = document.getElementById('my-template');
         const shadow = this.attachShadow({mode: 'open'});
         shadow.appendChild(template.content.cloneNode(true));
       }
     }
     customElements.define('template-component', TemplateComponent);
   </script>
   ```

## 14. Service Worker 和 PWA
1. **Service Worker 生命周期**
   - 注册 → 安装 → 激活

2. **实现离线缓存**
   ```javascript
   // 注册Service Worker
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js')
       .then(reg => console.log('SW registered:', reg))
       .catch(err => console.log('SW registration failed:', err));
   }
   
   // sw.js
   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open('v1').then(cache => {
         return cache.addAll([
           '/',
           '/index.html',
           '/styles.css',
           '/app.js'
         ]);
       })
     );
   });
   
   self.addEventListener('fetch', event => {
     event.respondWith(
       caches.match(event.request).then(response => {
         return response || fetch(event.request);
       })
     );
   });
   ```

3. **PWA特点**
   - 可安装
   - 离线工作
   - 推送通知
   - 后台同步

## 15. 无障碍访问(A11Y)
1. **ARIA 角色和属性**
   ```html
   <div role="button" aria-pressed="false" tabindex="0">
     可访问的按钮
   </div>
   ```

2. **语义化标签的重要性**
   - 屏幕阅读器可以理解页面结构
   - 键盘导航更合理

3. **键盘导航优化**
   - 合理的tabindex
   - 清晰的焦点状态
   ```css
   :focus {
     outline: 2px solid blue;
   }
   ```

4. **颜色对比度**
   - WCAG标准：正常文本4.5:1，大文本3:1
   - 工具：axe, Lighthouse

## 16. 现代HTML新特性
1. **原生懒加载**
   ```html
   <img src="image.jpg" loading="lazy" alt="懒加载图片">
   ```

2. **图片自适应**
   ```html
   <img srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1080w"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
        src="fallback.jpg" alt="响应式图片">
   ```

3. **原生对话框**
   ```html
   <dialog id="myDialog">
     <p>对话框内容</p>
     <button id="closeDialog">关闭</button>
   </dialog>
   
   <script>
     const dialog = document.getElementById('myDialog');
     document.getElementById('openDialog').addEventListener('click', () => {
       dialog.showModal();
     });
     document.getElementById('closeDialog').addEventListener('click', () => {
       dialog.close();
     });
   </script>
   ```

4. **内容安全策略（CSP）**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' https://trusted.cdn.com">
   ```
