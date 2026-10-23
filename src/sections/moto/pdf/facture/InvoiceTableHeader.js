import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import RobotoBold from './fonts/Roboto-Bold.ttf';

const borderColor = 'black';
Font.register({
  family: 'Roboto-Bold',
  src: RobotoBold
});

// Column widths and borders match InvoiceTableRow and InvoiceTableFooter.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 24,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    fontSize: 9
  },
  qty: {
    width: '10%',
    paddingTop: 4,
    borderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  description: {
    width: '40%',
    paddingTop: 4,
    borderColor,
    borderRightWidth: 1
  },
  rate: {
    width: '25%',
    paddingTop: 4,
    borderColor,
    borderRightWidth: 1
  },
  amount: {
    width: '25%',
    paddingTop: 4,
    borderColor,
    borderRightWidth: 1
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
