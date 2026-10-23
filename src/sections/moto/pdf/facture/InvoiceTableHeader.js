import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import RobotoBold from './fonts/Roboto-Bold.ttf';

const borderColor = 'black';
Font.register({
  family: 'Roboto-Bold',
  src: RobotoBold
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    flexGrow: 1,
    fontSize: 9
  },
  description: {
    width: '40%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  rate: {
    width: '25%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  amount: {
    width: '25%'
  }
});

const InvoiceTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.qty}>Ref</Text>
    <Text style={styles.description}>Désignation</Text>

    <Text style={styles.rate}>PU HT</Text>
    <Text style={styles.amount}>TVA</Text>
  </View>
);

export default InvoiceTableHeader;
