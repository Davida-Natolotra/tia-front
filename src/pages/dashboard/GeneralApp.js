// material
import { Container, Grid, Typography, Stack } from '@material-ui/core';
// hooks
import useCheckMobile from '../../hooks/useCheckMobile';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppMotoTable,
  AppWidgets1,
  AppWidgets2,
  AppStockState,
  AppLastInvoice,
  AppLastBL,
  AppFetch
} from '../../components/_dashboard/general-app';

import {
  BankingIncome,
  BankingExpenses,
  BankingContacts,
  BankingInviteFriends,
  BankingQuickTransfer,
  BankingCurrentBalance,
  BankingBalanceStatistics,
  BankingRecentTransitions,
  BankingExpensesCategories
} from '../../components/_dashboard/general-banking';

import VenteDetails from '../../components/_dashboard/moto-app/motoDashboardDetails';

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
            {!isMobile ? (
              <AppWelcome displayName={user.displayName} />
            ) : (
              <Typography variant="heading" color="primary">
                Bonjour {user.displayName}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <AppStockState />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <AppLastInvoice />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <AppLastBL />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <BankingBalanceStatistics />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <VenteDetails />
            </Stack>
          </Grid>
          {/* Add here the recap */}
          <Grid item xs={12} lg={12}>
            {/* {isMobile ? (
              <Stack spacing={3}>
                <AppWidgets1 />
                <AppWidgets2 />
              </Stack>
            ) : (
              
            )} */}
            <AppMotoTable />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
