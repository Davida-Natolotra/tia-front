import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
// material
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';
import {
  Pagination,
  Menu,
  Divider,
  MenuItem,
  Typography,
  Card,
  CardHeader,
  Box,
  TextField,
  Button,
  Stack,
  Grid,
  ButtonGroup
} from '@material-ui/core';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { darken, lighten } from '@mui/material/styles';
// utils
import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// components
import archiveFill from '@iconify/icons-eva/archive-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import pen from '@iconify/icons-eva/edit-2-outline';
import { Filter } from '@material-ui/icons';
import { MIconButton } from '../../@material-extend';
import mockData from '../../../utils/mock-data';
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

const columns = [
  {
    field: 'ID_Moto',
    headerName: 'ID',
    width: 120,
    flex: 0.5
  },
  {
    field: 'nom_moto',
    headerName: 'Modèle',
    width: 200,
    flex: 1.5
  },
  {
    field: 'num_moteur',
    headerName: 'Num moteur',
    width: 200,
    flex: 1.5
  },

  {
    field: 'action',
    headerName: ' ',
    width: 80,
    align: 'right',
    sortable: false,
    disableColumnMenu: true,
    flex: 0.5,
    renderCell: (params) => <MoreMenuButton id={params.id} />
  }
];

const getBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5));

export default function AppMotoTable() {
  const [motos, setMotos] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [motosOr, setMotosOr] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMotosOr(data);
        return setMotos(data);
      })
      .catch((err) => console.log(err));
  }, []);

  function changeDisplay(display) {
    const allMotos = motosOr;
    let newData;
    switch (display) {
      default:
        newData = allMotos;
        setMotos(newData);
        break;
      case 1:
        newData = allMotos;
        setMotos(newData);
        break;
      case 2:
        newData = allMotos.filter((moto) => moto.num_BL !== null && moto.num_sur_facture === null);
        setMotos(newData);
        break;
      case 3:
        newData = allMotos.filter((moto) => moto.num_sur_facture !== null);
        setMotos(newData);
        break;
    }
  }
  return (
    <Card>
      <CardHeader title="Liste des motos" sx={{ mb: 2 }} />
      <Box sx={{ p: 3, backgroundColor: '#f4f6f8' }}>
        <FiltreDate changeDisplay={changeDisplay} motos={motos} setMotos={setMotos} motosOr={motosOr} />
      </Box>
      <Box
        sx={{
          height: 'auto',
          width: '100%',
          flexGrow: 1,
          '& .super--Invoice': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.info.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(theme.palette.info.lighter, theme.palette.mode)
            }
          },

          '& .super--BL': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(theme.palette.warning.lighter, theme.palette.mode)
            }
          }
        }}
      >
        <DataGrid
          checkboxSelection
          disableSelectionOnClick
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 50]}
          pagination
          autoHeight
          columns={columns}
          rows={motos}
          components={{
            Toolbar: GridToolbar
          }}
          getRowClassName={(params) => setColor(params)}
        />
      </Box>
    </Card>
  );
}

function MoreMenuButton({ id }) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <>
        <MIconButton ref={menuRef} size="large" onClick={handleOpen}>
          <Icon icon={moreVerticalFill} width={20} height={20} />
        </MIconButton>
      </>

      <Menu
        open={open}
        anchorEl={menuRef.current}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.eCommerce.root}/product/${id}/edit`}>
          <Icon icon={pen} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Editer
          </Typography>
        </MenuItem>

        <MenuItem>
          <Icon icon={archiveFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Archiver
          </Typography>
        </MenuItem>

        <Divider />
        <MenuItem sx={{ color: 'error.main' }}>
          <Icon icon={trash2Outline} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Supprimer
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

function setColor(params) {
  let a;
  if (params.row.num_sur_facture !== null) {
    a = 'super--Invoice';
  } else if (params.row.num_sur_facture === null && params.row.num_BL !== null) {
    a = 'super--BL';
  }
  return a;
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const FiltreDate = ({ changeDisplay, motos, setMotos, motosOr }) => {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [display, setDisplay] = useState(1);

  useEffect(() => {
    changeDisplay(display);
  }, [display]);

  function formatDate(date) {
    let today = new Date(date);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = String(today.getFullYear());
    today = `${yyyy}-${mm}-${dd}`;
    return today;
  }

  function Filter(dateDebut, dateFin) {
    const newDateDebut = formatDate(dateDebut);
    const newDateFin = formatDate(dateFin);
    axios({
      method: 'get',
      url: 'http://localhost:8000/api/motos',
      responseType: 'stream',
      params: {
        dateEntree: newDateDebut,
        dateFin: newDateFin
      }
    }).then((response) => setMotos(response.data));
  }

  function CancelFilter() {
    setDateDebut(new Date());
    setDateFin(new Date());
    setMotos(motosOr);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack direction="column" alignItems="left" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date début"
                inputFormat="dd/MM/yyyy"
                value={dateDebut}
                onChange={(newValue) => {
                  setDateDebut(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <MobileDatePicker
                label="Date fin"
                inputFormat="dd/MM/yyyy"
                value={dateFin}
                onChange={(newValue) => {
                  setDateFin(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Stack>
          <ButtonGroup>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => Filter(dateDebut, dateFin)}
              startIcon={<FilterAltIcon />}
              size="small"
            >
              Filtrer
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => CancelFilter()}
              sx={{ textTransform: 'none' }}
              startIcon={<CancelIcon />}
              size="small"
            >
              Annuler le filtre
            </Button>
          </ButtonGroup>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl>
            <InputLabel id="demo-simple-select-label">Afficher</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={display}
              label="Afficher"
              onChange={(e) => setDisplay(e.target.value)}
            >
              <MenuItem value={1}>Tout</MenuItem>
              <MenuItem value={2}>Vendus avec BL</MenuItem>
              <MenuItem value={3}>Vendus avec facture</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="subheader">{motos.length} résultats </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};
