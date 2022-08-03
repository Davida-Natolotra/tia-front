import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const borderColor = 'black';
Font.register({
  family: 'Noto-Sans-Bold',
  src: 'https://fontsfree.net//wp-content/fonts/basic/sans-serif/FontsFree-Net-NotoSans-Bold.ttf'
});

const InvoiceTableRow = ({ items }) => {
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      borderColor,
      borderWidth: 1,
      borderTopColor: 'white',
      borderBottomColor: 'white',
      alignItems: 'center',
      height: 16,
      fontStyle: 'bold',
      fontSize: 9,
      padding: 0,
      margin: 0
    },
    rowBold: {
      flexDirection: 'row',
      borderColor,
      borderWidth: 1,
      borderTopColor: 'white',
      borderBottomColor: 'white',
      alignItems: 'center',
      height: 16,
      fontSize: 9,
      fontFamily: 'Noto-Sans-Bold',
      padding: 0,
      margin: 0
    },
    description: {
      width: '40%',
      textAlign: 'left',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      paddingLeft: 8
    },
    description2: {
      width: '40%',
      textAlign: 'left',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      paddingLeft: 8
    },
    qty: {
      width: '10%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      textAlign: 'right',
      paddingRight: 8
    },
    rate: {
      width: '25%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      textAlign: 'right',
      paddingRight: 8
    },
    amount: {
      width: '25%',
      textAlign: 'right',
      paddingRight: 8
    }
  });
  const rows = items.map((item) => (
    <View style={item.sno === 3 ? styles.rowBold : styles.row} key={item.sno}>
      <Text style={styles.qty}>{item.ref}</Text>
      <Text style={styles.description2}>{item.desc}</Text>
      <Text style={styles.rate}>{item.PU}</Text>
      <Text style={styles.amount}>{item.TVA}</Text>
    </View>
  ));
  return <>{rows}</>;
};

export default InvoiceTableRow;
