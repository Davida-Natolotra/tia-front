import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Grid, Stack, Button, TextField } from '@material-ui/core';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// utils
//
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';

import BLPreview from './BL';
import { getLastID, updateMoto, getMotos, getLastBL, cancelFacture } from '../../../redux/slices/moto';
import { createOrUpdateFromMoto } from '../../../redux/slices/caisse';

// routes
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

function padLeadingZeros(num, size) {
  let s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

export default function ProductNewForm({ isEdit, currentProduct }) {
  const { enqueueSnackbar } = useSnackbar();

  const [errorClientCase, setErrorClientCase] = useState(false);
  const [errorBLCase, setErrorBLCase] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const lastID = useSelector((state) => state.motos.lastID);
  const lastBL = useSelector((state) => state.motos.lastBL);
  const motos = useSelector((state) => state.motos.products);
  const motosVente = motos.filter((moto) => moto.PV !== 0 && moto.date_vente !== null && moto.date_vente !== '');

  const NewProductSchema = Yup.object({
    ID_Moto: Yup.number(),
    numBL: Yup.string(),
    dateBL: Yup.date('Date BL requise').required('La date de facture est requis'),
    nomMoto: Yup.string().required('Nom moto est requis'),
    numMoteur: Yup.string().required('Num moteurs requis'),
    nomClient: Yup.string().required('Nom client requis'),
    contactClient: Yup.string().required('Contact client requis'),
    PV: Yup.number().required('Le prix de vente est requis'),
    commercial: Yup.string().required('Le commercial est requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ID_Moto: currentProduct?.ID_Moto || lastID + 1,
      numBL: currentProduct?.num_BL || lastBL + 1,
      dateBL: currentProduct?.date_BL || null,
      nomMoto: currentProduct?.nom_moto || '',
      numMoteur: currentProduct?.num_moteur || '',
      nomClient: currentProduct?.nom_client_1 || '',
      contactClient: currentProduct?.tel_client_1 || '',
      PV: currentProduct?.PV || null,
      commercial: currentProduct?.commercial || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const dataSubmit = new FormData();
      dataSubmit.append('num_BL', values.numBL);
      dataSubmit.append('date_BL', moment(values.dateBL).format('YYYY-MM-DD'));
      dataSubmit.append('nom_client_1', values.nomClient);
      dataSubmit.append('tel_client_1', values.contactClient);
      dataSubmit.append('PV', parseInt(values.PV, 10));
      dataSubmit.append('commercial', values.commercial);
      if (values.dateBL) {
        dataSubmit.append('date_vente', moment(values.dateBL).format('YYYY-MM-DD'));
      }
      try {
        await dispatch(updateMoto(dataSubmit, currentProduct.id));
        setSubmitting(false);
        enqueueSnackbar('Update success', {
          variant: 'success'
        });
        await dispatch(getMotos());
        await motosVente.forEach((el) =>
          dispatch(
            createOrUpdateFromMoto({
              libellee: `Vente du moto ${el.nom_moto}-${el.num_moteur}`,
              date: moment(el.date_vente).format('YYYY-MM-DD'),
              recette: Number(el.PV),
              depense: 0,
              is_depense: false,
              is_moto: true,
              id_moto: Number(el.ID_Moto)
            })
          )
        );
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLastID());
    dispatch(getLastBL());
  }, []);

  useEffect(() => {
    values.numBL = lastBL + 1;
  }, [lastBL]);

  const {
    handleChange,
    getFieldProps,
    values,
    handleSubmit,
    touched,
    handleBlur,
    errors,
    resetForm,
    setFieldValue,
    isSubmitting
  } = formik;

  useEffect(() => {
    values.PUHT = values.PV / 1.2;
    values.TVA = 0.2 * values.PUHT;
  }, [values.PV]);

  useEffect(() => {
    const errorNomClient = Boolean(touched.nomClient && errors.nomClient);
    const errorContactClient = Boolean(touched.contactClient && errors.contactClient);
    setErrorClientCase(errorNomClient || errorContactClient);
  }, [touched, errors]);

  useEffect(() => {
    const errorDateBL = Boolean(touched.dateBL && errors.dateBL);
    const errorPV = Boolean(touched.PV && errors.PV);
    setErrorBLCase(errorDateBL || errorPV);
  }, [touched, errors]);

  const resetBL = async () => {
    const dataReset = new FormData();

    dataReset.append('num_BL', '');
    dataReset.append('date_BL', '');
    dataReset.append('date_vente', '');
    dataReset.append('nom_client_1', '');
    dataReset.append('CIN_Num_Client_1', '');
    dataReset.append('adresse_client_1', '');
    dataReset.append('tel_client_1', '');
    dataReset.append('PV', '');
    dataReset.append('commercial', '');

    try {
      console.log(dataReset);
      await dispatch(cancelFacture(dataReset, currentProduct.id));
      handleClose();
      enqueueSnackbar('Annulation de BL terminé', {
        variant: 'success'
      });
      await dispatch(getMotos());
      resetForm(true);
    } catch (error) {
      console.error(error);

      enqueueSnackbar("Erreur d'enregistrement", { variant: 'danger' });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">moto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <Typography variant="body2">ID Moto: {values.ID_Moto} </Typography>

                    <Typography variant="body2">Nom Moto: {values.nomMoto} </Typography>
                    <Typography variant="body2">Numéro moteur: {values.numMoteur} </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ border: errorClientCase ? 1 : 0, borderColor: 'red' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">Client</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <TextField
                      fullWidth
                      label="Nom"
                      name="nomClient"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('nomClient')}
                      error={Boolean(touched.nomClient && errors.nomClient)}
                      helperText={touched.nomClient && errors.nomClient}
                    />

                    <TextField
                      fullWidth
                      label="Contact"
                      name="contactClient"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('contactClient')}
                      error={Boolean(touched.contactClient && errors.contactClient)}
                      helperText={touched.contactClient && errors.contactClient}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ border: errorBLCase ? 1 : 0, borderColor: 'red' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">BL</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <Typography variant="subheading">
                      Numéro BL: {padLeadingZeros(values.numBL, 3)}/{moment(new Date()).format('MM-YYYY')}
                    </Typography>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={frLocale}
                      localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
                    >
                      <MobileDatePicker
                        label="Date BL"
                        value={values.dateBL}
                        name="dateBL"
                        onChange={(value) => setFieldValue('dateBL', value)}
                        onBlur={handleBlur}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.dateBL && errors.dateBL)}
                            helperText={touched.dateBL && errors.dateBL}
                          />
                        )}
                        disableFuture
                        variant="standard"
                      />
                    </LocalizationProvider>

                    <CurrencyTextField
                      label="Prix de vente"
                      name="PV"
                      variant="outlined"
                      value={values.PV}
                      currencySymbol="Ar"
                      placeholder="PV"
                      outputFormat="number"
                      decimalCharacter=","
                      digitGroupSeparator=" "
                      decimalPlaces={0}
                      onChange={(event, value) => setFieldValue('PV', value)}
                      error={Boolean(touched.PV && errors.PV)}
                      helperText={touched.PV && errors.PV}
                      disabled={user.role === 'commercial' && currentProduct.PV}
                    />
                    <TextField
                      fullWidth
                      label="Commercial"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('commercial')}
                      error={Boolean(touched.commercial && errors.commercial)}
                      helperText={touched.commercial && errors.commercial}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Stack spacing={1} sx={{ mt: 3 }}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                  Enregistrer
                </LoadingButton>

                <Button type="button" fullWidth variant="outlined" onClick={() => resetForm()}>
                  Réinitialiser
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={handleClickOpen}
                  sx={{ textTransform: 'none' }}
                >
                  Annuler cette BL
                </Button>
              </Stack>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Confirmer l'annulation de cette BL</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Voulez-vous vraiment annuler cette BL?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => resetBL()}>Oui</Button>
                  <Button onClick={handleClose} autoFocus>
                    Non
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <BLPreview currentProduct={currentProduct} />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
