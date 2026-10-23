import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// material
import { Box, Container, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMotos } from '../../redux/slices/moto';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import MotoForm from '../../sections/moto/MotoForm';
import MotoFacture from '../../sections/moto/MotoFacture';
import MotoBL from '../../sections/moto/MotoBL';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, currentData } = useSelector((state) => state.motos);
  const isEdit = pathname.includes('edit');
  // True once the list has been fetched on this page, so a reload can tell "loading" from "not found"
  const [isListLoaded, setListLoaded] = useState(false);

  // Right after creating a moto, the list may not have it yet: use the saved moto from the store
  const currentProduct =
    products?.find((moto) => moto.id === Number(id)) || (currentData?.id === Number(id) ? currentData : undefined);

  useEffect(() => {
    let active = true;
    dispatch(getMotos()).then(() => {
      if (active) setListLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && isListLoaded && !currentProduct) {
      navigate(PATH_DASHBOARD.moto.root, { replace: true });
    }
  }, [isEdit, isListLoaded, currentProduct, navigate]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isEdit && !currentProduct) {
    return <LoadingScreen />;
  }

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
            { name: !isEdit ? 'New product' : currentProduct?.ID_Moto }
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
              <MotoForm isEdit={isEdit} currentProduct={currentProduct} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MotoFacture isEdit={isEdit} currentProduct={currentProduct} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MotoBL isEdit={isEdit} currentProduct={currentProduct} />
            </TabPanel>
          </Box>
        ) : (
          <MotoForm isEdit={isEdit} currentProduct={currentProduct} />
        )}
      </Container>
    </Page>
  );
}
