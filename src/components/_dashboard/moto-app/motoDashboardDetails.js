import { useState, useEffect } from 'react';
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
import { Card, CardHeader, CardContent, Divider, TextField } from '@material-ui/core';
import startOfWeek from 'date-fns/startOfWeek';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getVenteToday, setChartSelect } from '../../../redux/slices/moto';

function createData(nomMoto, numMoteur, data) {
  return {
    nomMoto,
    numMoteur,
    data
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

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
                    <TableRow key={uuidv4()}>
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVenteToday());
  }, []);

  const venteToday = useSelector((state) => state.motos.venteToday);
  const rows = date.map((di, index) => createData(di, nb[index], data[index]));
  const rowsToday = venteToday?.data || [];

  const handleChangeSeriesData = (event) => {
    dispatch(setChartSelect(event.target.value));
  };

  const SELECT = [{ label: 'Hebdomadaire' }, { label: 'Mensuelle' }];
  return (
    <Card>
      <CardHeader
        title="Détails de vente"
        action={
          <TextField
            select
            fullWidth
            value={select}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
            }}
          >
            {SELECT.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </TextField>
        }
      />
      <CardContent>
        <Box>
          <Typography variant="overline" gutterBottom component="div">
            Vente d'aujourd'hui{' '}
            {new Date().toLocaleDateString('fr-fr', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}{' '}
            - {venteToday.data?.length || 0} vente{venteToday.data?.length > 1 ? 's' : ''}
          </Typography>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell>Nom moto</TableCell>
                <TableCell>Num moteur</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsToday.map((historyRow) => (
                <TableRow key={uuidv4()}>
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
        <Box sx={{ mt: 3 }}>
          <Divider />
          <Typography variant="overline" gutterBottom component="div">
            Vente {select} - {select === 'Hebdomadaire' ? 'semaine du' : 'mois de'}{' '}
            {select === 'Hebdomadaire'
              ? new Date(startOfWeek(new Date(), { weekStartsOn: 1 })).toLocaleDateString('fr-fr', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : date[0].split(' ')[1]}
          </Typography>
        </Box>
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
