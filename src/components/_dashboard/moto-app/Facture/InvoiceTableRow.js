import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const borderColor = 'black';
Font.register({
  family: 'Noto-Sans',
  src: 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf'
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
      fontFamily: 'Noto-Sans',
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
