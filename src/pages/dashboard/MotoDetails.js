import { useEffect, useState, useRef } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// material
import { Container, Box, Typography, Grid, Card, CardHeader, CardContent, Divider, Stack } from '@material-ui/core';
import PropTypes from 'prop-types';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMoto, getMotos } from '../../redux/slices/moto';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { fNumber } from '../../utils/formatNumber';
import CarouselProductDetails from '../../components/carousel/CarouselProductDetails';
import FacturePreview from '../../components/_dashboard/moto-app/Facture';
// ----------------------------------------------------------------------
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const url = 'https://tiamoto.com/backend';
const urlBlank = 'https://placehold.jp/24/cccccc/525252/500x500.png?text=Aucune%20photo';

// Main
export default function MotoDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const init = useRef();
  const { products, product, currentData } = useSelector((state) => state.motos);

  const currentProduct = products?.find((product) => product.id === parseInt(id, 10)) || currentData.id;
  console.log(`currentProduct: ${currentProduct}, type: ${typeof currentProduct}, not:${!currentProduct}`);

  useEffect(() => {
    dispatch(getMotos());
  }, [dispatch]);

  useEffect(() => {
    if (init.current) {
      init.current = false;
    } else if (!currentProduct) {
      navigate(`${PATH_DASHBOARD.moto.root}`);
    }
  }, [currentProduct, product]);

  const linkPJ = (linkPJ) => {
    let link;
    if (linkPJ) {
      if (linkPJ.includes('media')) {
        link = url + linkPJ;
      } else {
        link = `${url}/media/${linkPJ}`;
      }
    } else {
      link = urlBlank;
    }
    return link;
  };
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
                      linkPJ(currentProduct.PJ_CIN_Client_2_recto),
                      linkPJ(currentProduct.PJ_CIN_Client_2_verso)
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
