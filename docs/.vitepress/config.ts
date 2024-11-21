import { defineConfig } from "vitepress";

export default defineConfig({
  title: "My Blog",
  description: "This is my VitePress blog.",
  themeConfig: {
    // algolia: {
    //   appId: "YOUR_APP_ID", // 替换为你的 Algolia 应用 ID
    //   apiKey: "YOUR_SEARCH_API_KEY", // 替换为你的搜索 API 密钥
    //   indexName: "YOUR_INDEX_NAME", // 替换为你的索引名称
    // },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-present Evan You'
    },
    editLink: {
        pattern: 'https://github.com/durunsong/my-blog/edit/master/docs/:path',
        text: 'Edit this page on GitHub'
      },
    socialLinks: [
        { icon: 'github', link: 'https://github.com/durunsong/my-blog' }
      ],
    search: {
      provider: "local",
    },
  },
});
