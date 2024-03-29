import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NotesIcon from '@mui/icons-material/Notes';
import { useSnackbar } from 'notistack5';

// material

import { DataGrid, GridToolbar, frFR } from '@mui/x-data-grid';
import {
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
  ButtonGroup,
  Tooltip
} from '@material-ui/core';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import plusFill from '@iconify/icons-eva/plus-fill';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { darken, lighten } from '@mui/material/styles';

// utils
import { useRef, useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// components
import archiveFill from '@iconify/icons-eva/archive-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import pen from '@iconify/icons-eva/edit-2-outline';
import useAuth from '../../../hooks/useAuth';
import { deleteMoto, filterDisplay, getMotos, getMotosByDate, archiveMoto } from '../../../redux/slices/moto';
import useCheckMobile from '../../../hooks/useCheckMobile';

import { MIconButton } from '../../@material-extend';
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

const getBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5));

const setBgTableFiltre = (mode) => (mode === 'dark' ? '#333d48' : '#f4f6f8');

export default function AppMotoTable() {
  const motos = useSelector((state) => state.motos?.products);
  const [pageSize, setPageSize] = useState(10);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dataSelected, setDataSelected] = useState({ archive: false });
  const display = useSelector((state) => state.motos?.display);
  const loading = useSelector((state) => state.motos?.isLoading);
  const dispatch = useDispatch();
  const isMobile = useCheckMobile();
  const [openDialog, setOpenDialog] = useState(false);
  const [openArchiveDialog, setArchiveDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenArchiveDialog = () => {
    setArchiveDialog(true);
  };

  const handleCloseArchiveDialog = () => {
    setArchiveDialog(false);
  };

  async function deleteMotoFunc() {
    handleClose();
    dispatch(deleteMoto(selectedRow));
    setOpenDialog(false);
    handleCloseDialog();
    await enqueueSnackbar("L'enregistrement a été supprimé avec succès", {
      variant: 'success'
    });
  }

  async function archiveMotoFunc() {
    handleClose();
    dispatch(archiveMoto(selectedRow));
    setOpenDialog(false);
    handleCloseArchiveDialog();
    await enqueueSnackbar("L'enregistrement a été archivé avec succès", {
      variant: 'success'
    });
  }

  useEffect(() => {
    dispatch(getMotos());
  }, []);

  useEffect(() => {
    if (selectedRow) {
      const tempData = motos.filter((item) => Number(item.id) === Number(selectedRow));
      setDataSelected(tempData[0]);
      console.log(`selectedRow ${selectedRow}`);
      console.log(dataSelected);
    }
  }, [selectedRow]);

  const columns = [
    {
      field: 'ID_Moto',
      headerName: 'ID',
      minWidth: 50,
      flex: 0.7
    },
    {
      field: 'nom_moto',
      headerName: 'Modèle',
      minWidth: 180,
      flex: 2
    },
    {
      field: 'num_moteur',
      headerName: 'Num moteur',
      width: 200,
      flex: 2,
      hide: isMobile
    },
    {
      field: 'date_entree',
      headerName: "Date d'entrée",
      minWidth: 150,
      flex: 2,
      sortable: true,
      hide: isMobile,
      valueFormatter: (params) =>
        new Date(params?.value).toLocaleDateString('fr-fr', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
    },
    {
      field: 'date_arrivee',
      headerName: "Date d'arrivée",
      minWidth: 150,
      flex: 2,
      sortable: true,
      hide: true,
      valueFormatter: (params) =>
        new Date(params?.value).toLocaleDateString('fr-fr', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
    },
    {
      field: 'date_vente',
      headerName: 'Date de vente',
      minWidth: 150,
      flex: 2,
      sortable: true,
      hide: isMobile,
      valueFormatter: (params) =>
        params.value !== null
          ? new Date(params?.value).toLocaleDateString('fr-fr', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : '-'
    },
    {
      field: 'commercial',
      headerName: 'Commercial',
      width: 200,
      flex: 2,
      hide: isMobile
    },
    {
      field: 'localisation',
      headerName: 'Local',
      width: 200,
      flex: 2,
      hide: isMobile
    },

    {
      field: 'action',
      headerName: ' ',
      width: 80,
      align: 'right',
      sortable: false,
      disableColumnMenu: true,
      flex: 0.5,
      renderCell: (params) => (
        <MoreMenuButton
          id={params.id}
          handleClickOpenDialog={handleClickOpenDialog}
          user={user}
          setSelectedRow={setSelectedRow}
          handleClickOpenArchiveDialog={handleClickOpenArchiveDialog}
          dataSelected={params.row}
        />
      )
    }
  ];

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute('data-id')));
    setContextMenu(contextMenu === null ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 } : null);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const motosFiltre = useMemo(() => {
    switch (display) {
      default:
        return motos;
      case 1:
        return motos;
      case 2:
        return motos.filter((moto) => moto.num_BL !== null && moto.num_sur_facture === null);

      case 3:
        return motos.filter((moto) => moto.num_sur_facture !== null);

      case 4:
        return motos.filter((moto) => moto.num_BL === null && moto.num_sur_facture === null);
    }
  }, [display, motos]);

  return (
    <Card>
      <CardHeader
        title="Liste des motos"
        subheader={`Vous avez ${motos?.length} motos enregistrés`}
        action={
          <Tooltip title="Nouvelle entrée">
            <MIconButton color="primary" size="large" component={RouterLink} to={`${PATH_DASHBOARD.moto.root}/new`}>
              <Icon icon={plusFill} width={20} height={20} />
            </MIconButton>
          </Tooltip>
        }
      />
      <Box sx={{ p: 3, backgroundColor: (theme) => setBgTableFiltre(theme.palette.mode) }}>
        <FiltreDate motosFiltre={motosFiltre} />
      </Box>
      <Box
        sx={{
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
          },

          '& .super--Archived': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.success.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(theme.palette.success.lighter, theme.palette.mode)
            }
          }
        }}
      >
        <DataGrid
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 50]}
          pagination
          autoHeight
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          columns={columns}
          rows={motosFiltre}
          componentsProps={{
            row: {
              onContextMenu: handleContextMenu,
              style: { cursor: 'context-menu' }
            },
            toolbar: {
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 }
            }
          }}
          components={{
            Toolbar: GridToolbar
          }}
          getRowClassName={(params) => setColor(params)}
        />
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
          componentsProps={{
            root: {
              onContextMenu: (e) => {
                e.preventDefault();
                handleClose();
              }
            }
          }}
        >
          {!dataSelected.archive ? (
            <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.moto.root}/${selectedRow}/edit`}>
              <Icon icon={pen} width={20} height={20} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Editer
              </Typography>
            </MenuItem>
          ) : (
            <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.moto.root}/${selectedRow}/details`}>
              <Icon icon={NotesIcon} width={20} height={20} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Détails
              </Typography>
            </MenuItem>
          )}

          {user.role === 'manager' && (
            <>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleClickOpenArchiveDialog();
                }}
              >
                <Icon icon={archiveFill} width={20} height={20} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Archiver
                </Typography>
              </MenuItem>

              <Divider />

              <MenuItem
                sx={{ color: 'error.main' }}
                onClick={() => {
                  handleClose();
                  handleClickOpenDialog();
                }}
              >
                <Icon icon={trash2Outline} width={20} height={20} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Supprimer
                </Typography>
              </MenuItem>
            </>
          )}
        </Menu>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmer la suppression!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Voulez-vous vraiment supprimer cette enregistrement?</p>
              <p>Nom moto: {JSON.stringify(dataSelected?.nom_moto)}</p>
              <p>Num moteur: {JSON.stringify(dataSelected?.num_moteur)}</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deleteMotoFunc()}>Oui</Button>
            <Button onClick={handleCloseDialog} autoFocus>
              Non
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openArchiveDialog}
          onClose={handleCloseArchiveDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmer l'archivage!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Voulez-vous vraiment archiver cette enregistrement?</p>
              <p>Nom moto: {JSON.stringify(dataSelected?.nom_moto)}</p>
              <p>Num moteur: {JSON.stringify(dataSelected?.num_moteur)}</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => archiveMotoFunc()}>Oui</Button>
            <Button onClick={handleCloseArchiveDialog} autoFocus>
              Non
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
}

function MoreMenuButton({
  id,
  handleClickOpenDialog,
  user,
  setSelectedRow,
  handleClickOpenArchiveDialog,
  dataSelected
}) {
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
        {!dataSelected.archive ? (
          <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.moto.root}/${id}/edit`}>
            <Icon icon={pen} width={20} height={20} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Editer
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.moto.root}/${id}/details`}>
            <Icon icon={NotesIcon} width={20} height={20} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Détails
            </Typography>
          </MenuItem>
        )}

        {user.role === 'manager' && (
          <>
            <MenuItem
              onClick={() => {
                setSelectedRow(id);
                handleClose();
                handleClickOpenArchiveDialog();
              }}
            >
              <Icon icon={archiveFill} width={20} height={20} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Archiver
              </Typography>
            </MenuItem>

            <Divider />
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => {
                setSelectedRow(id);
                handleClose();
                handleClickOpenDialog();
              }}
            >
              <Icon icon={trash2Outline} width={20} height={20} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Supprimer
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}

function setColor(params) {
  let a;
  if (params.row.num_sur_facture !== null && params.row.archive === false) {
    a = 'super--Invoice';
  } else if (params.row.num_sur_facture === null && params.row.num_BL !== null && params.row.archive === false) {
    a = 'super--BL';
  } else if (params.row.archive) {
    a = 'super--Archived';
  }
  return a;
}

const FiltreDate = ({ motosFiltre }) => {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const dispatch = useDispatch();
  const display = useSelector((state) => state.motos?.display);

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
    dispatch(getMotosByDate(newDateDebut, newDateFin));
  }

  function CancelFilter() {
    setDateDebut(new Date());
    setDateFin(new Date());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack direction="column" alignItems="left" spacing={2}>
          <Box>
            <Typography variant="overline">Filtre par date de vente</Typography>
            <hr />
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={frLocale}
              localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <MobileDatePicker
                label="Date début"
                inputFormat="dd/MM/yyyy"
                openTo="month"
                views={['year', 'month', 'day']}
                disableFuture
                value={dateDebut}
                onChange={(newValue) => {
                  setDateDebut(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <MobileDatePicker
                label="Date fin"
                inputFormat="dd/MM/yyyy"
                openTo="month"
                views={['year', 'month', 'day']}
                disableFuture
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
              onClick={() => {
                CancelFilter();
                dispatch(getMotos());
              }}
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
        <Stack direction="column" spacing={2}>
          <Box>
            <Typography variant="overline">Affichage</Typography>
            <hr />
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Afficher</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={display}
                label="Afficher"
                onChange={(e) => dispatch(filterDisplay(e.target.value))}
              >
                <MenuItem value={1}>Tout</MenuItem>
                <MenuItem value={2}>Vendus avec BL</MenuItem>
                <MenuItem value={3}>Vendus avec facture</MenuItem>
                <MenuItem value={4}>Invendus</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subheader">{motosFiltre.length} résultats </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
