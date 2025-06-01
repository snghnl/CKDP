import React from 'react';
import ReactDOM from 'react-dom/client';
import { useChartIndex } from './features/chart-index/hooks/useChartIndex';
import { ChartList } from './features/chart-index/components/ChartList';
import { ChartNavigation } from './features/chart-index/components/ChartNavigation';

function App() {
  const { charts, scrollToChart } = useChartIndex();

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white min-h-screen text-sm">
      <h2 className="text-lg font-semibold mb-2">Index</h2>
      <ChartNavigation count={charts.length} />
      <ChartList charts={charts} onClick={scrollToChart} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

// import { createRoot } from 'react-dom/client';
// import '@src/index.css';
// import SidePanel from '@src/SidePanel';

// function init() {
//   const appContainer = document.querySelector('#app-container');
//   if (!appContainer) {
//     throw new Error('Can not find #app-container');
//   }
//   const root = createRoot(appContainer);
//   root.render(<SidePanel />);
// }

// init();
