import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    fontSize: 9,
    padding: 0
  },
  responsable: {
    width: '50%',
    textAlign: 'center'
  },
  client: {
    width: '50%',
    textAlign: 'center'
  }
});
const index = () => (
  <View style={styles.row}>
    <Text style={styles.responsable}>Le vendeur</Text>
    <Text style={styles.client}>Le client</Text>
  </View>
);

export default index;
