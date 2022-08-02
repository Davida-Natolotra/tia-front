import { PDFViewer, Page, Image, Text, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import React from 'react';
import Logo from './LogoTIA.jpeg';

export default function FactureMoto({ value }) {
  const [height, setHeight] = React.useState(window.innerHeight);
  const updateWidthAndHeight = () => {
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  });

  const anarana = 'RAKOTOARISOA Vonjy';
  const contact = '034 00 234 12';
  const location = '25/12/2021';
  return (
    <PDFViewer width="100%" height={height * 0.6}>
      <Document>
        <Page style={styles.body} size="A4">
          <View style={styles.page}>
            <Image style={styles.sidebar} src={Logo} fixed />
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
                <Text>FACTURE N° :</Text>
                <Text>DATE </Text>
              </View>
              <View style={styles.titleRight}>
                <Text>FACTURE N° :</Text>
                <Text>DATE </Text>
              </View>
            </View>

            <Text style={styles.info}>NOM: {anarana}</Text>
            <Text style={styles.info}>CONTACT: {contact}</Text>
            <Text style={styles.info}>LOCATION du {location}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
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

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  heading: {
    fontSize: 12,
    marginLeft: 100,
    fontFamily: 'Noto-Sans',
    textAlign: 'right'
  },
  headingTitle: {
    fontSize: 20,
    marginLeft: 100,
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
    fontSize: 9,
    marginLeft: 170,
    letterSpacing: 1,
    lineHeight: 1.8
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
  sidebar: {
    left: 20,
    top: 20,
    // // transformOrigin: "60% 60% 0px",
    width: '160px',
    height: '150px',
    position: 'absolute',
    zIndex: 1
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
  footer: {
    position: 'absolute',
    fontSize: 11,
    bottom: 30,
    left: 170,
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 30
  },
  subContainer: {
    flexDirection: 'row',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 3,
    marginBottom: 5
  },
  titleLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 24,
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
    height: 24,
    textAlign: 'left',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 10,
    letterSpacing: 3
  }
});
