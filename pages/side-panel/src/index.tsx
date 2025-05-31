import { createRoot } from 'react-dom/client';
import { ChartCustom } from '@src/features/chart-customization/ChartCustom';
import { mockCharts } from '@extension/shared';
import ChartColorCustom from './features/chart-customization/ChartColorCustom';
import '@src/index.css'; // Tailwind 등 포함된 스타일
import ChartCustomizationType from '@src/features/chart-customization-type/ChartPreview';
import { Divider } from '@mui/material';

function App() {
  return (
    <>
      <ChartCustom chart={mockCharts[0]} />
      <Divider />
      <ChartColorCustom />
    </>
  );
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
