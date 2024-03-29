import React from 'react';
import { PDFViewer, Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { getNumberWord } from '../../../../redux/slices/moto';
import Body from './Body';
import { fNumber } from '../../../../utils/formatNumber';

export default function FactureMoto({ currentProduct, isEdit }) {
  const [height, setHeight] = React.useState(window.innerHeight);
  const updateWidthAndHeight = () => {
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  });
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
    numFacture: `${padLeadingZeros(currentProduct.num_sur_facture, 3)}/${moment(new Date()).format('MM-YYYY')}`,
    dateFacture: currentProduct.date_facture,
    PUHT: fNumber(currentProduct.PU_HT),
    TVA: fNumber(currentProduct.TVA),
    total: fNumber(currentProduct.PV),
    totalLettre: useSelector((state) => state.motos.numWord),
    ref: currentProduct.Ref
  };
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!data.totalLettre) {
      dispatch(getNumberWord(currentProduct.PV));
    }
  }, []);

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
  },
  marg: {
    marginLeft: 20,
    marginRight: 20
  }
});
