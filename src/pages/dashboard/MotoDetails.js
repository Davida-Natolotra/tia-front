import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material
import { Card, CardContent, CardHeader, Container, Divider, Grid, Stack, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMotos } from '../../redux/slices/moto';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { fNumber } from '../../utils/formatNumber';
import { mediaUrl } from '../../utils/mediaUrl';
import CarouselProductDetails from '../../components/carousel/CarouselProductDetails';
import FacturePreview from '../../sections/moto/pdf/facture';

// ----------------------------------------------------------------------

// Main
export default function MotoDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { products } = useSelector((state) => state.motos);
  // True once the list has been fetched on this page, so a reload can tell "loading" from "not found"
  const [isListLoaded, setListLoaded] = useState(false);

  const currentProduct = products?.find((moto) => moto.id === Number(id));

  useEffect(() => {
    let active = true;
    dispatch(getMotos()).then(() => {
      if (active) setListLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (isListLoaded && !currentProduct) {
      navigate(PATH_DASHBOARD.moto.root, { replace: true });
    }
  }, [isListLoaded, currentProduct, navigate]);

  if (!currentProduct) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Détails">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Détails de l'enregistrement"
          links={[
            { name: '', href: PATH_DASHBOARD.moto.root },
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.moto.root
            },
            { name: currentProduct?.ID_Moto }
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Card>
                <CardHeader title="Info moto" />
                <CardContent>
                  <Typography variant="info">
                    <strong>ID moto:</strong> {currentProduct.ID_Moto}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Date d'entrée: </strong>
                    {new Date(currentProduct.date_entree).toLocaleString('fr-fr', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric'
                    })}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Nom moto:</strong> {currentProduct.nom_moto}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Numéro moteur:</strong> {currentProduct.num_moteur}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Volume moteur:</strong> {currentProduct.volume_moteur}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Fournisseur:</strong> {currentProduct.FRN}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Local:</strong> {currentProduct.localisation}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Date d'arrivée: </strong>
                    {new Date(currentProduct.date_arrivee).toLocaleString('fr-fr', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric'
                    })}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Prix d'achat:</strong> {fNumber(currentProduct.PA)} Ar
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Carte rose:</strong> {currentProduct.carte_rose}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Carte grise:</strong> {currentProduct.carte_grise}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Montant de réparation:</strong> {fNumber(currentProduct.montant_reparation)} Ar
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Motif de réparation:</strong> {currentProduct.motif_reparation}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Info client" />
                <CardContent>
                  <Typography variant="info">
                    <strong>Nom du client:</strong> {currentProduct.nom_client_2}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Adresse du client:</strong> {currentProduct.adresse_client_2}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>Contact du client:</strong> {currentProduct.tel_client_2}
                  </Typography>
                  <br />
                  <Typography variant="info">
                    <strong>CIN du client:</strong> {currentProduct.CIN_Num_Client_2}
                  </Typography>
                  <br />

                  <CarouselProductDetails
                    images={[
                      mediaUrl(currentProduct.PJ_CIN_Client_2_recto),
                      mediaUrl(currentProduct.PJ_CIN_Client_2_verso)
                    ]}
                  />

                  <br />
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="overline">Facture</Typography>
            <Divider />
            <FacturePreview isEdit={false} currentProduct={currentProduct} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
