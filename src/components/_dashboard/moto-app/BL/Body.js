import { Text, StyleSheet, Font, View } from '@react-pdf/renderer';
import React from 'react';

import Signature from './signature';
import Footer from './footer';

export default function FactureMoto({ data }) {
  const dateBL = new Date(data.dateBL).toLocaleDateString('fr-fr', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  return (
    <View style={styles.page}>
      <Text style={styles.headingTitle}>TIA MOTO SARLU</Text>
      <Text style={styles.heading}>Ny Tsara Indrindra hAtrany</Text>
      <Text style={styles.heading}>Siège social: Lot IVX 72B Bis Ankazomanga</Text>
      <Text style={styles.heading}>Vente de scooter occasion et accessoires</Text>
      <Text style={styles.heading}>Tél: 0330393155</Text>
      <Text style={styles.heading}>NIF: 2004105069</Text>
      <Text style={styles.heading}>Stat: 46101112020010758</Text>
      <Text style={styles.heading}>RCS: 2020 B 00714</Text>
      <View style={styles.container}>
        <Text style={styles.title}>BON DE LIVRAISON</Text>
      </View>
      <View style={styles.subContainer}>
        <View style={styles.titleLeft}>
          <Text style={styles.info}>Livré à :</Text>
          <Text style={styles.info}>{data.nomClient}</Text>
          <Text style={styles.info}>Tel: {data.telClient}</Text>
        </View>
        <View style={styles.titleRight}>
          <Text style={styles.info}>N° :{data.numBL}</Text>
          <Text style={styles.info}>DATE {dateBL}</Text>
        </View>
      </View>
      <View style={styles.subContainer2}>
        <Text>
          <Text style={styles.boldUnderlineText}>Modèle:</Text> {data.nomMoto}
        </Text>
        <Text>
          <Text style={styles.boldUnderlineText}>Numéro moteur:</Text> {data.numMoteur}
        </Text>
        <Text>
          <Text style={styles.boldUnderlineText}>Prix:</Text> {data.total} Ar
        </Text>
      </View>

      <View style={styles.signature}>
        <Signature />
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
}

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});
Font.register({
  family: 'Hermit',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-Hermit-Bold-4.ttf'
});
Font.register({
  family: 'Century-Gothic',
  src: 'https://fontsfree.net//wp-content/fonts/fancy/eroded/FontsFree-Net-nu_century_gothic.ttf'
});
Font.register({
  family: 'Nexa-Rust',
  src: 'https://fontsfree.net//wp-content/fonts/basic/various-basic/FontsFree-Net-NexaRustHandmade-Extended.ttf'
});
Font.register({
  family: 'Noto-Sans',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-NotoSans-Bold.ttf'
});
Font.register({
  family: 'Glober-Semi',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-Glober-SemiBold-Free.ttf'
});
Font.register({
  family: 'Noto-Sans-Bold',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-NotoSans-Bold.ttf'
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Noto-Sans-Bold'
  },
  heading: {
    fontSize: 8,

    fontFamily: 'Noto-Sans',
    textAlign: 'right'
  },
  headingTitle: {
    fontSize: 12,

    fontFamily: 'Noto-Sans',
    textAlign: 'right'
  },

  subtitle: {
    fontSize: 14,
    marginLeft: 300,
    fontFamily: 'Noto-Sans',
    letterSpacing: 3
  },
  date: {
    fontSize: 9,
    marginLeft: 300,
    marginBottom: 20,
    letterSpacing: 3
  },
  info: {
    fontSize: 8,
    letterSpacing: 0,
    lineHeight: 1.5
  },
  text: {
    margin: 12,
    marginLeft: 170,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100
  },
  logo: {
    left: 20,
    top: 20,
    // transformOrigin: "60% 60% 0px",
    width: '105px',
    height: '100px',
    position: 'absolute',
    marginRight: 20
  },
  background: {
    position: 'absolute',
    opacity: 0.05,
    top: 400,
    left: 200,
    width: '80%',
    height: 'auto',
    zIndex: -2
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  },
  page: {
    fontSize: 9,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    lineHeight: 1.5,
    flexDirection: 'column'
  },
  container: {
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  subContainer2: {
    flexDirection: 'column',
    marginTop: 2
  },

  titleLeft: {
    flexDirection: 'column',
    justifyContent: 'flex-start',

    textAlign: 'left',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 10,
    letterSpacing: 3
  },
  titleRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flexGrow: 1,
    fontSize: 10,
    letterSpacing: 1
  },

  signature: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 150
  },
  footer: {
    flexDirection: 'column'
  },
  coreText: {
    flexDirection: 'column',
    textAlign: 'left',
    flexGrow: 1,
    fontSize: 10,
    letterSpacing: 1
  },
  boldUnderlineText: {
    fontFamily: 'Noto-Sans-Bold',
    textDecoration: 'underline'
  }
});
