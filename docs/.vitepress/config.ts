import { defineConfig } from "vitepress";
import nav from "./config/nav";
import sidebar from "./config/sidebar";
import footer from "./config/footer";
import socialLinks from "./config/socialLinks";
import MarkdownPreview from "vite-plugin-markdown-preview";

export default defineConfig({
  title: "My Blog",
  description: "分享我的前端开发经验与学习笔记",
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],
  markdown: {
    lineNumbers: true, // 开启代码行号（可选）
    breaks: true, // 启用宽松模式，自动识别单个换行符
  },
  themeConfig: {
    outline: {
      label: "页面导航", // 修改标题为 "本页目录"
      level: "deep",
    },
    lastUpdated: {
      text: "上次更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    logo: "/logo.png",
    nav,
    sidebar,
    footer,
    socialLinks,
    editLink: {
      pattern: "https://github.com/durunsong/my-blog/edit/master/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },
    search: {
      provider: "local",
    },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
  vite: {
    plugins: [MarkdownPreview()],
    // 解决sass编译问题
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or 'modern'
        },
      },
    },
  },
});
