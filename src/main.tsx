import { createRoot } from 'react-dom/client';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import './bootstrap';
import App from './App';
import cssText from './index.css?inline';

createRoot(
  (() => {
    const host = document.createElement('div');
    host.id = 'monkey-tpls-app';

    // Ensure the shadow DOM content stacks above page content
    host.style.cssText = 'position: relative; z-index: 9999;';

    const shadow = host.attachShadow({ mode: 'open' });

    // Inject CSS into the shadow DOM instead of the main document
    const style = document.createElement('style');
    style.textContent = cssText;
    shadow.appendChild(style);

    // Mount React inside the shadow DOM
    const mountRoot = document.createElement('div');
    shadow.appendChild(mountRoot);

    // Store shadow root for App to use with StyleProvider
    (window as any).__shadowRoot__ = shadow;

    document.body.append(host);
    return mountRoot;
  })()
).render(
  <StyleProvider container={(window as any).__shadowRoot__}>
    <ConfigProvider theme={{ cssVar: { prefix: 'ant', key: 'shadow' } }}>
      <App />
    </ConfigProvider>
  </StyleProvider>
);
