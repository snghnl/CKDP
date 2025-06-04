import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { ToggleButton } from '@extension/ui';
import { t } from '@extension/i18n';
import { Divider, Typography } from '@mui/material';
import { ChartCustom } from '@src/features/chart-customization/ChartCustom';
import { IndexingList } from '@src/features/chart-index/IndexingList';
import { DataSource } from '@src/features/data-source/DataSource';
import { useState } from 'react';
import type { Chart } from '@extension/shared';

const defaultChart: Chart = {
  id: 'default',
  name: '샘플 차트',
  description: '기본 차트 데이터',
  image: {
    id: 'img1',
    url: '',
    description: '',
    width: 800,
    height: 600,
    pageUrl: '',
    captureTimestamp: Date.now(),
    boundingRect: {
      top: 0,
      left: 0,
      width: 800,
      height: 600,
    },
  },
  type: 'bar',
  data: {
    headers: ['카테고리', '값'],
    rows: [
      ['항목 1', 100],
      ['항목 2', 200],
      ['항목 3', 300],
    ],
  },
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    background: '#FFFFFF',
    text: '#333333',
  },
  showLegend: true,
  showGrid: true,
  showLabels: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const SidePanel = () => {
  const [chart, setChart] = useState<Chart>(defaultChart);

  return (
    <div className="mt-4">
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Indexing List
      </Typography>
      <IndexingList />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Chart Customization
      </Typography>
      <ChartCustom chart={chart} onChartUpdate={setChart} />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Data Source
      </Typography>
      <DataSource />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
