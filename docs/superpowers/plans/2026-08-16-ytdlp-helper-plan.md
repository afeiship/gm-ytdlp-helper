# ytdlp-helper 浮动按钮 + 命令面板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个油猴插件，在 Bilibili 视频页面右下角显示浮动按钮，点击弹出命令面板，提供 yt-dlp 下载命令一键复制。

**Architecture:** 站点插件模式 — 通用组件（FloatButton、CommandPanel）+ 可插拔站点模块（sites/bilibili.ts）。App 根据当前 URL 匹配站点，动态渲染对应命令。

**Tech Stack:** Vite + React 19 + TypeScript + Tailwind CSS + Ant Design + vite-plugin-monkey + ahooks

---

## File Structure

### New files to create:
| File | Responsibility |
|------|---------------|
| `src/types.ts` | `SitePlugin`、`Command` 类型定义 |
| `src/sites/bilibili.ts` | Bilibili 站点插件（匹配规则 + 2 条命令） |
| `src/sites/index.ts` | 站点注册表，聚合所有站点插件 |
| `src/hooks/useClipboard.ts` | 复制到剪贴板，返回复制状态 |
| `src/hooks/useSiteCommands.ts` | 监听 URL 变化，匹配当前站点，返回命令列表 |
| `src/components/FloatButton.tsx` | 右下角固定圆形按钮 |
| `src/components/CommandPanel.tsx` | 命令面板，显示命令列表 + 复制按钮 |

### Files to modify:
| File | Change |
|------|--------|
| `src/App.tsx` | 替换为新的入口逻辑，组装组件 |
| `vite.config.ts` | 更新 `match` 为 Bilibili 视频页面 |
| `src/install.js` | 添加 Bilibili `@match` 规则 |

---

### Task 1: 定义类型（src/types.ts）

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
export interface Command {
  label: string;
  hint?: string;
  getCommand: (url: string) => string;
}

export interface SitePlugin {
  name: string;
  match: (url: string) => boolean;
  commands: Command[];
}
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/types.ts
git commit -m "feat: add SitePlugin and Command types"
```

---

### Task 2: 创建 Bilibili 站点插件（src/sites/bilibili.ts）

**Files:**
- Create: `src/sites/bilibili.ts`

- [ ] **Step 1: 创建 Bilibili 站点插件**

```typescript
import type { SitePlugin } from '../types';

export const bilibili: SitePlugin = {
  name: 'Bilibili',
  match: (url) => /\/\/www\.bilibili\.com\/video\//.test(url),
  commands: [
    {
      label: '📺 下载最佳画质视频',
      hint: 'bestvideo + bestaudio，合并为 MP4',
      getCommand: (url) =>
        `yt-dlp "${url}" \
  --cookies-from-browser chrome \
  -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio"`,
    },
    {
      label: '🎵 下载音频（MP3）',
      hint: '提取最佳音频并转为 MP3',
      getCommand: (url) =>
        `yt-dlp "${url}" \
  --cookies-from-browser chrome \
  -f "bestaudio[ext=m4a]" \
  -x --audio-format mp3`,
    },
  ],
};
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/sites/bilibili.ts
git commit -m "feat: add Bilibili site plugin with video/audio download commands"
```

---

### Task 3: 创建站点注册表（src/sites/index.ts）

**Files:**
- Create: `src/sites/index.ts`

- [ ] **Step 1: 创建站点注册表**

```typescript
import type { SitePlugin } from '../types';
import { bilibili } from './bilibili';

export const sites: SitePlugin[] = [
  bilibili,
];
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/sites/index.ts
git commit -m "feat: add site registry"
```

---

### Task 4: 创建 useClipboard 钩子（src/hooks/useClipboard.ts）

**Files:**
- Create: `src/hooks/useClipboard.ts`

- [ ] **Step 1: 创建 useClipboard 钩子**

```typescript
import { useCallback, useState } from 'react';

export interface UseClipboardReturn {
  copiedId: string | null;
  copy: (id: string, text: string) => Promise<void>;
}

export function useClipboard(): UseClipboardReturn {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // 降级方案：如果 clipboard API 失败，尝试使用 GM_setClipboard（如果可用）
      try {
        const { GM_setClipboard } = await import('$');
        GM_setClipboard(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
        alert('复制失败，请手动复制命令');
      }
    }
  }, []);

  return { copiedId, copy };
}
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useClipboard.ts
git commit -m "feat: add useClipboard hook with fallback"
```

---

### Task 5: 创建 useSiteCommands 钩子（src/hooks/useSiteCommands.ts）

**Files:**
- Create: `src/hooks/useSiteCommands.ts`

- [ ] **Step 1: 创建 useSiteCommands 钩子**

```typescript
import { useEffect, useState } from 'react';
import type { Command, SitePlugin } from '../types';
import { sites } from '../sites';

function useCurrentUrl(): string {
  const [url, setUrl] = useState(window.location.href);

  useEffect(() => {
    const handler = () => setUrl(window.location.href);
    window.addEventListener('popstate', handler);

    // 拦截 pushState/replaceState 以检测 SPA 路由切换
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      origPushState.apply(this, args);
      handler();
    };

    return () => {
      window.removeEventListener('popstate', handler);
      history.pushState = origPushState;
    };
  }, []);

  return url;
}

export interface UseSiteCommandsReturn {
  currentSite: SitePlugin | null;
  commands: Command[];
  currentUrl: string;
}

export function useSiteCommands(): UseSiteCommandsReturn {
  const currentUrl = useCurrentUrl();

  const currentSite = sites.find((s) => s.match(currentUrl)) ?? null;
  const commands = currentSite?.commands ?? [];

  return { currentSite, commands, currentUrl };
}
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useSiteCommands.ts
git commit -m "feat: add useSiteCommands hook with URL matching"
```

---

### Task 6: 创建 FloatButton 组件（src/components/FloatButton.tsx）

**Files:**
- Create: `src/components/FloatButton.tsx`

- [ ] **Step 1: 创建 FloatButton 组件**

```typescript
import { type FC } from 'react';

interface FloatButtonProps {
  onClick: () => void;
}

const FloatButton: FC<FloatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#1677ff] text-lg text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ boxShadow: '0 4px 12px rgba(22,119,255,0.4)' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
};

export default FloatButton;
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/components/FloatButton.tsx
git commit -m "feat: add FloatButton component"
```

---

### Task 7: 创建 CommandPanel 组件（src/components/CommandPanel.tsx）

**Files:**
- Create: `src/components/CommandPanel.tsx`

- [ ] **Step 1: 创建 CommandPanel 组件**

```typescript
import { type FC, useEffect, useRef } from 'react';
import type { Command } from '../types';
import { useClipboard } from '../hooks/useClipboard';

interface CommandPanelProps {
  siteName: string;
  commands: Command[];
  currentUrl: string;
  onClose: () => void;
}

const CommandPanel: FC<CommandPanelProps> = ({ siteName, commands, currentUrl, onClose }) => {
  const { copiedId, copy } = useClipboard();
  const panelRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // 延迟添加以避免触发当前点击事件
    const timer = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handler);
    };
  }, [onClose]);

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 z-[9998]" />
      {/* 面板 */}
      <div
        ref={panelRef}
        className="fixed bottom-24 right-6 z-[9999] w-[380px] rounded-xl bg-white shadow-2xl"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="text-sm font-semibold text-gray-800">
            yt-dlp 命令 · {siteName}
          </span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 命令列表 */}
        <div className="max-h-[400px] overflow-y-auto px-4 py-3">
          {commands.map((cmd, idx) => {
            const commandText = cmd.getCommand(currentUrl);
            const isCopied = copiedId === `cmd-${idx}`;

            return (
              <div
                key={idx}
                className={`${idx > 0 ? 'mt-3 border-t border-gray-50 pt-3' : ''}`}
              >
                <div className="mb-1.5 text-sm font-medium text-gray-800">
                  {cmd.label}
                </div>
                {cmd.hint && (
                  <div className="mb-2 text-xs text-gray-400">{cmd.hint}</div>
                )}
                <pre className="mb-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
                  {commandText}
                </pre>
                <button
                  onClick={() => copy(`cmd-${idx}`, commandText)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isCopied
                      ? 'bg-green-50 text-green-600'
                      : 'bg-[#1677ff] text-white hover:bg-[#4096ff]'
                  }`}
                >
                  {isCopied ? '✅ 已复制' : '📋 复制命令'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CommandPanel;
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/components/CommandPanel.tsx
git commit -m "feat: add CommandPanel component with copy support"
```

---

### Task 8: 修改 App.tsx（src/App.tsx）

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 重写 App.tsx**

```typescript
import { useBoolean } from 'ahooks';
import FloatButton from './components/FloatButton';
import CommandPanel from './components/CommandPanel';
import { useSiteCommands } from './hooks/useSiteCommands';

function App() {
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  const { currentSite, commands, currentUrl } = useSiteCommands();

  // 未匹配站点时不渲染任何内容
  if (!currentSite) return null;

  return (
    <>
      <FloatButton onClick={setTrue} />
      {isOpen && (
        <CommandPanel
          siteName={currentSite.name}
          commands={commands}
          currentUrl={currentUrl}
          onClose={setFalse}
        />
      )}
    </>
  );
}

export default App;
```

- [ ] **Step 2: 验证编译通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/App.tsx
git commit -m "feat: wire up App with FloatButton and CommandPanel"
```

---

### Task 9: 更新 vite.config.ts 匹配规则

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 更新 match 规则**

将 `match: ['https://www.google.com/']` 改为 Bilibili 视频页匹配：

```typescript
match: ['https://www.bilibili.com/video/*']
```

- [ ] **Step 2: 验证构建通过**

Run: `pnpm build`
Expected: 构建成功，`dist/` 下生成 `.user.js` 文件

- [ ] **Step 3: 提交**

```bash
git add vite.config.ts
git commit -m "chore: update match pattern to Bilibili video pages"
```

---

### Task 10: 更新 install.js 添加 Bilibili 匹配规则

**Files:**
- Modify: `src/install.js`

- [ ] **Step 1: 在 install.js 的 `@match` 中添加 Bilibili**

```diff
- // @match    *://www.dianping.com/*
+ // @match    *://www.bilibili.com/video/*
```

- [ ] **Step 2: 提交**

```bash
git add src/install.js
git commit -m "chore: add Bilibili match rule to install script"
```

---

## Spec Coverage Check

| 设计文档要求 | 对应任务 |
|-------------|---------|
| SitePlugin / Command 类型定义 | Task 1 |
| Bilibili 站点 2 条命令 | Task 2 |
| 站点注册表 | Task 3 |
| 复制到剪贴板功能 | Task 4 |
| URL 匹配 + SPA 路由切换监听 | Task 5 |
| 浮动按钮 UI | Task 6 |
| 命令面板 UI + 复制按钮 + 外部点击关闭 | Task 7 |
| App 入口组装 | Task 8 |
| 油猴 match 规则 | Task 9, 10 |
| 未匹配站点不渲染 | Task 8 (App.tsx 中 `if (!currentSite) return null`) |
| 复制失败降级 | Task 4 (try/catch + alert fallback) |