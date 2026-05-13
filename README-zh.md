# CSV 转 Markdown 表格

[![npm version](https://badge.fury.io/js/csv-to-markdown-table.svg)](https://badge.fury.io/js/csv-to-markdown-table)
![npm](https://img.shields.io/npm/dt/csv-to-markdown-table.svg?color=blue)
[![Coverage Status](https://coveralls.io/repos/github/donatj/CsvToMarkdownTable/badge.svg?branch=master)](https://coveralls.io/github/donatj/CsvToMarkdownTable?branch=master)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/donatj/csvtomarkdowntable/master/LICENSE.md)

简单的 JavaScript CSV 转 Markdown 表格转换器。

你可以查看[在线示例](https://donatstudios.com/CsvToMarkdownTable)并亲自体验。

**无需外部库**。支持 Node.js 和浏览器环境。

## 安装

```bash
npm install csv-to-markdown-table
```

## 使用方法

### 命令行工具 (CLI)

这个包还包含一个命令行工具。你可以全局安装：

```bash
npm install -g csv-to-markdown-table
```

然后这样使用：

```bash
$ csv-to-markdown-table --help
用法: csv-to-markdown-table [选项]
// … 帮助输出

$ csv-to-markdown-table --delimiter ',' --headers < example.csv
| cats | dogs | fish | 
|------|------|------| 
| 1    | 2    | 3    | 
| 4    | 5    | 6    |
$ csv-to-markdown-table
从 stdin 读取...（在行首按 Ctrl+D 完成输入）
CSV 分隔符: \t (制表符) 表头: false
[交互式输入]
```

### 浏览器通过 CDN (UMD)

```html
<script src="https://unpkg.com/csv-to-markdown-table"></script>
<script>
  console.log(
    csvToMarkdown("header1,header2,header3\nValue1,Value2,Value3", ",", true)
  );
</script>
```

### Node.js 使用 CommonJS (require)

```js
const csvToMarkdown = require("csv-to-markdown-table");

console.log(
  csvToMarkdown("header1,header2,header3\nValue1,Value2,Value3", ",", true)
);
```

### Node.js 使用 ES Modules (import)

```js
import csvToMarkdown from "csv-to-markdown-table";

console.log(
  csvToMarkdown("header1,header2,header3\nValue1,Value2,Value3", ",", true)
);
```

### TypeScript

```ts
import csvToMarkdown from "csv-to-markdown-table";

console.log(
  csvToMarkdown("header1,header2,header3\nValue1,Value2,Value3", ",", true)
);
```

#### 输出：

```markdown
| header1 | header2 | header3 | 
|---------|---------|---------| 
| Value1  | Value2  | Value3  | 
```

在 Markdown 中显示为：

| header1 | header2 | header3 | 
|---------|---------|---------| 
| Value1  | Value2  | Value3  | 

## 分发格式

这个包以多种格式分发：

- **UMD**：通用模块定义，适用于浏览器和传统环境（在浏览器中加载时包含 csvToMarkdown 全局变量）
  - `lib/CsvToMarkdown.js`（未压缩）
  - `lib/CsvToMarkdown.min.js`（压缩）
- **ESM**：ES 模块，适用于现代 JavaScript 环境
  - `lib/CsvToMarkdown.mjs`
- **CJS**：CommonJS，适用于 Node.js
  - `lib/CsvToMarkdown.cjs`

package.json 配置了适当的字段，确保在每个环境中使用正确的格式：

- `main`：指向 CommonJS 构建
- `module`：指向 ESM 构建
- `browser`：指向 UMD 构建
- `unpkg`：指向压缩的 UMD 构建
- `exports`：为不同环境提供条件导出

## API

### csvToMarkdown(csvString, delimiter, hasHeaders)

将 CSV 字符串转换为 Markdown 表格。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| csvString | string | CSV 格式的字符串 |
| delimiter | string | CSV 分隔符（默认为逗号 `,`） |
| hasHeaders | boolean | 是否包含表头（默认为 `false`） |

**返回值：**

返回 Markdown 表格格式的字符串。

**示例：**

```js
const csvToMarkdown = require("csv-to-markdown-table");

// 基本用法
const result = csvToMarkdown("name,age\n张三,25\n李四,30", ",", true);
console.log(result);
// 输出：
// | name | age |
// |------|-----|
// | 张三 | 25  |
// | 李四 | 30  |

// 使用制表符作为分隔符
const tsvResult = csvToMarkdown("name\tage\n张三\t25", "\t", true);
console.log(tsvResult);
```

## 许可证

MIT

---

> 项目地址：[donatj/CsvToMarkdownTable](https://github.com/donatj/CsvToMarkdownTable)
> npm 包：[csv-to-markdown-table](https://www.npmjs.com/package/csv-to-markdown-table)
