import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
// material
import { Box, Card, CardContent, CardHeader, Container, Grid, Stack, Typography } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CarouselProductDetails from '../../components/carousel/CarouselProductDetails';
import FacturePreview from '../../sections/moto/pdf/facture';
import { fNumber } from '../../utils/formatNumber';
import { mediaUrl } from '../../utils/mediaUrl';

// ----------------------------------------------------------------------
// Invoice page opened by scanning the QR code printed on a Facture.
// Shows what the moto's "Facture" tab shows, read-only. Managers only.

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Same number as the Facture tab and the PDF, e.g. "012/10-2026"
function numeroFacture(numero) {
  return `${`${numero}`.padStart(3, '0')}/${moment(new Date()).format('MM-YYYY')}`;
}

function formatDate(date) {
  return date ? moment(date).format('DD/MM/YYYY') : '';
}

function formatAmount(amount) {
  return amount == null ? '' : `${fNumber(amount)} Ar`;
}

function Info({ label, children }) {
  return (
    <Typography variant="body2" component="p">
      <strong>{label}:</strong> {children}
    </Typography>
  );
}

Info.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node
};

function Section({ title, children }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Stack spacing={1.5}>{children}</Stack>
      </CardContent>
    </Card>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

function Message({ title, text }) {
  return (
    <Page title="Facture">
      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto', textAlign: 'center', py: 10 }}>
          <Typography variant="h4" paragraph>
            {title}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{text}</Typography>
        </Box>
      </Container>
    </Page>
  );
}

Message.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string
};

export default function Facture() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { token } = useParams();
  const isManager = user?.role === 'manager';
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    if (!isManager) return undefined;
    let active = true;
    setState({ status: 'loading' });
    axios
      .get(`${BACKEND_URL}/api/factures/${encodeURIComponent(token)}`)
      .then((response) => active && setState({ status: 'found', facture: response.data }))
      .catch((error) => {
        if (!active) return;
        const statusByCode = { 403: 'forbidden', 404: 'notFound' };
        setState({ status: statusByCode[error.response?.status] || 'error' });
      });
    return () => {
      active = false;
    };
  }, [token, isManager]);

  if (!isManager || state.status === 'forbidden') {
    return <Message title="Accès refusé" text="Cette page est réservée aux managers." />;
  }
  if (state.status === 'notFound') {
    return <Message title="Facture introuvable" text="Cette facture n'existe pas ou a été annulée." />;
  }
  if (state.status === 'error') {
    return <Message title="Erreur" text="Impossible de charger la facture. Réessayez plus tard." />;
  }
  if (state.status === 'loading') {
    return <LoadingScreen />;
  }

  const { facture } = state;
  const { moto } = facture;
  const numero = numeroFacture(facture.numero);

  return (
    <Page title={`Facture ${numero}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Facture N° ${numero}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Moto', href: `${PATH_DASHBOARD.moto.root}/${moto.id}/edit` },
            { name: 'Facture' }
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Section title="Moto">
                <Info label="ID Moto">{moto.ID_Moto}</Info>
                <Info label="Nom Moto">{moto.nom_moto}</Info>
                <Info label="Numéro moteur">{moto.num_moteur}</Info>
                <Info label="Volume moteur">{moto.volume_moteur}</Info>
              </Section>

              <Section title="Client">
                <Info label="Nom">{moto.nom_client_2}</Info>
                <Info label="Adresse">{moto.adresse_client_2}</Info>
                <Info label="Numéro CIN">{moto.CIN_Num_Client_2}</Info>
                <Info label="Contact">{moto.tel_client_2}</Info>
                <Typography variant="body2" component="p">
                  <strong>Pièces jointes:</strong>
                </Typography>
                <CarouselProductDetails
                  images={[mediaUrl(moto.PJ_CIN_Client_2_recto), mediaUrl(moto.PJ_CIN_Client_2_verso)]}
                />
              </Section>

              <Section title="Facture">
                <Info label="Numéro facture">{numero}</Info>
                <Info label="Date Facture">{formatDate(moto.date_facture)}</Info>
                <Info label="Ref">{moto.Ref}</Info>
                <Info label="Prix de vente">{formatAmount(moto.PV)}</Info>
                <Info label="TVA">{formatAmount(moto.TVA)}</Info>
                <Info label="Prix hors taxe">{formatAmount(moto.PU_HT)}</Info>
                <Info label="Commercial">{moto.commercial}</Info>
              </Section>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <FacturePreview currentProduct={moto} isEdit />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
