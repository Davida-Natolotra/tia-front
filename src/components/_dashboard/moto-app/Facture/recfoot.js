import React from 'react';
import { View, StyleSheet, Text } from '@react-pdf/renderer';

const borderColor = 'black';
const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e6e6e0',
    marginLeft: 140
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    fontSize: 9,
    letterSpacing: 3,
    backgroundColor: '#e6e6e0'
  },
  description: {
    width: '100%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    marginLeft: 10
  },
  row: {
    flexDirection: 'row',
    borderColor,
    borderWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 8,
    padding: 0
  },
  label: {
    width: '25%',
    textAlign: 'left',
    fontSize: 7,
    paddingLeft: 8
  },
  chiffre: {
    width: '100%',
    textAlign: 'center',
    paddingRight: 8,
    fontSize: 9
  }
});

const FootRow = ({ totalLettre }) => (
  <View style={styles.row}>
    <Text style={styles.chiffre}>{totalLettre.toUpperCase()} ARIARY</Text>
  </View>
);

export default FootRow;
