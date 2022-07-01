import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {
  DataGrid,
  GridToolbar,
  useGridSlotComponentProps,
  getGridNumericColumnOperators
} from '@material-ui/data-grid';
import { Pagination, Menu, Divider, MenuItem, Typography } from '@material-ui/core';

// utils
import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// components
import shareFill from '@iconify/icons-eva/share-fill';
import printerFill from '@iconify/icons-eva/printer-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import pen from '@iconify/icons-eva/edit-2-outline';
import { MIconButton } from '../../@material-extend';
import mockData from '../../../utils/mock-data';
import dataMotos from '../../../_apis_/motos.json';
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

const columns = [
  {
    field: 'ID_Moto',
    headerName: 'ID',
    width: 120
  },
  {
    field: 'nom_moto',
    headerName: 'Modèle',
    width: 160,
    editable: true
  },
  {
    field: 'num_moteur',
    headerName: 'Num moteur',
    width: 160,
    editable: true
  },

  {
    field: 'action',
    headerName: ' ',
    width: 80,
    align: 'right',
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      // <MIconButton>
      //   <Box component={Icon} icon={moreVerticalFill} sx={{ width: 20, height: 20 }} />
      // </MIconButton>
      <MoreMenuButton id={params.id} />
    )
  }
];

const rows = [...Array(30)].map((_, index) => ({
  id: mockData.id(index),
  lastName: mockData.name.lastName(index),
  firstName: mockData.name.firstName(index),
  age: mockData.number.age(index)
}));

export default function AppMotoTable() {
  const [motos, setMotos] = useState([]);
  useEffect(() => {
    fetch('../../../_apis_/motos.json', {
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`data: ${data}`);
        return setMotos(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <DataGrid
      checkboxSelection
      disableSelectionOnClick
      columns={columns}
      rows={rows}
      autoHeight
      componentsProps={{
        row: {
          style: { cursor: 'context-menu', backgroundColor: 'red' }
        }
      }}
      components={{
        Toolbar: GridToolbar
      }}
    />
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
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.eCommerce.root}/product/${id}/edit`}
          sx={{ color: 'text.secondary' }}
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

const onEdit = (id) => {
  console.log(`edit ${id}`);
};

function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
