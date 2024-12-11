## 史上最强vue3+element-plus+ts+vue-i18n国际化多语言教程

### 简介

- 本文将介绍`vue2/vue3/react/angular`项目中做**国际化**时一通百通的方法，文中将用**vue3+element-plus+ts+vue-i18n**做案例，其他框架和UI库类似
- 做国际化项目的时候通常是`UI组件内置字段`和`vue-i18n`语言切换同步
- 翻译：`网页title`、`路由name`、`hooks中语句`，`封装请求错误状态语`，不翻译：`关键词`
- 链接文档提供：[element-plus国际化](https://element-plus.org/zh-CN/guide/i18n.html)、[vue-i18n文档](https://vue-i18n.intlify.dev/guide/introduction.html)、[vue3文档](https://cn.vuejs.org/guide/introduction.html)
- 本文没有做`日期和时间本地化`，做后端和全栈的同学记得前后端统一哦！
- 需要先阅读一下**vue-i18n文档**，了解一下基本语法规则

### 推荐个人项目

- 这是一个`国际化全栈中后台`解决方案，支持`16种`语言/三种主题切换
- 前端：`vue3.5+typescript+vite5+pinia+element-plus+unocss+sass`
- 后端`nodejs+express+mysql+redis`的管理后台项目
- 预览：网络需要绕过大陆 [kilyicms.vercel.app](https://kilyicms.vercel.app)
- `github`代码仓库  [kilyicms](https://github.com/durunsong/kilyicms.git)
- 创作不易希望点个`star`⭐⭐⭐

### 开始

1.创建一个`vue3`项目     略

2.安装`vue-i18n`，以**pnpm**为例

```jsx
pnpm add vue-i18n
```

3.文档目录结构

```typescript
|--XXX
└── src
    ├── components
    |           └── LanguageSwitcher
    |                      └── index.vue   切换语言组件
    ├── i18n
    |    ├── package 语言包文件夹
    |    |    ├── zh.ts  语言包
    |    |    ├── en.ts
    |    |    ├── ru.ts  ......
    |    |    └── index.ts 文件总包对象
    |    └── index.ts i18n方法文件
    ├── hooks
    |    └── useElementPlusLocale.ts  element-plus UI内置国际化自定义hook方法
    ├── router 路由
    ├── utils
    |     └── langList.ts  vue-i18n/element-plus/当前语言名  统一管理当前语言key的文件
    ├── App.vue 
    └── main.ts 入口ts文件
```

### 演示代码

1. 首先介绍**package**中 `zh.ts`、`en.ts` 、`ru.ts` 语言包文件和`index.ts`文件

```typescript
// zh.ts 简体中文
const zh = {
    loading_demo_description: "该示例是演示：通过将要执行的函数传递给 {hook}，让 {hook} 自动开启全屏 {loading}，函数执行结束后自动关闭 {loading}",
    demo_description: "该示例是演示：通过调用 {hook}，开启或关闭水印，支持局部、全局、自定义样式（颜色、透明度、字体大小、字体、倾斜角度等），并自带防御（防删、防隐藏）和自适应功能",
    create_local_watermark: "创建局部水印",
    disable_defense_local_watermark: "关闭防御功能",
    clear_local_watermark: "清除局部水印",
    create_global_watermark: "创建全局水印",
    disable_defense_global_watermark: "关闭防御功能",
    clear_global_watermark: "清除全局水印",
    role_visibility_message: "当前页面只有 {role} 角色可见，切换角色后将不能进入该页面",
}
export default zh;

// en.ts 英文
const en = {
    loading_demo_description: "This example demonstrates: by passing the function to be executed to the {hook}, the {hook} automatically starts full-screen {loading}, and automatically closes {loading} after the function is executed",
    demo_description: "This example demonstrates: by calling {hook}, enable or disable the watermark. Supports local, global, and custom styles (color, opacity, font size, font, tilt angle, etc.), and comes with defense (anti-delete, anti-hide) and adaptive functionality",
    create_local_watermark: "Create Local Watermark",
    disable_defense_local_watermark: "Disable Defense",
    clear_local_watermark: "Clear Local Watermark",
    create_global_watermark: "Create Global Watermark",
    disable_defense_global_watermark: "Disable Defense",
    clear_global_watermark: "Clear Global Watermark",
    role_visibility_message: "This page is only visible to the {role} role. You will not be able to access this page after switching roles",
}

export default en;

// ru.ts 俄语
const ru = {
    loading_demo_description: "Этот пример показывает, что, передавая выполняемую функцию {hook}, {hook автоматически запускает полный экран {loading} и автоматически выключает {loading] после выполнения функции.",
    demo_description: "Этот пример демонстрирует: Включить или отключить водяной знак, вызывая {hook}. Поддерживает локальные, глобальные и настраиваемые стили (цвет, непрозрачность, размер шрифта, шрифт, угол наклона и т. Д.) и имеет защитные (против удаления, против сокрытия) и адаптивные функции",
    create_local_watermark: "Создать локальный водяной знак",
    disable_defense_local_watermark: "Отключить защиту",
    clear_local_watermark: "Очистить локальные водяные знаки",
    create_global_watermark: "Создание глобальных водяных знаков",
    disable_defense_global_watermark: "Отключить защиту",
    clear_global_watermark: "Очистить глобальный водяной знак",
    role_visibility_message: "Эта страница видна только для {role} офицера. После переключения ролей вы не сможете посетить эту страницу",
}

export default ru;

// index.ts 语言包key汇总
import en from "./en";
import zh from "./zh";
import ru from "./ru";

export default {
  en,
  zh,
  ru
};
```

2. **i18n**中`index.ts`文件,是`i18n`依赖的方法核心文件

```typescript
// 从 vue-i18n 库中导入 createI18n，用于创建国际化实例
import { createI18n } from "vue-i18n";
// 导入定义的多语言翻译内容
import messages from "@/i18n/package";
// 导入支持的语言列表
import { langList } from "@/utils/langList";
// 支持的语言数组，通过 langList 获取每种语言的类别
const langListArr: string[] = langList.map((lang) => lang.category);
// 获取浏览器的语言设置，并截取前两个字符（如 "en" 或 "zh"）
const navLang: string = navigator.language.substring(0, 2);
// 从本地存储中获取用户之前选择的语言
let localLang: any = localStorage.getItem("lang");
// 处理特定格式的浏览器语言
if (localLang === "zh-cn" || localLang === "en-us") {
  // 清除不规范的语言存储项
  localStorage.removeItem("lang");
  // 将其统一为 "en"
  localLang = "en";
}

// 选择语言
if (!langListArr.includes(localLang)) {
  // 如果本地存储的语言不在支持的语言列表中
  if (langListArr.includes(navLang)) {
    // 如果浏览器语言在支持的语言列表中，则使用浏览器语言
    localLang = navLang;
  } else {
    // 否则默认使用 "en"
    localLang = "en";
  }
  // 将最终选择的语言存储到本地存储
  localStorage.setItem("lang", localLang);
}

// 创建 i18n 实例
const i18n = createI18n({
  locale: localLang || "en", // 设置当前语言，默认使用 "en"
  fallbackLocale: "en", // 定义后备语言，当当前语言缺少翻译时使用
  legacy: false, // 启用组合式 API 的写法
  globalInjection: true, // 全局注册 $t 方法以便在模板中使用
  allowComposition: true, // 允许组合式 API 的使用
  messages, // 导入的多语言内容
});

// 导出创建的 i18n 实例，以便在其他地方使用
export default i18n;
```

3. **main.ts** 中注册挂载

```typescript
// i18n国际化
import i18n from "@/i18n";
app.use(i18n);
```

4. **utils**中  **langList.ts**  `vue-i18n/element-plus/当前语言名`  统一管理当前语言**key**的管理文件

```typescript
export const langList = [
  {
    category: "zh",   // vue-i18n 中的语言字段 key
    lang: "简体中文",  // 当前语言名 key
    el_lang: "zh-CN", // 对应 Element Plus 中的语言字段 key
  },
  {
    category: "en",
    lang: "English",
    el_lang: "en",
  },
  // 波兰语
  {
    category: "pl",
    lang: "Polski",
    el_lang: "pl",
  },
  // 罗马尼亚语
  {
    category: "rom",
    lang: "Română",
    el_lang: "ro",
  },
  // 西班牙语
  {
    category: "spa",
    lang: "Español",
    el_lang: "es",
  },
  // 德语
  {
    category: "de",
    lang: "Deutsch",
    el_lang: "de",
  },
  // 阿拉伯
  {
    category: "ara",
    lang: "العربية",
    el_lang: "ar",
  },
  // 韩语
  {
    category: "kor",
    lang: "한국어",
    el_lang: "ko",
  },
  // 希腊语
  {
    category: "el",
    lang: "Ελληνικά",
    el_lang: "el",
  },
  // 葡萄牙语
  {
    category: "pt",
    lang: "Português",
    el_lang: "pt",
  },
  // 俄语
  {
    category: "ru",
    lang: "русский язык",
    el_lang: "ru",
  },
  // 荷兰语
  {
    category: "nl",
    lang: "Nederlands",
    el_lang: "nl",
  },
  // 法语
  {
    category: "fra",
    lang: "Français",
    el_lang: "fr",
  },
  // 意大利语
  {
    category: "it",
    lang: "Italiano",
    el_lang: "it",
  },
  // 瑞典语
  {
    category: "swe",
    lang: "Svenska",
    el_lang: "sv",
  },
  // 日语
  {
    category: "jp",
    lang: "日本語",
    el_lang: "ja",
  },
];
```

5. **hooks**中**useElementPlusLocale.ts**  `element-plus` UI内置国际化自定义`hook`方法,  [Element Plus文档位置](https://element-plus.org/zh-CN/guide/i18n.html)

```typescript
// 将 Element Plus 的语言包引入到项目中 切换组件语言hooks
import { ref, watchEffect } from "vue";
import { langList } from "@/utils/langList";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import pl from "element-plus/es/locale/lang/pl";
import ro from "element-plus/es/locale/lang/ro";
import es from "element-plus/es/locale/lang/es";
import de from "element-plus/es/locale/lang/de";
import ar from "element-plus/es/locale/lang/ar";
import ko from "element-plus/es/locale/lang/ko";
import el from "element-plus/es/locale/lang/el";
import pt from "element-plus/es/locale/lang/pt";
import ru from "element-plus/es/locale/lang/ru";
import nl from "element-plus/es/locale/lang/nl";
import fr from "element-plus/es/locale/lang/fr";
import it from "element-plus/es/locale/lang/it";
import sv from "element-plus/es/locale/lang/sv";
import ja from "element-plus/es/locale/lang/ja";

// 从el_lang字段映射到实际的Element Plus语言导入
const elLocaleMap: Record<string, any> = {
  "zh-CN": zhCn,
  en: en,
  pl: pl,
  ro: ro,
  es: es,
  de: de,
  ar: ar,
  ko: ko,
  el: el,
  pt: pt,
  ru: ru,
  nl: nl,
  fr: fr,
  it: it,
  sv: sv,
  ja: ja,
};

export const useElementPlusLocale = () => {
  const elementLocale = ref(zhCn); // 默认语言

  const setElementLocale = () => {
    const localLang = localStorage.getItem('lang') || "en"; // 默认设置英文
    const langObj = langList.find((lang) => lang.category === localLang);

    if (langObj && elLocaleMap[langObj.el_lang]) {
      elementLocale.value = elLocaleMap[langObj.el_lang];
    } else {
      elementLocale.value = elLocaleMap["en"]; // Fallback 默认英文
    }
  };

  watchEffect(() => {
    setElementLocale();
  });

  return {
    elementLocale,
  };
};
```

6. 封装的统一切换语言组件内容如下，注意的是刷新页面的逻辑

```vue
...src
    ├── components
                └── LanguageSwitcher
                           └── index.vue   切换语言组件
// 组件内容为
<template>
  <div class="language drop_down">
    <el-popover width="260" transition="el-zoom-in-top" trigger="click" @show="showPopover" popper-class="ifFlagPopover"
      placement="bottom" v-model:visible="popoverVisible">
      <template #reference>
        <div class="reference_btn">
          <SvgIcon name="select_lang" :aria-hidden="false"></SvgIcon>
          <span class="current_language">{{ current_language }}</span>
        </div>
      </template>
      <div class="category_btn_cate">
        <el-checkbox-group v-model="checkList_status" @change="ChangeLanguage" class="gory_btn_bts">
          <el-checkbox size="small" :border="true" class="language_btn_in" v-for="item in langList" :key="item.category"
            :value="item.category">
            {{ item.lang }}
          </el-checkbox>
        </el-checkbox-group>
        <div class="confirm_true" @click="confirmLang">
          <span>{{ t("confirm_ok_text") }}</span>
        </div>
        <div class="cance_true" @click="cancelLang">
          <span>{{ t("confirm_cancel_text") }}</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { langList } from "@/utils/langList";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const router = useRouter();
const popoverVisible = ref(false);
const checkList_status = ref<string[]>([]);
const langue = computed<string>(() => {
  return localStorage.getItem('lang') || "en";
});

// 去掉checkbox双击默认取消勾选事件
watch(
  checkList_status,
  (val, oldVal) => {
    if (val.length > 0) {
      checkList_status.value = val;
    } else {
      checkList_status.value = oldVal;
    }
  },
  { deep: true },
);

const current_language = computed(() => {
  return langList.find((el) => el.category === langue.value)?.lang || "English";
});

const cancelLang = () => {
  popoverVisible.value = false;
};

const showPopover = () => {
  checkList_status.value = [langue.value];
};

const ChangeLanguage = () => {
  if (checkList_status.value.length > 1) {
    checkList_status.value.splice(0, 1);
  }
};

const confirmLang = () => {
  const status_lang = checkList_status.value[0];
  locale.value = status_lang;
  localStorage.setItem('lang', status_lang);
  // 刷新的关键是为了和element-plus UI内置组件的语言切换保持一致
  router.go(0);
};
</script>

<style scoped lang="scss">
:deep(.el-checkbox .el-checkbox__input .el-checkbox__inner) {
  display: none;
}

:deep(.el-checkbox--mini) {
  &:hover {
    color: #1296db;
    border: 1px solid #f03c5123;
    background-color: #f5dadd6b;
  }
}

:deep(.el-checkbox-group .el-checkbox--mini) {
  padding: 0;
  width: 80px;
  height: 25px;
  padding: 5px 15px;
}

:deep(.el-checkbox__label) {
  padding-left: 0;
}

:deep(.el-checkbox.is-bordered + .el-checkbox.is-bordered) {
  margin-left: 0;
}

:deep(.is-checked) {
  border: 1px solid #1296db;
  background-color: #1296db;

  .el-checkbox__label {
    color: #ffffff;
  }

  .el-checkbox__input {
    display: none;
  }
}

:deep(.el-checkbox.is-bordered.is-checked) {
  border-color: #176ec5;
}

:deep(.el-checkbox) {
  margin-right: 0;
}

.ifFlagPopover {
  display: flex;
}

.reference_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: #1296db;
  }
}

.category_btn_cate {
  display: flex;
  flex-flow: column;
  width: 100%;

  .gory_btn_bts {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 0;
    align-items: center;

    .language_btn_in {
      display: flex;
      width: 100px;
      height: 25px;
      font-size: 12px;
      align-items: center;
      justify-content: center;
      margin-top: 10px;

      &:hover {
        background-color: rgba(40, 167, 235, 0.87);
        color: #ffffff;
      }
    }
  }

  .gory_btn_bts>.language_btn_in:nth-child(even) {
    margin-left: 21px;
  }

  .gory_btn_bts>.language_btn_in:nth-child(odd) {
    margin-left: 8px;
  }

  .confirm_true {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 20px;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220px;
      background-color: #1296db;
      color: #fff;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #0e90aa;
      }
    }
  }

  .cance_true {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 10px;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220px;
      background-color: #eaeaea;
      color: #777;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #d6d6d6;
      }
    }
  }

  .category_btn {
    display: flex;
    flex-wrap: wrap;
    min-width: 100px;

    .lang_btn {
      min-width: 100px;
      font-size: 12px;
      margin: 5px;

      &.active,
      &:hover {
        background-color: #1296db;
        color: #fff;
        border: 1px solid #1296db;
      }
    }

    .active {
      cursor: pointer;
      background-color: #1296db;
      color: #1296db;
      border: 1px solid #1296db;
      color: #fff;
    }
  }
}

/** 移动端适配 */
@media screen and (max-width: 880px) {
  .current_language {
    display: none;
  }
}
</style>
```

7. **App.vue**中的内容如下, **Element Plus** 提供了一个 `Vue` 组件 [ConfigProvider](https://element-plus.org/en-US/component/config-provider.html) 用于全局配置国际化的设置。

```vue
<template>
  <el-config-provider :locale="elementLocale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useElementPlusLocale } from "@/hooks/useElementPlusLocale";

/** 使用Element Plus语言环境hooks */
const { elementLocale } = useElementPlusLocale();
</script>
```

### 补充

- 在**ts/js**文件中使用**vue-i18n**的方法时, 需要使用`i18n.global`方法

```typescript
import i18n from "@/i18n";
const { t } = i18n.global;
```

- 在路由文件中使用

```typescript
// 其中router_home就是一个语言的key
{
    path: "dashboard",
    component: () => import("@/views/dashboard/index.vue"),
    name: "Dashboard",
    meta: {
      title: "router_home",
      svgIcon: "dashboard",
      affix: true,
    },
  }
// 在渲染路由的的时候直接用key匹配语言即可
 <template v-if="theOnlyOneChild.meta.title" #title>
      {{ t(theOnlyOneChild.meta.title as string) }}
 </template>
```

- 关键词不翻译

```typescript
// 在上面列举的zh.ts...中loading_demo_description这个key中的value 用{}包裹起来的为该语句的关键词，通常关键词不翻译，需要遵循vue-i18n的关键词写法
loading_demo_description: "该示例是演示：通过将要执行的函数传递给 {hook}，让 {hook} 自动开启全屏 {loading}，函数执行结束后自动关闭 {loading}",
```
- 自动化翻译javascript程序请看这篇 [地址](https://juejin.cn/post/7426647926590521395)

- 推荐项目
- 这是一个`国际化全栈中后台`解决方案，支持`16种`语言/三种主题切换
- 前端：`vue3.5+typescript+vite5+pinia+element-plus+unocss+sass`
- 后端`nodejs+express+mysql+redis`的管理后台项目
- 预览：网络需要绕过大陆 [kilyicms.vercel.app](https://kilyicms.vercel.app)
- `github`代码仓库  [kilyicms](https://github.com/durunsong/kilyicms.git)
- 创作不易希望点个`star`⭐⭐⭐

