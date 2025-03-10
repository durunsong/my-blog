# uniapp集成cloudflare turnstile人机验证

待补充内容...

## uniapp 中使用cloudflare的turnstile人机验证

![Snipaste\_2024-08-26\_20-01-42.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/cdc84e78153c43dabb3263ee6e085e58~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg56CB5LiK57ud5bCY:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjA1NDM2Mjc3OTg4MzM4MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734524394&x-orig-sign=lespvCuDFSi5hwOKVK3Vo0N9tSc%3D)

*   接入方式：webview
*   涉及业务：前后端都需要
*   [cloudflare文档地址](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## 主要用到的uniapp中webview
[链接地址](https://zh.uniapp.dcloud.io/component/web-view.html#web-view)

## 主要用到的webview方法

*   `@message`  网页向应用 `postMessage` 时，会在特定时机（后退、组件销毁、分享）触发并收到消息。( H5 暂不支持（可以直接使用 [window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)）)
*   应用向网页url传值
*   `uni.postMessage` 向应用发送消息  (抖音小程序不支持、H5 暂不支持（可以直接使用 [window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)）)
*   `UniAppJSBridgeReady`  把uni.webview\.1.5.5.js 下载到自己的服务器后， 待触发 `UniAppJSBridgeReady` 事件后，即可调用 uni 的 API
*   `turnstile.ready`函数配置对象，turnstile.ready(function () {}），可按照文档配置相应的方法

## 网页端

*   内嵌的HTML文件和uni.webview源文件

```html
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>safeCode</title>
</head>
<style>
  #cf-code {
    height: 65px;
    overflow: hidden;
    background: transparent;
    width: 330px;
  }
  html,
  body {
    background: transparent;
    margin: 0;
    padding: 0;
  }
  iframe {
    border-radius: 10px;
    overflow: hidden;
  }
</style>
<body>
  <div id="cf-code"></div>
  <script src="./uniapp.js"></script>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
  <script type="text/javascript">
    document.addEventListener('UniAppJSBridgeReady', function () {
    // 获取uniapp中url传递过来public_key的参数
      function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params.entries()) {
          result[key] = value;
        }
        return result;
      }
      const params = getUrlParams();
      const cf_params = JSON.stringify(params.cf_params)
      turnstile.ready(function () {
        turnstile.render('#cf-code', {
          sitekey: JSON.parse(cf_params),
          size: "flexible",
          callback: function (response) {
            if (response !== '') {
              // 将cf验证码token信息发送给uniapp
              uni.postMessage({
                data: {
                  action: '1',
                  isShow: true,
                  cf_code: response,
                }
              })
            }
          }
        })
      })
    })
  </script>
</body>
</html>
```

webview的js文件

```js
// uniapp.js
!function (e, n) { "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (e = e || self).uni = n() }(this, (function () { "use strict"; try { var e = {}; Object.defineProperty(e, "passive", { get: function () { !0 } }), window.addEventListener("test-passive", null, e) } catch (e) { } var n = Object.prototype.hasOwnProperty; function i(e, i) { return n.call(e, i) } var t = []; function r() { return window.__dcloud_weex_postMessage || window.__dcloud_weex_ } var o = function (e, n) { var i = { options: { timestamp: +new Date }, name: e, arg: n }; if (r()) { if ("postMessage" === e) { var o = { data: [n] }; return window.__dcloud_weex_postMessage ? window.__dcloud_weex_postMessage(o) : window.__dcloud_weex_.postMessage(JSON.stringify(o)) } var a = { type: "WEB_INVOKE_APPSERVICE", args: { data: i, webviewIds: t } }; window.__dcloud_weex_postMessage ? window.__dcloud_weex_postMessageToService(a) : window.__dcloud_weex_.postMessageToService(JSON.stringify(a)) } if (!window.plus) return window.parent.postMessage({ type: "WEB_INVOKE_APPSERVICE", data: i, pageId: "" }, "*"); if (0 === t.length) { var d = plus.webview.currentWebview(); if (!d) throw new Error("plus.webview.currentWebview() is undefined"); var s = d.parent(), w = ""; w = s ? s.id : d.id, t.push(w) } if (plus.webview.getWebviewById("__uniapp__service")) plus.webview.postMessageToUniNView({ type: "WEB_INVOKE_APPSERVICE", args: { data: i, webviewIds: t } }, "__uniapp__service"); else { var u = JSON.stringify(i); plus.webview.getLaunchWebview().evalJS('UniPlusBridge.subscribeHandler("'.concat("WEB_INVOKE_APPSERVICE", '",').concat(u, ",").concat(JSON.stringify(t), ");")) } }, a = { navigateTo: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.url; o("navigateTo", { url: encodeURI(n) }) }, navigateBack: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.delta; o("navigateBack", { delta: parseInt(n) || 1 }) }, switchTab: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.url; o("switchTab", { url: encodeURI(n) }) }, reLaunch: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.url; o("reLaunch", { url: encodeURI(n) }) }, redirectTo: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.url; o("redirectTo", { url: encodeURI(n) }) }, getEnv: function (e) { r() ? e({ nvue: !0 }) : window.plus ? e({ plus: !0 }) : e({ h5: !0 }) }, postMessage: function () { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; o("postMessage", e.data || {}) } }, d = /uni-app/i.test(navigator.userAgent), s = /Html5Plus/i.test(navigator.userAgent), w = /complete|loaded|interactive/; var u = window.my && navigator.userAgent.indexOf(["t", "n", "e", "i", "l", "C", "y", "a", "p", "i", "l", "A"].reverse().join("")) > -1; var g = window.swan && window.swan.webView && /swan/i.test(navigator.userAgent); var v = window.qq && window.qq.miniProgram && /QQ/i.test(navigator.userAgent) && /miniProgram/i.test(navigator.userAgent); var c = window.tt && window.tt.miniProgram && /toutiaomicroapp/i.test(navigator.userAgent); var m = window.wx && window.wx.miniProgram && /micromessenger/i.test(navigator.userAgent) && /miniProgram/i.test(navigator.userAgent); var p = window.qa && /quickapp/i.test(navigator.userAgent); var f = window.ks && window.ks.miniProgram && /micromessenger/i.test(navigator.userAgent) && /miniProgram/i.test(navigator.userAgent); var l = window.tt && window.tt.miniProgram && /Lark|Feishu/i.test(navigator.userAgent); var _ = window.jd && window.jd.miniProgram && /micromessenger/i.test(navigator.userAgent) && /miniProgram/i.test(navigator.userAgent); var E = window.xhs && window.xhs.miniProgram && /xhsminiapp/i.test(navigator.userAgent); for (var h, P = function () { window.UniAppJSBridge = !0, document.dispatchEvent(new CustomEvent("UniAppJSBridgeReady", { bubbles: !0, cancelable: !0 })) }, b = [function (e) { if (d || s) return window.__dcloud_weex_postMessage || window.__dcloud_weex_ ? document.addEventListener("DOMContentLoaded", e) : window.plus && w.test(document.readyState) ? setTimeout(e, 0) : document.addEventListener("plusready", e), a }, function (e) { if (m) return window.WeixinJSBridge && window.WeixinJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("WeixinJSBridgeReady", e), window.wx.miniProgram }, function (e) { if (v) return window.QQJSBridge && window.QQJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("QQJSBridgeReady", e), window.qq.miniProgram }, function (e) { if (u) { document.addEventListener("DOMContentLoaded", e); var n = window.my; return { navigateTo: n.navigateTo, navigateBack: n.navigateBack, switchTab: n.switchTab, reLaunch: n.reLaunch, redirectTo: n.redirectTo, postMessage: n.postMessage, getEnv: n.getEnv } } }, function (e) { if (g) return document.addEventListener("DOMContentLoaded", e), window.swan.webView }, function (e) { if (c) return document.addEventListener("DOMContentLoaded", e), window.tt.miniProgram }, function (e) { if (p) { window.QaJSBridge && window.QaJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("QaJSBridgeReady", e); var n = window.qa; return { navigateTo: n.navigateTo, navigateBack: n.navigateBack, switchTab: n.switchTab, reLaunch: n.reLaunch, redirectTo: n.redirectTo, postMessage: n.postMessage, getEnv: n.getEnv } } }, function (e) { if (f) return window.WeixinJSBridge && window.WeixinJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("WeixinJSBridgeReady", e), window.ks.miniProgram }, function (e) { if (l) return document.addEventListener("DOMContentLoaded", e), window.tt.miniProgram }, function (e) { if (_) return window.JDJSBridgeReady && window.JDJSBridgeReady.invoke ? setTimeout(e, 0) : document.addEventListener("JDJSBridgeReady", e), window.jd.miniProgram }, function (e) { if (E) return window.xhs.miniProgram }, function (e) { return document.addEventListener("DOMContentLoaded", e), a }], y = 0; y < b.length && !(h = b[y](P)); y++); h || (h = {}); var B = "undefined" != typeof uni ? uni : {}; if (!B.navigateTo) for (var S in h) i(h, S) && (B[S] = h[S]); return B.webView = h, B }));
```

通用cf的webview组件

```vue
// CodeView.vue
<template>
    <view class="container">
        <web-view ref="webview" :src="webviewSrc" allow :fullscreen="false" :webview-styles="webviewStyles"
            :frameBorder="0" @message="handleMessage"
            style="top:calc(50%-32.5px);background-color: rgba(0, 0, 0, 0) !important;">
        </web-view>
    </view>
</template>
<script>
import config from '../../xxxx.js'
export default {
    name: "CodeView",
    props: {
        cf_params: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            baseUrl: config.url,
            wv: null,
            webviewStyles: {
                progress: {
                    color: "#3e3adc",
                },
                width: '330px',
                height: "65px",
                margin: "auto",
            },
        };
    },
    computed: {
        webviewSrc() {
            // 当前环境的url不要有localhost否者cf会不通过
            // #ifdef H5
            const url = window.location.origin
            return `${url}${this.baseUrl}/XXXX/index.html?cf_params=${this.cf_params}`;
            // #endif
            // #ifdef APP-PLUS 
            return `${this.baseUrl}/XXXX/index.html?cf_params=${this.cf_params}`;
            // #endif
        }
    },
    methods: {
        // 接收h5页面发来的键值判断需要执行的操作
        handleMessage(event) {
            const code = event.detail.data[0].action
            // 判断 action 值是否为 1
            if (code == 1) {
                setTimeout(() => {
                    this.$emit("update:actionData", event.detail.data[0]);
                }, 200);
            }
            uni.getSystemInfo({
                success: (res) => {
                    this.webviewStyles.height = `${res.screenHeight -
                        res.statusBarHeight -
                        res.safeAreaInsets?.bottom -
                        100
                        }px`;
                    this.webviewStyles.bottom = `${res.safeAreaInsets?.bottom + 56}px`;
                },
            });
            try {
                const data = JSON.parse(event.detail.data);
                switch (data.type) {
                    case "error":
                        this.$emit("error", data.code);
                        break;
                    default:
                        console.warn("未处理的消息类型:", data.type);
                        break;
                }
            } catch (error) {
                console.error("解析消息失败:", error);
            }
        }
    },
};
</script>
<style scoped>
.container {
    background-color: transparent;
}
</style>
```

页面中使用

```vue
<uni-popup ref="turnstile_popup" type="center"  borderRadius="10px" :is-mask-click="false">
  <view class="code_view">
    <CodeView  @update:actionData="handleIsFlag" :cf_params="cf_params" ></CodeView>
  </view>
</uni-popup>
import CodeView from '@/components/CFCodeView/CodeView.vue';
components: {
		CodeView
	},
// 这是后面的逻辑
handleIsFlag(actionData) {
// actionData中包含isShow，cf的token(cf_code), action: '1'
			if (actionData.isShow) {
				this.$refs.turnstile_popup.close();			
				// 走XXX流程
				setTimeout(()=>{
					// 一般会把token传给后端，后端会请求第三方校验公钥和私钥是否匹配
				},200)
			}
		},
// 前面的逻辑
this.$refs.turnstile_popup.open(); // 打开弹窗
this.cf_params = val.public_key; // 传递公钥
```

## 需要注意的点

*   uniapp开发时不能直接在页面上面渲染cloudflare中turnstile的内容，会整个铺满页面，弹窗的方案较好点，web开发特别简单，可以直接渲染
*   环境url，在开发环境中uniapp在HbuilderX中运行是在nodejs环境下，域名是localhost:XXX，这时候cloudflare检验的时候不会通过，这样会很影响开发环境，开发环境后台需要做个开关控制需不需要开启验证
