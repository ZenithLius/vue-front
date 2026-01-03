# 全局样式配置说明

本文档说明了项目中的全局样式（特别是绿色字体）是如何配置的。

## 1. 颜色定义 (`tailwind.config.js`)

自定义颜色在 Tailwind CSS 配置文件中定义。

- **文件**: `tailwind.config.js`
- **位置**: `theme.extend.colors`

```javascript
colors: {
    'retro-bg': '#0a0a0a',      // 背景黑
    'retro-green': '#00ff41',   // <--- 这是全局通用的绿色
    'retro-amber': '#ffb000',   // 琥珀色
    'retro-red': '#ff0033',     // 红色
    'retro-blue': '#00f0ff',    // 蓝色
},
```

## 2. 全局应用 (`src/style.css`)

`retro-green` 颜色被全局应用到了 `<body>` 标签，使其成为整个应用的默认文本颜色。

- **文件**: `src/style.css`
- **位置**: `body` 规则

```css
body {
  /* text-retro-green 设置了默认字体颜色 */
  @apply bg-retro-bg text-retro-green font-retro overflow-hidden;
  /* ... */
}
```

## 如何修改

1.  **修改绿色色值**: 编辑 `tailwind.config.js` 中的 `#00ff41` 十六进制代码。
2.  **修改默认文本颜色**: 编辑 `src/style.css` 中的 `@apply text-retro-green` 类为其他颜色（例如 `text-retro-amber`）。

CRT 扫描线 (Scanlines):
位置: 
src/style.css
 (第 18-35 行)
类名: .scanlines
效果: 屏幕上滚动的横向扫描线。
屏幕闪烁 (Flicker):
位置: 
tailwind.config.js
 (第 21 行)
动画名: animate-flicker
效果: 模拟老式显示器的轻微亮度闪烁。