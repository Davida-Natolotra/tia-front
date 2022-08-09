import React from 'react';
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
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

  // Moto
  function padLeadingZeros(num, size) {
    let s = `${num}`;
    while (s.length < size) s = `0${s}`;
    return s;
  }
  // Facture

  // Data
  const data = {
    nomClient: currentProduct.nom_client_1,
    telClient: currentProduct.tel_client_1,
    nomMoto: currentProduct.nom_moto,
    numMoteur: currentProduct.num_moteur,
    volumeMoteur: currentProduct.volume_moteur,
    numBL: `${padLeadingZeros(currentProduct.num_BL, 3)}/${moment(new Date()).format('MM-YYYY')}`,
    dateBL: currentProduct.date_BL,
    total: fNumber(currentProduct.PV)
  };

  return (
    <PDFViewer width="100%" height={height * 0.7}>
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
