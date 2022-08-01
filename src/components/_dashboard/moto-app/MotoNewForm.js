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
import { Autocomplete, Typography } from '@mui/material';
// utils

//
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { getLastID, getMotos } from '../../../redux/slices/moto';
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
  const curID = currentProduct?.id || null;
  const lastID = useSelector((state) => state.motos.lastID);

  const NewProductSchema = Yup.object({
    ID_Moto: Yup.string(),
    dateEntree: Yup.date("Date d'entrée requise").required("La date d'entrée est requis"),
    name: Yup.string().required('Veuillez entrer le nom du moto'),
    numMoteur: Yup.string().required('Entrer le numéro moteur'),
    FRN: Yup.string().required('Entrer le FRN'),
    PA: Yup.number().required('Entrer le PA'),
    PV: Yup.number(),
    localisation: Yup.string().required('Localisation requis'),
    dateArrivee: Yup.date(),
    volumeMoteur: Yup.string().required('Volume moteur requis'),
    date_vente: Yup.date(),
    vendeur: Yup.string().required('Vendeur requis'),
    carteRose: Yup.string(),
    carteGrise: Yup.string(),
    reparation: Yup.number(),
    motifReparation: Yup.string(),
    commercial: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ID_Moto: currentProduct?.ID_Moto || lastID + 1,
      name: currentProduct?.nom_moto || '',
      dateEntree: currentProduct?.date_entree || null,
      numMoteur: currentProduct?.num_moteur || '',
      FRN: currentProduct?.FRN || '',
      PA: currentProduct?.PA || '',
      PV: currentProduct?.PV || 0,
      localisation: currentProduct?.localisation || '',
      dateArrivee: currentProduct?.date_arrivee || null,
      volumeMoteur: currentProduct?.volume_moteur || '',
      date_vente: currentProduct?.date_vente || null,
      vendeur: currentProduct?.vendeur || '',
      carteRose: currentProduct?.carte_rose || '',
      carteGrise: currentProduct?.carte_grise || '',
      reparation: currentProduct?.montant_reparation || 0,
      motifReparation: currentProduct?.motif_reparation || '',
      commercial: currentProduct?.commercial || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await console.log(values);
        // dispatch(getMotos);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(`${PATH_DASHBOARD.moto.root}/${curID}/edit`);
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
    { label: 'Dépot', value: 'Dépot' },
    { label: 'Showroom', value: 'Showroom' }
  ];

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} direction="column">
                <Typography variant="subheading">ID Moto: {values.ID_Moto} </Typography>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={frLocale}
                  localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                  <DatePicker
                    label="Date d'entrée"
                    value={values.dateEntree}
                    name="dateEntree"
                    onChange={(value) => setFieldValue('dateEntree', value)}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(touched.dateEntree && errors.dateEntree)}
                        helperText={touched.dateEntree && errors.dateEntree}
                      />
                    )}
                    disableFuture
                    variant="standard"
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Nom moto"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  label="Numéro moteur"
                  name="numMoteur"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('numMoteur')}
                  error={Boolean(touched.numMoteur && errors.numMoteur)}
                  helperText={touched.numMoteur && errors.numMoteur}
                />
                <TextField
                  fullWidth
                  label="Volume moteur"
                  name="volumeMoteur"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('volumeMoteur')}
                  error={Boolean(touched.volumeMoteur && errors.volumeMoteur)}
                  helperText={touched.volumeMoteur && errors.volumeMoteur}
                />
                <TextField
                  fullWidth
                  label="FRN"
                  name="FRN"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('FRN')}
                  error={Boolean(touched.FRN && errors.FRN)}
                  helperText={touched.FRN && errors.FRN}
                />
                <Autocomplete
                  name="localisation"
                  fullWidth
                  options={options}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={values.localisation}
                  onInputChange={(event, newInputValue) => {
                    setFieldValue('localisation', newInputValue);
                  }}
                  freeSolo
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <TextField
                        {...params}
                        label="Localisation"
                        error={Boolean(touched.localisation && errors.localisation)}
                        helperText={touched.localisation && errors.localisation}
                      />
                    </Box>
                  )}
                />
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={frLocale}
                  localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                  <DatePicker
                    label="Date d'arrivée"
                    value={values.dateArrivee}
                    name="dateArrivee"
                    onChange={(value) => setFieldValue('dateArrivee', value)}
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(touched.dateArrivee && errors.dateArrivee)}
                        helperText={touched.dateArrivee && errors.dateArrivee}
                      />
                    )}
                    disableFuture
                    variant="standard"
                  />
                </LocalizationProvider>
                <CurrencyTextField
                  label="PA"
                  name="PA"
                  variant="outlined"
                  value={values.PA}
                  currencySymbol="Ar"
                  placeholder="PA"
                  outputFormat="number"
                  decimalCharacter=","
                  digitGroupSeparator=" "
                  onChange={(event, value) => setFieldValue('PA', value)}
                  error={Boolean(touched.PA && errors.PA)}
                  helperText={touched.PA && errors.PA}
                />
                <Typography variant="subheading">PV: {fNumber(values.PV)} Ar</Typography>
                <Typography variant="subheading">
                  Date de vente:{' '}
                  {values.date_vente
                    ? new Date(values.date_vente).toLocaleDateString('fr-fr', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'invendue'}
                </Typography>
                <TextField
                  fullWidth
                  label="Vendeur"
                  name="vendeur"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('vendeur')}
                  error={Boolean(touched.vendeur && errors.vendeur)}
                  helperText={touched.vendeur && errors.vendeur}
                />
                <TextField
                  fullWidth
                  label="Carte rose"
                  name="carteRose"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('carteRose')}
                  error={Boolean(touched.carteRose && errors.carteRose)}
                  helperText={touched.carteRose && errors.carteRose}
                />
                <TextField
                  fullWidth
                  label="Carte grise"
                  name="carteGrise"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('carteGrise')}
                  error={Boolean(touched.carteGrise && errors.carteGrise)}
                  helperText={touched.carteGrise && errors.carteGrise}
                />
                <CurrencyTextField
                  label="Montant réparation"
                  name="reparation"
                  variant="outlined"
                  value={values.reparation}
                  currencySymbol="Ar"
                  placeholder="PA"
                  outputFormat="number"
                  decimalCharacter=","
                  digitGroupSeparator=" "
                  onChange={(event, value) => setFieldValue('reparation', value)}
                  error={Boolean(touched.reparation && errors.reparation)}
                  helperText={touched.reparation && errors.reparation}
                />
                <TextField
                  fullWidth
                  label="Motif de réparation"
                  name="motifReparation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('motifReparation')}
                  error={Boolean(touched.motifReparation && errors.motifReparation)}
                  helperText={touched.motifReparation && errors.motifReparation}
                />{' '}
                <TextField
                  fullWidth
                  label="Commercial"
                  name="commercial"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('commercial')}
                  error={Boolean(touched.commercial && errors.commercial)}
                  helperText={touched.commercial && errors.commercial}
                />
                <ButtonGroup>
                  <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                    Enregistrer
                  </LoadingButton>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="outlined"
                      component={RouterLink}
                      to={`${PATH_DASHBOARD.moto.root}/new`}
                    >
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
        </Grid>
      </Form>
    </FormikProvider>
  );
}
