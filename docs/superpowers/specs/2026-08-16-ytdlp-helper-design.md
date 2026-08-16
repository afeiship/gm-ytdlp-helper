# gm-ytdlp-helper 油猴插件设计文档

## 概述

一个油猴（Tampermonkey）插件，在支持的网站（如 Bilibili）页面右下角显示一个浮动按钮，点击后弹出命令面板，提供预设的 yt-dlp 下载命令，用户可一键复制到终端执行。

## 技术栈

- **框架**: Vite + React 19 + TypeScript
- **UI 组件**: Ant Design
- **样式**: Tailwind CSS
- **构建工具**: vite-plugin-monkey（油猴插件构建）
- **包管理器**: pnpm

## 架构

### 组件树

```
App
├── FloatButton          ← 右下角浮动按钮（通用）
└── CommandPanel         ← 命令面板（通用）
    └── CommandItem      ← 单条命令（显示文本 + 复制按钮）
```

### 数据流

1. App 启动 → 读取当前页面 URL
2. 匹配站点注册表 → 找到对应站点（如 bilibili）
3. 获取该站点的命令列表
4. 渲染 FloatButton → 用户点击 → 渲染 CommandPanel
5. 用户点击复制 → 复制到剪贴板 → 显示"已复制"提示
6. 点击外部区域或 ✕ 按钮 → 关闭面板
7. URL 变化时（SPA 路由切换）→ 重新匹配站点

### 目录结构

```
src/
  sites/
    bilibili.ts          ← Bilibili 站点实现
    index.ts             ← 站点注册表，导出所有站点
  components/
    FloatButton.tsx      ← 浮动按钮
    CommandPanel.tsx     ← 命令面板
  hooks/
    useSiteCommands.ts   ← 根据 URL 匹配站点，获取命令列表
    useClipboard.ts      ← 复制到剪贴板
  App.tsx                ← 入口，组装组件
  main.tsx               ← 挂载点
```

## 站点插件接口

```typescript
// 每个站点导出一个 SitePlugin 对象
interface SitePlugin {
  name: string;           // 站点名称，如 "Bilibili"
  match: (url: string) => boolean;  // URL 匹配规则
  commands: Command[];    // 命令列表
}

interface Command {
  label: string;          // 显示名称，如 "📺 下载最佳画质视频"
  hint?: string;          // 提示信息（可选）
  getCommand: (url: string) => string;  // 根据当前 URL 生成完整命令
}
```

## Bilibili 站点命令

| 命令 | 说明 |
|------|------|
| 📺 下载最佳画质视频 | `bestvideo + bestaudio` 合并为 MP4 |
| 🎵 下载音频（MP3） | 提取最佳音频并转为 MP3 |

### 命令详情

**下载视频：**
```bash
yt-dlp "当前网址" \
  --cookies-from-browser chrome \
  -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio"
```

**下载音频：**
```bash
yt-dlp "当前网址" \
  --cookies-from-browser chrome \
  -f "bestaudio[ext=m4a]" \
  -x --audio-format mp3
```

## 交互行为

- **浮动按钮**: 右下角 fixed 定位，圆形蓝色图标，hover 有轻微放大效果
- **命令面板**: 点击按钮从按钮上方弹出，显示命令列表
- **复制**: 点击每条命令的"复制"按钮，复制完整命令到剪贴板，显示"已复制"短暂提示
- **关闭**: 点击外部区域或面板上的 ✕ 按钮关闭
- **未匹配**: 非视频页面不显示按钮

## 边界情况处理

| 场景 | 处理方式 |
|------|----------|
| 未匹配站点 | 不渲染任何 UI，静默不工作 |
| 非视频页面 | match 规则精确匹配 `/video/` 路径，不显示按钮 |
| 复制失败 | 降级提示"复制失败，请手动复制" |
| SPA 路由切换 | 监听 URL 变化，重新匹配站点 |
| 多个站点同时匹配 | 返回第一个匹配的站点（按注册顺序） |

## 未来扩展

后续添加新站点只需：
1. 在 `src/sites/` 下新建文件，实现 `SitePlugin` 接口
2. 在 `src/sites/index.ts` 注册
3. 在 `src/install.js` 中添加对应 `@match` 规则