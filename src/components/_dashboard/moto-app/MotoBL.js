import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { Link as RouterLink } from 'react-router-dom';

import { useEffect, useMemo } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
// material
import { LoadingButton } from '@material-ui/lab';
import { Card, Grid, Stack, Button, ButtonGroup, TextField } from '@material-ui/core';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// utils
//
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import BLPreview from './BL';
import { getLastID, getNumberWord } from '../../../redux/slices/moto';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const { enqueueSnackbar } = useSnackbar();

  const lastID = useSelector((state) => state.motos.lastID);
  const lastFacture = useSelector((state) => state.motos.lastFacture);

  const NewProductSchema = Yup.object({
    ID_Moto: Yup.number(),
    numBL: Yup.string(),
    dateBL: Yup.date('Date BL requise').required('La date de facture est requis'),
    nomMoto: Yup.string().required('Nom moto est requis'),
    numMoteur: Yup.string().required('Num moteurs est requis'),
    nomClient: Yup.string().required('Nom client est requis'),
    contactClient: Yup.string().required('Contact client est requis'),
    PV: Yup.number().required('Le prix de vente est requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ID_Moto: currentProduct?.ID_Moto || lastID + 1,
      numBL: currentProduct?.num_BL || lastFacture + 1,
      dateBL: currentProduct?.date_BL || null,
      nomMoto: currentProduct?.nom_moto || '',
      numMoteur: currentProduct?.num_moteur || '',
      nomClient: currentProduct?.nom_client_1 || '',
      contactClient: currentProduct?.tel_client_1 || '',
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
                      label="Nom"
                      name="nomClient"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('nomClient')}
                      error={Boolean(touched.nomClient && errors.nomClient)}
                      helperText={touched.renomClientf && errors.nomClient}
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

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">BL</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <Typography variant="subheading">Numéro BL: {values.numBL} </Typography>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={frLocale}
                      localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
                    >
                      <DatePicker
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
                    />
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
            <BLPreview currentProduct={currentProduct} />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
