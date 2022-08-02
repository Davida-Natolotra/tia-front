import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { useState, useEffect, useMemo } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
// material
import { LoadingButton } from '@material-ui/lab';
import { Card, Grid, Stack, Button, ButtonGroup, Box, TextField } from '@material-ui/core';
import { Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
// utils
//
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import FacturePreview from './Facture';
import { fileChangedHandler } from '../../../utils/imageCompress';
import { getLastID, getNumberWord } from '../../../redux/slices/moto';
import { fNumber } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import CarouselProductDetails from '../../carousel/CarouselProductDetails';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const { enqueueSnackbar } = useSnackbar();
  const [CINRecto, setCINRecto] = useState('https://via.placeholder.com/500');
  const [CINVerso, setCINVerso] = useState('https://via.placeholder.com/500');

  const numWord = useSelector((state) => state.motos.numWord);

  const lastID = useSelector((state) => state.motos.lastID);
  const lastFacture = useSelector((state) => state.motos.lastFacture);

  const NewProductSchema = Yup.object({
    ID_Moto: Yup.number(),
    numFacture: Yup.number(),
    dateFacture: Yup.date('Date de facture requise').required('La date de facture est requis'),
    ref: Yup.string().required('Veuillez entrer le ref'),
    nomMoto: Yup.string().required('Nom moto est requis'),
    numMoteur: Yup.string().required('Num moteurs est requis'),
    volumeMoteur: Yup.string().required('Volume de moteurs est requis'),
    nomClient: Yup.string().required('Nom client est requis'),
    CIN: Yup.string().required('Cin est requis'),
    adresseClient: Yup.string().required('Adresse client est requis'),
    contactClient: Yup.string().required('Contact client est requis'),
    PUHT: Yup.number().required('PUHT est requis'),
    TVA: Yup.number().required('TVA est requis'),
    PV: Yup.number().required('Le prix de vente est requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ID_Moto: currentProduct?.ID_Moto || lastID + 1,
      numFacture: currentProduct?.num_sur_facture || lastFacture + 1,
      dateFacture: currentProduct?.date_facture || null,
      ref: currentProduct?.Ref || '',
      nomMoto: currentProduct?.nom_moto || '',
      numMoteur: currentProduct?.num_moteur || '',
      volumeMoteur: currentProduct?.volume_moteur || 0,
      nomClient: currentProduct?.nom_client_2 || '',
      CIN: currentProduct?.CIN_Num_Client_2 || '',
      adresseClient: currentProduct?.adresse_client_2 || '',
      contactClient: currentProduct?.tel_client_2 || '',
      PUHT: currentProduct?.PU_HT || '',
      TVA: currentProduct?.TVA || '',
      PV: currentProduct?.PV || null
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await console.log(values);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
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
    dispatch(getNumberWord(values.PV));
  }, []);

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

  useMemo(() => {
    dispatch(getNumberWord(values.PV));
  }, [values.PV]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">moto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <Typography variant="body2">ID Moto: {values.ID_Moto} </Typography>

                    <Typography variant="body2">Nom Moto: {values.nomMoto} </Typography>
                    <Typography variant="body2">Numéro moteur: {values.numMoteur} </Typography>
                    <Typography variant="body2">Volume moteur: {values.volumeMoteur} </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">Client</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <TextField
                      fullWidth
                      label="Nom du client"
                      name="nomClient"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('nomClient')}
                      error={Boolean(touched.nomClient && errors.nomClient)}
                      helperText={touched.renomClientf && errors.nomClient}
                    />
                    <TextField
                      fullWidth
                      label="Adresse du client"
                      name="adresseClient"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('adresseClient')}
                      error={Boolean(touched.adresseClient && errors.adresseClient)}
                      helperText={touched.adresseClient && errors.adresseClient}
                    />
                    <TextField
                      fullWidth
                      label="Numéro CIN du client"
                      name="CIN"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('CIN')}
                      error={Boolean(touched.CIN && errors.CIN)}
                      helperText={touched.CIN && errors.CIN}
                    />
                    <TextField
                      fullWidth
                      label="Adresse du client"
                      name="adresseClient"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('adresseClient')}
                      error={Boolean(touched.adresseClient && errors.adresseClient)}
                      helperText={touched.adresseClient && errors.adresseClient}
                    />
                    <Box>
                      <Typography variant="caption">Pièces jointe</Typography>
                      <Divider />
                    </Box>
                    <Stack spacing={3} direction="row">
                      <label htmlFor="CINRecto">
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          id="CINRecto"
                          onChange={(event) => fileChangedHandler(event, setCINRecto)}
                        />
                        <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />}>
                          CIN Recto
                        </Button>
                      </label>
                      <label htmlFor="CINVerso">
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          id="CINVerso"
                          onChange={(event) => fileChangedHandler(event, setCINVerso)}
                        />
                        <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />}>
                          CIN Verso
                        </Button>
                      </label>
                    </Stack>
                    <CarouselProductDetails images={[CINRecto, CINVerso]} />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">Facture</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <Typography variant="subheading">Numéro facture: {values.numFacture} </Typography>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={frLocale}
                      localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
                    >
                      <DatePicker
                        label="Date Facture"
                        value={values.dateFacture}
                        name="dateFacture"
                        onChange={(value) => setFieldValue('dateFacture', value)}
                        onBlur={handleBlur}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.dateFacture && errors.dateFacture)}
                            helperText={touched.dateFacture && errors.dateFacture}
                          />
                        )}
                        disableFuture
                        variant="standard"
                      />
                    </LocalizationProvider>
                    <TextField
                      fullWidth
                      label="Ref"
                      name="ref"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('ref')}
                      error={Boolean(touched.ref && errors.ref)}
                      helperText={touched.ref && errors.ref}
                    />
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
                    />

                    <Typography variant="subheading">TVA: {fNumber(values.TVA)} Ar</Typography>
                    <Typography variant="subheading">Prix hors taxe: {fNumber(values.PUHT)} Ar</Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <ButtonGroup sx={{ mt: 3 }}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                  Enregistrer
                </LoadingButton>
                {isEdit && (
                  <Button variant="outlined" component={RouterLink} to={`${PATH_DASHBOARD.moto.root}/new`}>
                    Nouvelle entrée
                  </Button>
                )}

                <Button type="button" fullWidth variant="outlined" onClick={() => resetForm()}>
                  Annuler
                </Button>
              </ButtonGroup>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <FacturePreview currentProduct={currentProduct} />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
