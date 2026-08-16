import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseClipboardReturn {
  copiedId: string | null;
  copy: (id: string, text: string) => Promise<void>;
}

export function useClipboard(): UseClipboardReturn {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const copy = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      timerRef.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // 降级方案：如果 clipboard API 失败，尝试使用 GM_setClipboard（如果可用）
      try {
        const { GM_setClipboard } = await import('$');
        GM_setClipboard(text, 'text');
        setCopiedId(id);
        timerRef.current = setTimeout(() => setCopiedId(null), 2000);
      } catch {
        alert('复制失败，请手动复制命令');
      }
    }
  }, []);

  return { copiedId, copy };
}