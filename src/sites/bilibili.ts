import type { SitePlugin } from '../types';
import { cleanUrl } from '../utils/url';

export const bilibili: SitePlugin = {
  name: 'Bilibili',
  match: (url) => /\/\/www\.bilibili\.com\/video\//.test(url),
  commands: [
    {
      label: '📺 下载最佳画质视频',
      hint: 'bestvideo + bestaudio，合并为 MP4',
      getCommand: (url) =>
        [
          `yt-dlp "${cleanUrl(url)}"`,
          '--cookies-from-browser chrome',
          '-f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio"',
        ].join(' \\\n'),
    },
    {
      label: '🎵 下载音频（MP3）',
      hint: '提取最佳音频并转为 MP3',
      getCommand: (url) =>
        [
          `yt-dlp "${cleanUrl(url)}"`,
          '--cookies-from-browser chrome',
          '-f "bestaudio[ext=m4a]"',
          '-x --audio-format mp3',
        ].join(' \\\n'),
    },
  ],
};