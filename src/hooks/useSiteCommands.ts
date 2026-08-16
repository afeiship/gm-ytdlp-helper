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

    const origReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      origReplaceState.apply(this, args);
      handler();
    };

    return () => {
      window.removeEventListener('popstate', handler);
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
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