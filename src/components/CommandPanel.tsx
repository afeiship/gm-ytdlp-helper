import { type FC, useEffect, useRef } from 'react';
import { Button, Card, Typography } from 'antd';
import { CloseOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import type { Command } from '../types';
import { useClipboard } from '../hooks/useClipboard';

const { Text, Paragraph } = Typography;

interface CommandPanelProps {
  siteName: string;
  commands: Command[];
  currentUrl: string;
  onClose: () => void;
}

const CommandPanel: FC<CommandPanelProps> = ({ siteName, commands, currentUrl, onClose }) => {
  const { copiedId, copy } = useClipboard();
  const panelRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭（兼容 Shadow DOM：使用 composedPath 而非 target）
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.composedPath()[0] as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 z-[9998]" />
      {/* 面板 */}
      <div ref={panelRef} className="fixed bottom-24 right-6 z-[9999] w-[380px]">
        <Card
          styles={{ body: { padding: 0, maxHeight: 400, overflowY: 'auto' } }}
          title={
            <span className="text-sm font-semibold">
              yt-dlp 命令 · {siteName}
            </span>
          }
          extra={
            <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
          }
        >
          {commands.map((cmd, idx) => {
            const commandText = cmd.getCommand(currentUrl);
            const isCopied = copiedId === `cmd-${idx}`;

            return (
              <div
                key={cmd.label}
                className={`px-4 py-3 ${idx > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <Text strong className="mb-1.5 block">
                  {cmd.label}
                </Text>
                {cmd.hint && (
                  <Text type="secondary" className="mb-2 block text-xs">
                    {cmd.hint}
                  </Text>
                )}
                <Paragraph
                  code
                  className="mb-2 rounded-lg bg-gray-50 p-3"
                  style={{ marginBottom: 8 }}
                >
                  {commandText}
                </Paragraph>
                <Button
                  type={isCopied ? 'default' : 'primary'}
                  size="small"
                  icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={() => copy(`cmd-${idx}`, commandText)}
                  className={isCopied ? 'text-green-600 border-green-600' : ''}
                >
                  {isCopied ? '已复制' : '复制命令'}
                </Button>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
};

export default CommandPanel;