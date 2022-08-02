import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = 'black';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',

    borderWidth: 1,
    borderTopColor: borderColor,
    borderBottomColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    fontSize: 9,
    padding: 0,
    margin: 0
  },
  description: {
    width: '40%',
    textAlign: 'left',
    borderColor: 'white',
    paddingLeft: 8,
    borderLeftColor: 'white',
    borderRightColor: 'white'
  },
  qty: {
    width: '10%',
    borderRightColor: 'white',
    textAlign: 'right',
    paddingRight: 8
  },
  rate: {
    width: '25%',
    borderColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    textAlign: 'right',
    paddingRight: 8
  },
  amount: {
    width: '25%',
    textAlign: 'right',
    paddingRight: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1
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
