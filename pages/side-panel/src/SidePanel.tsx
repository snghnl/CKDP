import '@src/SidePanel.css';
import { Citation, withErrorBoundary, withSuspense } from '@extension/shared';
import { Divider, Typography, Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { IndexingList } from '@src/features/chart-index/IndexingList';
import { DataSourcePanel } from '@src/features/data-source/components/DataSourcePanel';
import ChartColorCustom from '@src/features/chart-color-customization/ChartColorCustom';
import { AuthButton } from '@src/auth/AuthButton';
import { useState, useEffect } from 'react';
import { Chart, defaultChart, defaultCitation } from '@extension/shared';
import { supabase } from '@src/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: isMobile ? 1.5 : 3 }}>{children}</Box>}
    </div>
  );
}

const SidePanel = () => {
  const [chart, setChart] = useState<Chart>(defaultChart);
  const [citation, setCitation] = useState<Citation[]>(defaultCitation);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

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
    <div className="mt-2 sm:mt-4">
      <div className="flex justify-end items-center gap-2 px-2 sm:px-4">
        {user && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              display: { xs: 'none', sm: 'block' },
            }}>
            {user.email}
          </Typography>
        )}
        <AuthButton />
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="side panel tabs"
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              fontSize: isMobile ? '0.875rem' : '1rem',
              minHeight: isMobile ? '48px' : '64px',
            },
          }}>
          <Tab label="Indexing List" />
          <Tab label="Chart Customization" />
          <Tab label="Data Source" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            mb: isMobile ? 1 : 2,
          }}>
          Indexing List
        </Typography>
        <IndexingList setChart={setChart} setCitation={setCitation} />
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            mb: isMobile ? 1 : 2,
          }}>
          Chart Customization
        </Typography>
        <ChartColorCustom chart={chart} />
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            mb: isMobile ? 1 : 2,
          }}>
          Data Source
        </Typography>
        <DataSourcePanel citations={citation} />
      </TabPanel>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
