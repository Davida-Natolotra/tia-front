import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import { useSelector } from 'react-redux';

import { styles } from './styles';

function createData(nomMoto, numMoteur, data) {
  return {
    nomMoto,
    numMoteur,
    data
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.nomMoto}
        </TableCell>
        <TableCell align="right">{row.numMoteur}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Liste
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom moto</TableCell>
                    <TableCell>Num moteur</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.data.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.nom_moto}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.num_moteur}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired
//       })
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired
//   }).isRequired
// };

export default function CollapsibleTable() {
  const select = useSelector((state) => state.motos.chartSelect);
  const dataH = useSelector((state) => state.motos.motosHebdo.data);
  const dateH = useSelector((state) => state.motos.motosHebdo.date);
  const nbH = useSelector((state) => state.motos.motosHebdo.nb);
  const dataM = useSelector((state) => state.motos.motosMonth.data);
  const dateM = useSelector((state) => state.motos.motosMonth.date);
  const nbM = useSelector((state) => state.motos.motosMonth.nb);
  let data;
  let date;
  let nb;
  if (select === 'Hebdomadaire') {
    data = dataH;
    date = dateH;
    nb = nbH;
  } else {
    data = dataM;
    date = dateM;
    nb = nbM;
  }
  const rows = date.map((di, index) => createData(di, nb[index], data[index]));
  //   () => {
  //   const globRow = [];
  //   // eslint-disable-next-line no-plusplus
  //   for (let i = 0; i < data.length(); i++) {
  //     globRow.push(
  //       createData(
  //         date[i],
  //         nb[i].reduce((partialSum, a) => partialSum + a, 0)
  //       )
  //     );
  //   }
  //   return globRow;
  // };

  return (
    <Card>
      <CardHeader title="Détails de vente" />
      <CardContent>
        <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
          <Table aria-label="collapsible table" stickyHeader sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Date</TableCell>
                <TableCell align="right">Nombre de vente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
