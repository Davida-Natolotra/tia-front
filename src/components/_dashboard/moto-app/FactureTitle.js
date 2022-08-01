import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    flexGrow: 1,
    fontSize: 9,
    letterSpacing: 3
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

const InvoiceTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.title}>FACTURE</Text>
  </View>
);

export default InvoiceTableHeader;
