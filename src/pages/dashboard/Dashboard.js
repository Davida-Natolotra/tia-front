import { useEffect } from 'react';
// material
import { Container, Grid, Typography } from '@material-ui/core';
// hooks
import { useDispatch } from 'react-redux';
import { resetCurrentData } from '../../redux/slices/moto';
import useCheckMobile from '../../hooks/useCheckMobile';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import DashboardWelcome from '../../sections/dashboard/DashboardWelcome';
import MotoTable from '../../sections/dashboard/MotoTable';
import StockWidgets from '../../sections/dashboard/StockWidgets';
import StockTotal from '../../sections/dashboard/StockTotal';
import SalesDetails from '../../sections/dashboard/SalesDetails';
import WeeklySalesChart from '../../sections/dashboard/WeeklySalesChart';
import MonthlySalesChart from '../../sections/dashboard/MonthlySalesChart';
// ----------------------------------------------------------------------

export default function Dashboard() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const isMobile = useCheckMobile();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCurrentData());
  }, []);

  return (
    <Page title="Moto Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={12}>
            {!isMobile ? (
              <DashboardWelcome displayName={user.displayName} />
            ) : (
              <Typography variant="heading" color="primary">
                Bonjour {user.displayName}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <StockTotal />
          </Grid>

          <Grid item xs={12} sm={8} md={8}>
            <StockWidgets />
          </Grid>

          <Grid item xs={12} md={6}>
            <WeeklySalesChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <MonthlySalesChart />
          </Grid>

          <Grid item xs={12}>
            <SalesDetails />
          </Grid>
          {/* Add here the recap */}
          <Grid item xs={12} lg={12}>
            <MotoTable />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
