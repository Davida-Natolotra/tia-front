import React from 'react';
import { View, Text, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Noto-Sans',
  src: 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf'
});

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    height: 24,
    fontSize: 9,
    fontFamily: 'Noto-Sans',
    color: '#929292',
    bottom: 10
  },
  email: {
    textAlign: 'center'
  },
  contact: {
    textAlign: 'center'
  }
});
const index = () => (
  <View style={styles.row}>
    <Text style={styles.email}>Les marchandises vendues ne sont ni reprises ni échangées.</Text>
    <Text style={styles.contact}>Scooter vendu dans l'état sans aucune garantie.</Text>
  </View>
);

export default index;
