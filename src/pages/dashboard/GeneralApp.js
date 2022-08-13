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
import { AppWelcome, AppMotoTable } from '../../components/_dashboard/general-app';
import StockWidgets from '../../components/_dashboard/moto-app/StockWidgets';
import StockTotal from '../../components/_dashboard/moto-app/StockTotal';
import VenteDetails from '../../components/_dashboard/moto-app/motoDashboardDetails';
import MotoChartHebdo from '../../components/_dashboard/moto-app/motoDashboardJourn';
import MotoChartHebdo2 from '../../components/_dashboard/moto-app/MotoDashboardChartHebdo';
import MotoChartMonth from '../../components/_dashboard/moto-app/MotoDashboardChartMensuel';
// ----------------------------------------------------------------------

export default function GeneralApp() {
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
              <AppWelcome displayName={user.displayName} />
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
            {/* <MotoChartHebdo /> */}
            <MotoChartHebdo2 />
          </Grid>
          <Grid item xs={12} md={6}>
            <MotoChartMonth />
          </Grid>

          <Grid item xs={12}>
            <VenteDetails />
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
