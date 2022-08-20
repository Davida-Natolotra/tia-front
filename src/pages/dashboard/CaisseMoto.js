// material
import { Container, Grid } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

import MotoCaisseSolde from '../../components/_dashboard/moto-app/MotoCaisseSolde';
import MotoCaisseListe from '../../components/_dashboard/moto-app/MotoCaisseListe';
import MotoCaisseEdit from '../../components/_dashboard/moto-app/MotoCaisseEdit';
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Caisse Moto">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <MotoCaisseSolde />
          </Grid>
          <Grid item xs={12}>
            <MotoCaisseEdit />
          </Grid>
          <Grid item xs={12}>
            <MotoCaisseListe />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
