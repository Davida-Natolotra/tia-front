import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
// material
import { LoadingButton } from '@material-ui/lab';
import { Card, Grid, Stack, Button, ButtonGroup, Box, TextField } from '@material-ui/core';
import { Autocomplete, Typography, Divider } from '@mui/material';
// utils

//
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { getLastID } from '../../../redux/slices/moto';
import { fNumber } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLastID());
  }, [dispatch]);

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
    PV: Yup.number().required('Le prix de vente est requis'),
    montantLettre: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ID_Moto: currentProduct?.ID_Moto || lastID + 1,
      numFacture: currentProduct?.num_facture || lastFacture + 1,
      dateFacture: currentProduct?.date_facture || null,
      ref: currentProduct?.ref || '',
      nomMoto: currentProduct?.nom_moto || '',
      numMoteur: currentProduct?.num_moteur || '',
      volumeMoteur: currentProduct?.volume_moteur || 0,
      nomClient: currentProduct?.nom_client_2 || '',
      CIN: currentProduct?.CIN_Num_Client_2 || '',
      adresseClient: currentProduct?.adresse_client_2 || '',
      contactClient: currentProduct?.tel_client_2 || '',
      PUHT: currentProduct?.PU_HT || '',
      TVA: currentProduct?.TVA || '',
      PV: currentProduct?.PV || '',
      montantLettre: currentProduct?.montantLettre || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await console.log(values);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(`${PATH_DASHBOARD.moto.root}/${values.ID_Moto}/edit`);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

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

  const options = [
    { label: 'Dépot', year: 1994 },
    { label: 'Showroom', year: 1972 }
  ];

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} direction="column">
                <Box>
                  <Typography variant="overline">moto</Typography>
                  <Divider />
                </Box>

                <Typography variant="subheading">ID Moto: {values.ID_Moto} </Typography>

                <Typography variant="subheading">Nom Moto: {values.nomMoto} </Typography>
                <Typography variant="subheading">Numéro moteur: {values.numMoteur} </Typography>
                <Typography variant="subheading">Volume moteur: {values.volumeMoteur} </Typography>

                <Box sx={{ pt: 3 }}>
                  <Typography variant="overline">Client</Typography>
                  <Divider sx={{ borderColor: 'primary' }} />
                </Box>
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

                <Box sx={{ pt: 3 }}>
                  <Typography variant="overline">Facture</Typography>
                  <Divider />
                </Box>
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
                <Typography variant="subheading">
                  Prix de vente en lettre: {values.montantLettre.toUpperCase()} ARIARY
                </Typography>
                <Typography variant="subheading">TVA: {fNumber(values.TVA)} Ar</Typography>
                <Typography variant="subheading">Prix hors taxe: {fNumber(values.PUHT)} Ar</Typography>

                <ButtonGroup>
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
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subheading  ">Preview</Typography>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
