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