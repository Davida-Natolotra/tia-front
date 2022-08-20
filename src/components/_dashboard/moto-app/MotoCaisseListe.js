import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack5';
// material
import { IconButton } from '@mui/material';
import { DataGrid, GridToolbar, frFR } from '@mui/x-data-grid';
import { Menu, Divider, MenuItem, Typography, Card, CardHeader, Box, Button, Tooltip } from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
// utils
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// components
import archiveFill from '@iconify/icons-eva/archive-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import pen from '@iconify/icons-eva/edit-2-outline';
import { MIconButton } from '../../@material-extend';
import { fNumber } from '../../../utils/formatNumber';
import { getCaisseListe, deleteCaisse, setCaisse, setEdit, setShow } from '../../../redux/slices/caisse';
import { getVentes } from '../../../redux/slices/moto';
import useCheckMobile from '../../../hooks/useCheckMobile';

// ----------------------------------------------------------------------

export default function CaisseListe() {
  const caisses = useSelector((state) => state.caisseMoto.caisses);
  const ventesMoto = useSelector((state) => state.motos.ventes);
  const [pageSize, setPageSize] = useState(10);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedRow, setSelectedRow] = useState();

  const dispatch = useDispatch();
  const isMobile = useCheckMobile();
  const [openDialog, setOpenDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = (id) => {
    dispatch(setEdit(true));
    dispatch(setShow(true));
    const caisse = caisses.find((c) => c.id === id);
    dispatch(setCaisse(caisse));
  };

  async function deleteMotoFunc() {
    handleClose();
    dispatch(deleteCaisse(selectedRow));
    setOpenDialog(false);
    handleCloseDialog();
    await enqueueSnackbar("L'enregistrement a été supprimer avec succès", {
      variant: 'success'
    });
  }

  useEffect(() => {
    dispatch(getCaisseListe());
    dispatch(getVentes());
  }, []);

  const columns = [
    {
      field: 'libellee',
      headerName: 'Libellée',
      minWidth: 300,
      flex: 2
    },

    {
      field: 'date',
      headerName: 'Date',
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
      field: 'depense',
      headerName: 'Dépense [Ar]',
      width: 200,
      flex: 2,
      hide: isMobile,
      valueFormatter: (params) => fNumber(params.value)
    },
    {
      field: 'recette',
      headerName: 'Recette [Ar]',
      width: 200,
      flex: 2,
      hide: isMobile,
      valueFormatter: (params) => fNumber(params.value)
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
          handleEdit={handleEdit}
          setSelectedRow={setSelectedRow}
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

  const handleNew = () => {
    dispatch(setEdit(false));
    dispatch(setShow(true));
  };

  return (
    <Card>
      <CardHeader
        title="Table de récapitulation"
        subheader={`Vous avez ${caisses?.length} enregistrements`}
        action={
          <Tooltip title="Nouvelle entrée">
            <MIconButton color="primary" size="large" onClick={handleNew}>
              <Icon icon={plusFill} width={20} height={20} />
            </MIconButton>
          </Tooltip>
        }
      />

      <Box
        sx={{
          width: '100%',
          flexGrow: 1
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
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          columns={columns}
          rows={caisses}
          componentsProps={{
            row: {
              onContextMenu: handleContextMenu,
              style: { cursor: 'context-menu' }
            },
            toolbar: { printOptions: { disableToolbarButton: true } }
          }}
          components={{
            Toolbar: GridToolbar
          }}
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
          <MenuItem
            onClick={() => {
              handleClose();
              return handleEdit(selectedRow);
            }}
          >
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
              Voulez-vous vraiment supprimer cette enregistrement?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deleteMotoFunc()}>Oui</Button>
            <Button onClick={handleCloseDialog} autoFocus>
              Non
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
}

function MoreMenuButton({ id, handleClickOpenDialog, handleEdit, setSelectedRow }) {
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
      <IconButton ref={menuRef} size="large" onClick={handleOpen}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

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
        <MenuItem
          onClick={() => {
            handleClose();
            return handleEdit(id);
          }}
        >
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
      </Menu>
    </>
  );
}
