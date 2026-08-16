import { createRoot } from 'react-dom/client';
import './bootstrap';
import App from './App';
import './index.css';

createRoot(
  (() => {
    const app = document.createElement('div');
    app.id = 'monkey-tpls-app';
    document.body.append(app);
    return app;
  })()
).render(<App />);
