import { createRoot } from 'react-dom/client';
import '@src/index.css'; // Tailwind 등 포함된 스타일
import SidePanel from './SidePanel';

function App() {
  return <SidePanel />;
}

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(<App />);
}

init();
