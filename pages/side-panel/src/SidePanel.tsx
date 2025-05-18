import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { ToggleButton } from '@extension/ui';
import { t } from '@extension/i18n';
import { Divider, Typography } from '@mui/material';
import { ChartCustom } from '@src/features/chart-customization/ChartCustom';
import { IndexingList } from '@src/features/chart-index/IndexingList';
import { DataSource } from '@src/features/data-source/DataSource';

const SidePanel = () => {
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
      <ChartCustom />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Data Source
      </Typography>
      <DataSource />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
