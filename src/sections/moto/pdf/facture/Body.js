import { Font, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import Logo from './LogoTIA.jpeg';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceTableRow from './InvoiceTableRow';
import InvoiceTableFooter from './InvoiceTableFooter';
import RecFoot from './recfoot';
import Signature from './signature';
import Footer from './footer';

// Local font imports — place the corresponding TTF files in the ./fonts/ directory.
// Download links:
//   Hermit Bold      → https://pcaro.es/hermit/ (Hermit-Bold.otf → rename to .ttf or convert)
//   Century Gothic   → search "CenturyGothic.ttf" (Monotype / free-for-personal-use copies)
//   Nexa Rust        → https://www.fontfabric.com/fonts/nexa-rust/
//   Glober SemiBold  → https://www.fontfabric.com/fonts/glober/
import HermitBoldFont from './fonts/Hermit-Bold.ttf';
import CenturyGothicFont from './fonts/CenturyGothic.ttf';
import NexaRustFont from './fonts/NexaRustHandmade-Extended.ttf';
import GloberSemiFont from './fonts/GloberSemiBold.ttf';

export default function FactureMoto({ data }) {
  const bodyInvoice = [
    { sno: 1, ref: data.ref, desc: data.nomMoto, PU: data.PUHT, TVA: data.TVA },
    { sno: 2, ref: ' ', desc: data.numMoteur, PU: ' ', TVA: ' ' },
    { sno: 3, ref: ' ', desc: data.volumeMoteur, PU: ' ', TVA: ' ' }
  ];
  const dateFacture = new Date(data.dateFacture).toLocaleDateString('fr-fr', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  return (
    <View style={styles.page}>
      <Image style={styles.logo} src={Logo} fixed />
      <Text style={styles.headingTitle}>TIA MOTO SARLU</Text>
      <Text style={styles.heading}>Ny Tsara Indrindra hAtrany</Text>
      <Text style={styles.heading}>Siège social: Lot IVX 72B Bis Ankazomanga</Text>
      <Text style={styles.heading}>Vente de scooter occasion et accessoires</Text>
      <Text style={styles.heading}>Tél: 0330393155</Text>
      <Text style={styles.heading}>NIF: 2004105069</Text>
      <Text style={styles.heading}>Stat: 46101112020010758</Text>
      <Text style={styles.heading}>RCS: 2020 B 00714</Text>
      <View style={styles.container}>
        <Text style={styles.title}>FACTURE</Text>
      </View>
      <View style={styles.subContainer}>
        <View style={styles.titleLeft}>
          <Text style={styles.info}>Facturé à :</Text>
          <Text style={styles.info}>{data.nomClient}</Text>
          <Text style={styles.info}>CIN: {data.CIN}</Text>
          <Text style={styles.info}>Tel: {data.telClient}</Text>
          <Text style={styles.info}>Adresse: {data.adresseClient}</Text>
        </View>
        <View style={styles.titleRight}>
          <Text style={styles.info}>FACTURE N° :{data.numFacture}</Text>
          <Text style={styles.info}>DATE {dateFacture}</Text>
        </View>
      </View>
      <View style={styles.subContainer2}>
        <InvoiceTableHeader />
        <InvoiceTableRow items={bodyInvoice} />
        <InvoiceTableFooter total={data.total} title="TOTAL" />
      </View>
      <View style={styles.chiffre}>
        <RecFoot totalLettre={data.totalLettre} />
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

// ─── Google Fonts CDN (CORS-safe, always available) ───────────────────────────
Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v57/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvgUE.ttf'
});

Font.register({
  family: 'Noto-Sans',
  src: 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf'
});

Font.register({
  family: 'Noto-Sans-Bold',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-NotoSans-Bold.ttf'
});

// ─── Locally bundled fonts (place TTF files in ./fonts/) ──────────────────────
Font.register({
  family: 'Hermit',
  src: HermitBoldFont
});

Font.register({
  family: 'Century-Gothic',
  src: CenturyGothicFont
});

Font.register({
  family: 'Nexa-Rust',
  src: NexaRustFont
});

Font.register({
  family: 'Glober-Semi',
  src: GloberSemiFont
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
    fontFamily: 'Glober-Semi'
  },
  heading: {
    fontSize: 8,
    marginLeft: 110,
    fontFamily: 'Noto-Sans',
    textAlign: 'right'
  },
  headingTitle: {
    fontSize: 12,
    marginLeft: 110,
    fontFamily: 'Noto-Sans',
    textAlign: 'right'
  },

  subtitle: {
    fontSize: 14,
    marginLeft: 300,
    fontFamily: 'Noto-Sans'
  },
  date: {
    fontSize: 9,
    marginLeft: 300,
    marginBottom: 20
  },
  info: {
    fontSize: 8,
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
    left: 30,
    top: 20,
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
    flexGrow: 1,
    position: 'relative',
    marginTop: 5
  },
  subContainer2: {
    flexDirection: 'column',
    marginTop: 10
  },

  titleLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left',
    flexGrow: 1,
    fontSize: 10
  },
  titleRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flexGrow: 1,
    fontSize: 10
  },
  chiffre: {
    flexDirection: 'column',
    marginTop: 20
  },
  signature: {
    flexDirection: 'column',
    marginTop: 10
  },
  footer: {
    flexDirection: 'column',
    marginTop: 45
  }
});
