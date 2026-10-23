import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = 'black';
// Column widths match InvoiceTableHeader and InvoiceTableRow. The TOTAL box
// hangs under the PU HT and TVA columns; its left edge is the Désignation
// column border, so it lines up with the table above.
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 24,
    fontSize: 9
  },
  qty: {
    width: '10%'
  },
  description: {
    width: '40%',
    borderColor,
    borderRightWidth: 1
  },
  rate: {
    width: '25%',
    borderColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    textAlign: 'right',
    paddingTop: 4,
    paddingRight: 8
  },
  amount: {
    width: '25%',
    borderColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    textAlign: 'right',
    paddingTop: 4,
    paddingRight: 8
  }
});

const InvoiceTableFooter = ({ total }) => {
  const vide = ' ';
  return (
    <View style={styles.row}>
      <Text style={styles.qty}>{vide}</Text>
      <Text style={styles.description}>{vide} </Text>
      <Text style={styles.rate}>TOTAL</Text>
      <Text style={styles.amount}>{total}</Text>
    </View>
  );
};

export default InvoiceTableFooter;
