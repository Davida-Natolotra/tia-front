import React from 'react';
import { View, Text, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Noto-Sans-Bold',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-NotoSans-Bold.ttf'
});

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    height: 24,
    fontSize: 9,
    fontFamily: 'Noto-Sans-Bold',
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
