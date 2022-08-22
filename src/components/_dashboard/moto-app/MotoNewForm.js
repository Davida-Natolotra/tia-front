import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
// material
import { LoadingButton } from '@material-ui/lab';
import { Card, Grid, Stack, Button, Box, TextField } from '@material-ui/core';
import { Autocomplete, Typography } from '@mui/material';
// utils
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
//

import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';

import { getLastID, addMoto, getMotos, resetCurrentData, updateMoto } from '../../../redux/slices/moto';
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
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getLastID());
  }, [dispatch]);

  const lastID = useSelector((state) => state.motos.lastID);
  const lastPK = useSelector((state) => state.motos.currentData.id);
  const [dateVente, setDateVente] = useState(currentProduct?.date_vente || null);
  const [vendeur, setVendeur] = useState(currentProduct?.vendeur || null);
  const [commercial, setCommercial] = useState(currentProduct?.commercial || null);

  const NewProductSchema = Yup.object().shape({
    ID_Moto: Yup.number().required('IdMoto is required'),
    dateEntree: Yup.date("Date d'entrée requise").required("La date d'entrée est requis"),
    name: Yup.string().required('Veuillez entrer le nom du moto'),
    numMoteur: Yup.string().required('Entrer le numéro moteur'),
    FRN: Yup.string().required('Entrer le FRN'),
    PA: Yup.number().required('Entrer le PA'),
    PV: Yup.number().required(),
    localisation: Yup.string().required('Localisation requis'),
    dateArrivee: Yup.date().required("Date d'arrivée requise"),
    volumeMoteur: Yup.string().required('Volume moteur requis'),
    carteRose: Yup.string().nullable().notRequired(),
    carteGrise: Yup.string().nullable().notRequired(),
    montantReparation: Yup.number().nullable().notRequired(),
    motifReparation: Yup.string().nullable().notRequired(),
    fournisseur: Yup.string().nullable().notRequired()
    // commercial: Yup.string()
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
      carteRose: currentProduct?.carte_rose || '',
      carteGrise: currentProduct?.carte_grise || '',
      montantReparation: currentProduct?.montant_reparation || 0,
      motifReparation: currentProduct?.motif_reparation || '',
      fournisseur: currentProduct?.fournisseur || ''
      // commercial: currentProduct?.commercial || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const dataSubmit = {
        ID_Moto: values.ID_Moto,
        nom_moto: values.name,
        date_entree: moment(values.dateEntree).format('YYYY-MM-DD'),
        num_moteur: values.numMoteur,
        FRN: values.FRN,
        PA: values.PA,
        localisation: values.localisation,
        date_arrivee: moment(values.dateArrivee).format('YYYY-MM-DD'),
        volume_moteur: values.volumeMoteur,
        carte_rose: values.carteRose,
        carte_grise: values.carteGrise,
        montant_reparation: values.montantReparation,
        motif_reparation: values.motifReparation,
        fournisseur: values.fournisseur
      };

      if (isEdit) {
        dataSubmit.id = currentProduct.id;
      }
      try {
        console.log(dataSubmit);
        if (isEdit) {
          await dispatch(updateMoto(dataSubmit, currentProduct.id));
        } else {
          await dispatch(addMoto(dataSubmit));
        }
        // resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Nouvelle entrée enregistrée avec succès' : 'Update success', { variant: 'success' });
        await dispatch(getMotos());
        isEdit = false;
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

  useEffect(() => {
    if (lastPK) {
      navigate(`${PATH_DASHBOARD.moto.root}/${lastPK}/edit`);
    }
  }, [lastPK]);

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
                  <MobileDatePicker
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  label="Numéro moteur"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('numMoteur')}
                  error={Boolean(touched.numMoteur && errors.numMoteur)}
                  helperText={touched.numMoteur && errors.numMoteur}
                />
                <TextField
                  fullWidth
                  label="Volume moteur"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('volumeMoteur')}
                  error={Boolean(touched.volumeMoteur && errors.volumeMoteur)}
                  helperText={touched.volumeMoteur && errors.volumeMoteur}
                />
                <TextField
                  fullWidth
                  label="FRN"
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
                  <MobileDatePicker
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
                {user.role === 'admin' || user.role === 'manager' ? (
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
                    decimalPlaces={0}
                    onChange={(event, value) => setFieldValue('PA', value)}
                    error={Boolean(touched.PA && errors.PA)}
                    helperText={touched.PA && errors.PA}
                  />
                ) : (
                  <></>
                )}

                <Typography variant="subheading">PV: {fNumber(values.PV)} Ar</Typography>
                <Typography variant="subheading">
                  Date de vente:{' '}
                  {dateVente
                    ? new Date(dateVente).toLocaleDateString('fr-fr', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'invendue'}
                </Typography>

                <TextField
                  fullWidth
                  label="Fournisseur"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('fournisseur')}
                  error={Boolean(touched.fournisseur && errors.fournisseur)}
                  helperText={touched.fournisseur && errors.fournisseur}
                />

                <TextField
                  fullWidth
                  label="Carte rose"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('carteRose')}
                  error={Boolean(touched.carteRose && errors.carteRose)}
                  helperText={touched.carteRose && errors.carteRose}
                />

                <TextField
                  fullWidth
                  label="Carte grise"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('carteGrise')}
                  error={Boolean(touched.carteGrise && errors.carteGrise)}
                  helperText={touched.carteGrise && errors.carteGrise}
                />
                <CurrencyTextField
                  label="Montant réparation"
                  name="montantReparation"
                  variant="outlined"
                  value={values.montantReparation}
                  currencySymbol="Ar"
                  placeholder="PA"
                  outputFormat="number"
                  decimalCharacter=","
                  digitGroupSeparator=" "
                  decimalPlaces={0}
                  onChange={(event, value) => setFieldValue('montantReparation', value)}
                  error={Boolean(touched.montantReparation && errors.montantReparation)}
                  helperText={touched.montantReparation && errors.montantReparation}
                />
                <TextField
                  fullWidth
                  label="Motif de réparation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  {...getFieldProps('motifReparation')}
                  error={Boolean(touched.motifReparation && errors.motifReparation)}
                  helperText={touched.motifReparation && errors.motifReparation}
                />
                <Typography variant="subheading">Commercial: {commercial}</Typography>
                <Stack spacing={1}>
                  <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                    Enregistrer
                  </LoadingButton>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="outlined"
                      component={RouterLink}
                      to={`${PATH_DASHBOARD.moto.root}/new`}
                      onClick={() => dispatch(resetCurrentData())}
                    >
                      Nouvelle entrée
                    </Button>
                  )}

                  <Button type="button" fullWidth variant="outlined" onClick={() => resetForm()}>
                    Réinitialiser
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
