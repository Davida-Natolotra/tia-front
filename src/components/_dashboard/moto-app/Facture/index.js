import React from 'react';
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';
import Body from './Body';
import { fNumber } from '../../../../utils/formatNumber';

export default function FactureMoto({ currentProduct }) {
  const [height, setHeight] = React.useState(window.innerHeight);
  const updateWidthAndHeight = () => {
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  });
  // Models
  // Clients
  const nomClient = 'RAKOTO Haja';
  const adresseClient = 'Rue de la paix';
  const telClient = '+221 77 888 888';

  // Moto
  const nomMoto = 'Honda';
  const numMoteur = '123456789';
  const volumeMoteur = '100 cc';

  // Facture
  const numFacture = '10';
  const dateFacture = '01/01/2020';
  const PUHT = 3000000;
  const TVA = 40000;
  const total = 500000;
  const totalLettre = 'cinquante mille ';

  // Data
  const data = {
    nomClient: currentProduct.nom_client_2,
    adresseClient: currentProduct.adresse_client_2,
    telClient: currentProduct.tel_client_2,
    nomMoto: currentProduct.nom_moto,
    numMoteur: currentProduct.num_moteur,
    volumeMoteur: currentProduct.volume_moteur,
    numFacture: currentProduct.num_sur_facture,
    dateFacture: currentProduct.date_facture,
    PUHT: fNumber(currentProduct.PU_HT),
    TVA: fNumber(currentProduct.TVA),
    total: fNumber(currentProduct.PV),
    totalLettre: currentProduct.montant_lettre,
    ref: currentProduct.Ref
  };

  return (
    <PDFViewer width="100%" height={height * 0.6}>
      <Document>
        <Page style={styles.body} size="A4" orientation="landscape">
          <Body data={data} />
          <Body data={data} />
        </Page>
      </Document>
    </PDFViewer>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 20
  },
  element: {
    width: '50%',
    marginRight: 30
  },
  element2: {
    width: '50%',
    marginLeft: 30
  }
});
