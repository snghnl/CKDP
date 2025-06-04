import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChartIndexPanel } from './features/chart-index/components/ChartIndexPanel';

ReactDOM.createRoot(document.getElementById('app-container')!).render(
  <React.StrictMode>
    <ChartIndexPanel />
  </React.StrictMode>,
);
