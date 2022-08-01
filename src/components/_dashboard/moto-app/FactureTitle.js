import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 9,
    letterSpacing: 3
  },
  title: {
    fontSize: 30,
    fontFamily: 'Noto-Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20
  }
});

const InvoiceTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.title}>FACTURE</Text>
  </View>
);

export default InvoiceTableHeader;
