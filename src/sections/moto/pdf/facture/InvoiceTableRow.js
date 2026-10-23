import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import RobotoBold from './fonts/Roboto-Bold.ttf';

const borderColor = 'black';

Font.register({
  family: 'Roboto-Bold',
  src: RobotoBold
});

// The item is one table row: each cell stacks the item's lines (name, engine
// number, volume), so every column border is drawn once, top to bottom.
// Column widths and borders match InvoiceTableHeader and InvoiceTableFooter.
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderColor,
    borderBottomWidth: 1,
    fontSize: 9
  },
  qty: {
    width: '10%',
    borderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8
  },
  description: {
    width: '40%',
    borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8
  },
  rate: {
    width: '25%',
    borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8
  },
  amount: {
    width: '25%',
    borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8
  },
  line: {
    minHeight: 16
  },
  lineBold: {
    minHeight: 16,
    fontFamily: 'Roboto-Bold'
  }
});

const InvoiceTableRow = ({ items }) => {
  const column = (style, field) => (
    <View style={style}>
      {items.map((item) => (
        <Text key={item.sno} style={item.sno === 3 ? styles.lineBold : styles.line}>
          {item[field]}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.row}>
      {column(styles.qty, 'ref')}
      {column(styles.description, 'desc')}
      {column(styles.rate, 'PU')}
      {column(styles.amount, 'TVA')}
    </View>
  );
};

export default InvoiceTableRow;
