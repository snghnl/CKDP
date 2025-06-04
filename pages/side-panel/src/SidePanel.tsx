import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Divider, Typography, Box } from '@mui/material';
import { IndexingList } from '@src/features/chart-index/IndexingList';
import ChartColorCustom from '@src/features/chart-color-customization/ChartColorCustom';
import { DataSource } from '@src/features/data-source/DataSource';
import { AuthButton } from '@src/auth/AuthButton';
import { useState, useEffect } from 'react';
import type { Chart } from '@extension/shared';
import { supabase } from '@src/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="mt-4">
      <div className="flex justify-end items-center gap-2">
        {user && (
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        )}
        <AuthButton />
      </div>
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Indexing List
      </Typography>
      <IndexingList />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Chart Customization
      </Typography>
      <ChartColorCustom />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Data Source
      </Typography>
      <DataSource />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
