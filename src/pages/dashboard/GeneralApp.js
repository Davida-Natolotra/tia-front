// material
import { Container, Grid, Stack } from '@material-ui/core';
// hooks
import useCheckMobile from '../../hooks/useCheckMobile';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { AppWelcome, AppNewInvoice, AppWidgets1, AppWidgets2 } from '../../components/_dashboard/general-app';

import {
  AnalyticsNewUsers,
  AnalyticsBugReports,
  AnalyticsItemOrders,
  AnalyticsWeeklySales,
  AnalyticsWebsiteVisits
} from '../../components/_dashboard/general-analytics';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const isMobile = useCheckMobile();

  return (
    <Page title="Moto Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user.displayName} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWeeklySales />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsBugReports />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsWebsiteVisits />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsWebsiteVisits />
          </Grid>
          <Grid item xs={12} lg={12}>
            {isMobile ? (
              <Stack spacing={3}>
                <AppWidgets1 />
                <AppWidgets2 />
              </Stack>
            ) : (
              <AppNewInvoice />
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
