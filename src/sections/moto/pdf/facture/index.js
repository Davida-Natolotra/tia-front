import React from 'react';
import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import QRCode from 'qrcode';
import { getNumberWord } from '../../../../redux/slices/moto';
import Body from './Body';
import { fNumber } from '../../../../utils/formatNumber';
import { factureUrl } from '../../../../utils/factureUrl';

export default function FactureMoto({ currentProduct, isEdit }) {
  const [height, setHeight] = React.useState(window.innerHeight);
  const updateWidthAndHeight = () => {
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  });
  // QR code to the invoice's public page; the backend gives the token once the invoice is saved
  const token = currentProduct.facture_token;
  const [qrCode, setQrCode] = React.useState(null);
  React.useEffect(() => {
    let active = true;
    setQrCode(null);
    if (token) {
      QRCode.toDataURL(factureUrl(token), { margin: 0, width: 240, errorCorrectionLevel: 'M' })
        .then((dataUrl) => active && setQrCode(dataUrl))
        .catch((error) => console.error(error));
    }
    return () => {
      active = false;
    };
  }, [token]);
  // Models
  function padLeadingZeros(num, size) {
    let s = `${num}`;
    while (s.length < size) s = `0${s}`;
    return s;
  }
  // Data
  const data = {
    nomClient: currentProduct.nom_client_2,
    adresseClient: currentProduct.adresse_client_2,
    telClient: currentProduct.tel_client_2,
    CIN: currentProduct.CIN_Num_Client_2,
    nomMoto: currentProduct.nom_moto,
    numMoteur: currentProduct.num_moteur,
    volumeMoteur: currentProduct.volume_moteur,
    // Blank until the invoice is numbered
    numFacture:
      currentProduct.num_sur_facture == null || currentProduct.num_sur_facture === ''
        ? ''
        : `${padLeadingZeros(currentProduct.num_sur_facture, 3)}/${moment(new Date()).format('MM-YYYY')}`,
    dateFacture: currentProduct.date_facture,
    PUHT: fNumber(currentProduct.PU_HT),
    TVA: fNumber(currentProduct.TVA),
    total: fNumber(currentProduct.PV),
    totalLettre: useSelector((state) => state.motos.numWord),
    ref: currentProduct.Ref,
    qrCode
  };
  const dispatch = useDispatch();
  // The words are shared app state: always fetch them for this moto's price, so an
  // invoice never shows the amount of the moto viewed before it.
  React.useEffect(() => {
    dispatch(getNumberWord(currentProduct.PV));
  }, [dispatch, currentProduct.PV]);

  return (
    <PDFViewer width="100%" height={height * 0.7}>
      <Document>
        <Page style={styles.body} size={isEdit ? 'A4' : 'A5'} orientation={isEdit ? 'landscape' : 'portrait'}>
          {isEdit && (
            <>
              <Body data={data} />
              <View style={styles.marg}>
                <Text> </Text>
              </View>
            </>
          )}
          <Body data={data} />
        </Page>
      </Document>
    </PDFViewer>
  );
}

export const FootRow = ({ totalLettre }) => (
  <View style={styles.row}>
    <Text style={styles.chiffre}>{totalLettre ? totalLettre.toUpperCase() : ''} ARIARY</Text>
  </View>
);

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    paddingTop: 20,
    // Small bottom margin: the invoice (with its QR code) must fit on a single page
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  element: {
    width: '50%',
    marginRight: 30
  },
  element2: {
    width: '50%',
    marginLeft: 30
  },
  marg: {
    marginLeft: 20,
    marginRight: 20
  }
});
