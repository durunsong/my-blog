## 自动化翻译的JavaScript程序

## 介绍

- 本文是一个基于百度翻译API的自动化翻译`JavaScript`程序，当然你也可以使用其他`API`，例如：`deepl`(号称最准确的翻译)、网易有道翻译....
- 当你在做`vue/react/angular/jquery`国际化项目的过程中，前端的很多字段需要翻译成很多种语言，不需要业务人员翻译的情况下，这种方案更加便捷。
- 本文做的程序应用于我`vue3`项目，依赖`vue-i18n`

- **百度翻译**：[中文文档](https://fanyi-api.baidu.com/api/trans/product/index)
- **deepl**：[中文文档](https://www.deepl.com/zh/products/api)
- **网易有道翻译**:[中文文档](https://ai.youdao.com/modelTranslation.s)

## 注意事项

- 亚洲国家为了翻译更加准确，需要使用中文去翻译
- 其他地区比如美洲欧洲用英文翻译更加准确
- 做中东国家业务的，用这个程序翻译阿拉伯语需要仔细审查，还要注意但是他们的阅读习惯是向右布局RTL模式，在前端页面设计和其他地方都不一样
- 看文章前先看api一遍文档，不然很多东西不清楚在哪里

## 开始

1. 使用您的百度账号登录[百度翻译开放平台](http://api.fanyi.baidu.com/)；
2. [看文档](https://fanyi-api.baidu.com/doc/11) 注册开发者账号，选择账号类型 **个人高级版** ，高级版每月有100万字符免费调用额度
3. 注册成为开发者后，获得`APPID`和`密钥`；
4. 进行开发者认证；
5. 开通文档翻译API服务：[开通链接](https://fanyi-api.baidu.com/choose)；(通用文本翻译)
6. 配置账号相关

## 通用翻译API HTTPS 地址：

```javascript
https://fanyi-api.baidu.com/api/trans/vip/translate
```

## 文档目录结构(具体根据自己项目要求来)

```markdown
baidu-trans
├── en.js  
├── md5.js
└── index.html
```

## 流程

1. 自动读取en.js中想要翻译的字段
2. 自动遍历翻译文件对象，批量翻译
3. 自动生成对应的翻译文件
4. 自动下载对应的翻译文件

## demo

`en.js`

```json
const en = {
  // 公共提示字段
  'confirm_ok_text': 'Confirm',
  'confirm_cancel_text': 'Cancel',
  'message_content_in_development': 'In development',
  'affix_cart': 'Cart',
  'affix_cart_check_out': 'Check out cart',
  'pagination_page': 'page',
  'no_change_page': 'This is {no-change} page'
}

export default en
```
- 上面`json`案例中`key`为`no_change_page`的字段中{}包裹的内容在执行程序的时候不会被翻译，通常在这个翻译语句中是一个关键词，在页面上写法也要对应遵循`vue-i18n`的`{key，value}`写法，

`md5.js`

```javascript
var MD5 = function (string) {
  
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
  
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
  
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
  
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
  
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
  
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
  
        for (var n = 0; n < string.length; n++) {
  
            var c = string.charCodeAt(n);
  
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
  
        return utftext;
    };
  
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
  
    string = Utf8Encode(string);
  
    x = ConvertToWordArray(string);
  
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
  
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
  
    return temp.toLowerCase();
}
```

`index.html`

```html
<!DOCTYPE html>
<!-- pc站预演翻译脚本
    注: 1、语言文件中 header_language 为当前选择的语言，需手动矫正
        2、i18n 参数配置 {} 需矫正
        -'en';//英语
        -'zh';//中文
        -'de';//德语
        'el';//希腊语
        -'spa';//西班牙语
        -'fra';//法语
        'hi';//印地语
        'it';//意大利语
        'ja';//日语
        'ko';//韩语
        'nl';//荷兰语
        -'pl';//波兰语
        'pt';//葡萄牙语
        -'ro';//罗马尼亚语
        'ru';//俄语
        'sv';//瑞典语
        'tr';//土耳其语
 -->

<head>
  <meta charset="utf-8" />
</head>

<body>
  <div>打开浏览器控制台查看结果!</div>
  <div>当前翻译对象：<span id="target-lang"></span></div>
  <button onclick="window.doTrans()">点击开始翻译下载</button>

  <script src="http://apps.bdimg.com/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="./md5.js"></script>
  <script type="module">
    import en from "./en.js";
    // 翻译数据
    const fromLang = "en"; // 翻译由来
    const toLang = "pt"; // 翻译目标
    $("#target-lang").text(toLang);

    let zhKeysArr = Object.keys(en);
    let valueArr = Object.values(en);

    // 百度翻译
    function trans(valueString) {
      var appid = "";  // 应用ID
      var key = "";   // key
      var salt = new Date().getTime();
      var query = valueString;
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var from = fromLang;
      var to = toLang;
      var str1 = appid + query + salt + key;
      var sign = MD5(str1);
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
          type: "get",
          dataType: "jsonp",
          data: {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign,
          },
          success: function (data) {
            console.log("trans:", data);
            resolve(data);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    }

    // 整理语言文件
    function chunkArray(myArray, chunkSize) {
      let index = 0;
      const arrayLength = myArray.length;
      const tempArray = [];

      for (index = 0; index < arrayLength; index += chunkSize) {
        const myChunk = myArray.slice(index, index + chunkSize);
        tempArray.push(myChunk);
      }

      return tempArray;
    }

    // 分组  8个一组
    const result = chunkArray(valueArr, 8);

    async function doTrans() {
      let transPromises = result.map((chunk) => {
        const str = chunk.join("\n");
        return trans(str);
      });

      try {
        let transResults = await Promise.all(transPromises);
        let transStrArr = transResults.flatMap((data) => {
          if (data && data.trans_result) {
            return data.trans_result.map((result) => result.dst);
          } else {
            return [];
          }
        });
        console.log("result", transStrArr);
        resultDown(transStrArr);
      } catch (error) {
        console.error("Translation failed:", error);
      }
    }

    // 将 doTrans 函数挂载到 window 对象上
    window.doTrans = doTrans;

    // 生成文件 // 定时循环翻译 
    // // 翻译结果整理为数组
    function resultDown(transStrArr) {
      const filename = toLang;
      let downloadObj = {};

      for (let i in zhKeysArr) {
        downloadObj[String(zhKeysArr[i])] = transStrArr[i];
      }

      let downloadData = Object.entries(downloadObj)
        .map(
          ([key, value]) =>
            `${JSON.stringify(key)}: ${JSON.stringify(value)},\n`
        )
        .join("");
      downloadFile(`const ${filename} = {${downloadData}}`, `${filename}.js`);
    }

    // 下载
    function downloadFile(data, filename) {
      const blob = new Blob([data], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  </script>
</body>
```



## demo简介

这个项目通过使用 **百度翻译 API** 和 **JavaScript** 来实现批量翻译和下载翻译后的语言文件。为了提高翻译效率，我们将数据按块分割，使用异步处理将翻译请求并发发送，确保在短时间内完成大量文本的翻译。

## 主要步骤

1. **准备翻译数据**：将原始语言文件中的内容拆分为多个小块。
2. **调用百度翻译 API**：对每个小块内容进行翻译。
3. **整理翻译结果**：将翻译结果与原始语言文件的键值重新组合。
4. **生成文件并下载**：将翻译后的语言数据生成 JavaScript 文件并自动下载。

## 代码结构分析

## 1. HTML 与 JavaScript 基础结构

```html
<div>当前翻译对象：<span id="target-lang"></span></div>
<button onclick="window.doTrans()">点击开始翻译下载</button>
```

页面中有两个主要元素：

- 一个用于显示当前翻译目标语言的 `<span>` 标签。
- 一个触发翻译过程的按钮，点击后调用 `window.doTrans()` 函数。

## 2. 翻译数据的引入与初始化

```javascript
import en from "./en.js";
const fromLang = "en"; // 源语言
const toLang = "pt";   // 目标语言
$("#target-lang").text(toLang);
```

在这里，我们引入了 `en.js` 文件，该文件包含需要翻译的内容。代码将 `fromLang` 设置为 **英语**，并将 `toLang` 设置为 **葡萄牙语**，页面中的 `<span>` 标签也会显示目标语言。

## 3. 百度翻译 API 调用逻辑

```javascript
function trans(valueString) {
  var appid = "";  // 应用ID
  var key = "";    // 密钥
  var salt = new Date().getTime();
  var query = valueString;
  var from = fromLang;
  var to = toLang;
  var str1 = appid + query + salt + key;
  var sign = MD5(str1);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
      type: "get",
      dataType: "jsonp",
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
      },
      success: function (data) {
        console.log("trans:", data);
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
```

`trans` 函数是与百度翻译 API 交互的核心部分。它使用 **Ajax** 发送请求，将文本 `valueString` 传递给 API 进行翻译。由于百度翻译需要签名校验，这里通过 `MD5` 算法生成签名（`sign`）。

需要注意的是，实际项目中，你需要填写 `appid` 和 `key`，这些可以从百度翻译开发者平台获取。

## 4. 分组处理

```javascript
function chunkArray(myArray, chunkSize) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];
  for (index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    tempArray.push(myChunk);
  }
  return tempArray;
}
```

为了优化翻译请求的处理效率，`chunkArray` 函数将大块的翻译数据分割成小块。在这里，数据被分成每组 8 个的数组，以便更好地处理 API 的并发请求。

## 5. 执行翻译

```javascript
async function doTrans() {
  let transPromises = result.map((chunk) => {
    const str = chunk.join("\n");
    return trans(str);
  });

  try {
    let transResults = await Promise.all(transPromises);
    let transStrArr = transResults.flatMap((data) => {
      if (data && data.trans_result) {
        return data.trans_result.map((result) => result.dst);
      } else {
        return [];
      }
    });
    console.log("result", transStrArr);
    resultDown(transStrArr);
  } catch (error) {
    console.error("Translation failed:", error);
  }
}
```

`doTrans` 是翻译流程的主函数。它会将每个分组的数据发送给百度翻译` API`，并等待所有请求完成后再继续。所有翻译完成后，将结果处理为数组，并调用 `resultDown` 函数生成文件。

## 6. 整理翻译结果与下载

```javascript
function resultDown(transStrArr) {
  const filename = toLang;
  let downloadObj = {};
  for (let i in zhKeysArr) {
    downloadObj[String(zhKeysArr[i])] = transStrArr[i];
  }

  let downloadData = Object.entries(downloadObj)
    .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},\n`)
    .join("");
  downloadFile(`const ${filename} = {${downloadData}}`, `${filename}.js`);
}

function downloadFile(data, filename) {
  const blob = new Blob([data], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

在这里，`resultDown` 函数将翻译结果和对应的键值重新组合，形成一个可用的对象格式。接着，`downloadFile` 函数会生成一个 `.js` 文件并触发浏览器下载。

## 7. 翻译流程演示

点击按钮后，翻译流程开始：

1. 文本会被分组并传递到百度翻译 API。
2. 所有翻译任务完成后，整理并生成翻译后的语言文件。
3. 文件自动下载，文件名为目标语言代码（如 `pt.js`）。

## 检验多语言文件字段是否一致

**场景：**当我们一个项目有大量翻译的语言对象时(en/pt/spa/.....),平时我们在添加多语言key的时候，有时候会遗漏的情况，比如说 : 我们初始文件有两个，亚洲国家用中文文件翻译zh.js，其他国家用英语翻译en.js，有时候我在zh.js添加了一个语言key为user:'个人'，但是在en.js中遗漏掉了这个key，下面这个diff.html文件就是为了检验我们在开发过程中是否存在这种错误。

```html
<!-- 开发时检查两个文件字段名是否有纰漏 ---- 翻译审查工具----  -->
<!-- 本文件可直接删除 -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Execute Code</title>
  </head>

  <body>
    <button id="executeButton">开始执行</button>

    <script>
      document
        .getElementById("executeButton")
        .addEventListener("click", function () {
          // 注意改成js模式 因为是module导出typeScript会报错
          import("./en.js").then(({ default: en }) => {
            import("./zh.js").then(({ default: zh }) => {
              const enKeys = Object.keys(en);
              const zhKeys = Object.keys(zh);
              const differentKeys = enKeys
                .filter((key) => !zhKeys.includes(key))
                .concat(zhKeys.filter((key) => !enKeys.includes(key)));
              const enDifferent = Object.fromEntries(
                Object.entries(en).filter(([key]) =>
                  differentKeys.includes(key),
                ),
              );
              const zhDifferent = Object.fromEntries(
                Object.entries(zh).filter(([key]) =>
                  differentKeys.includes(key),
                ),
              );

              console.log("enDifferent:", enDifferent); // en.js 对比结果不同项
              console.log("zhDifferent:", zhDifferent); // zh.js 对比结果不同项
            });
          });
        });
    </script>
  </body>
</html>
```
## github代码仓库
- 创作不易希望点个`star`⭐⭐⭐
[github](https://github.com/durunsong/Baidu-trans.git)

## 总结

- 这个`demo`展示了如何使用百度翻译 `API` 快速实现多语言文件的自动化翻译。通过分组处理和异步请求，能够高效地翻译大量文本，并将结果下载为对应的语言文件放在项目中。
- 其他`API`翻译也类似这样的写法

## 推荐项目
- 这是一个`国际化全栈中后台`解决方案，支持`16种`语言切换
- 前端：`vue3.5+typescript+vite5+pinia+element-plus+unocss+sass`
- 后端`nodejs+express+mySQL/postgreSQL+redis`的管理后台项目
- 预览：网络需要绕过大陆 [kilyicms.vercel.app](https://kilyicms.vercel.app/ "https://kilyicms.vercel.app")
- `github`代码仓库  [kilyicms](https://github.com/durunsong/kilyicms.git)
- 创作不易希望点个`star`⭐⭐⭐

