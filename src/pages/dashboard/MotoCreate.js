import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import MotoNewForm from '../../components/_dashboard/moto-app/MotoNewForm';
import MotoFacture from '../../components/_dashboard/moto-app/MotoFacture';
import MotoBL from '../../components/_dashboard/moto-app/MotoBL';
// ----------------------------------------------------------------------
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// Main
export default function MotoCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { products, currentData } = useSelector((state) => state.motos);
  const isEdit = pathname.includes('edit');
  const currentProduct = products?.find((product) => product.id === parseInt(id, 10)) || currentData.id;

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Edition">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Nouvelle entrée' : 'Editer le produit'}
          links={[
            { name: '', href: PATH_DASHBOARD.moto.root },
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.moto.root
            },
            { name: !isEdit ? 'New product' : currentProduct.ID_Moto }
          ]}
        />
        {isEdit ? (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Edition" {...a11yProps(0)} />
                <Tab label="Facture" {...a11yProps(1)} />
                <Tab label="BL" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <MotoNewForm isEdit={isEdit} currentProduct={currentProduct} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MotoFacture isEdit={isEdit} currentProduct={currentProduct} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MotoBL isEdit={isEdit} currentProduct={currentProduct} />
            </TabPanel>
          </Box>
        ) : (
          <MotoNewForm isEdit={isEdit} currentProduct={currentProduct} />
        )}
      </Container>
    </Page>
  );
}
