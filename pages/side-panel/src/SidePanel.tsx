import '@src/SidePanel.css';
import { Citation, withErrorBoundary, withSuspense } from '@extension/shared';
import { Divider, Typography, Box } from '@mui/material';
import { IndexingList } from '@src/features/chart-index/IndexingList';
import { DataSourcePanel } from '@src/features/data-source/components/DataSourcePanel';
import ChartColorCustom from '@src/features/chart-color-customization/ChartColorCustom';
import { AuthButton } from '@src/auth/AuthButton';
import { useState, useEffect } from 'react';
import { Chart, defaultChart, defaultCitation } from '@extension/shared';
import { supabase } from '@src/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

const SidePanel = () => {
  const [chart, setChart] = useState<Chart>(defaultChart);
  const [citation, setCitation] = useState<Citation[]>(defaultCitation);
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
      <IndexingList setChart={setChart} setCitation={setCitation} />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Chart Customization
      </Typography>
      <ChartColorCustom chart={chart} setChart={setChart} />
      <Divider />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Data Source
      </Typography>
      <DataSourcePanel citations={citation} />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
