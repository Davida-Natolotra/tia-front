// material
import { Container, Grid } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

import CaisseSolde from '../../sections/caisse/CaisseSolde';
import CaisseList from '../../sections/caisse/CaisseList';
import CaisseForm from '../../sections/caisse/CaisseForm';
// ----------------------------------------------------------------------

export default function Caisse() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Caisse Moto">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <CaisseSolde />
          </Grid>
          <Grid item xs={12}>
            <CaisseForm />
          </Grid>
          <Grid item xs={12}>
            <CaisseList />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
