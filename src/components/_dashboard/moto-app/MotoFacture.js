import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
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
import {
  getLastID,
  getNumberWord,
  updateMoto,
  getMotos,
  resetCurrentData,
  getLastFacture
} from '../../../redux/slices/moto';
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
  const [IDMoto, setIDMoto] = useState(currentProduct.ID_Moto);
  const [nomMoto, setNomMoto] = useState(currentProduct.nom_moto);
  const [numMoteur, setNumMoteur] = useState(currentProduct.num_moteur);
  const [volumeMoteur, setVolumeMoteur] = useState(currentProduct.volume_moteur);
  const lastFacture = useSelector((state) => state.motos.lastFacture);
  const montantLettreIn = useSelector((state) => state.motos.numWord);
  const dispatch = useDispatch();

  const NewProductSchema = Yup.object({
    numFacture: Yup.number().required('required'),
    dateFacture: Yup.date('Date de facture requise').required('La date de facture est requis'),
    ref: Yup.number().required('Veuillez entrer le ref'),
    nomClient: Yup.string().required('Nom client est requis'),
    CIN: Yup.string().required('Cin est requis'),
    adresseClient: Yup.string().required('Adresse client est requis'),
    contactClient: Yup.string().required('Contact client est requis'),
    PUHT: Yup.number().required('PUHT est requis'),
    TVA: Yup.number().required('TVA est requis'),
    PV: Yup.number().required('Le prix de vente est requis'),
    montantLettre: Yup.string().required('Montant lettre requis')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      numFacture: currentProduct?.num_sur_facture || lastFacture + 1,
      dateFacture: currentProduct?.date_facture || null,
      ref: currentProduct?.Ref || 0,
      nomClient: currentProduct?.nom_client_2 || '',
      CIN: currentProduct?.CIN_Num_Client_2 || '',
      adresseClient: currentProduct?.adresse_client_2 || '',
      contactClient: currentProduct?.tel_client_2 || '',
      PUHT: currentProduct?.PU_HT || currentProduct.PV / 1.2,
      TVA: currentProduct?.TVA || (0.2 * currentProduct.PV) / 1.2,
      PV: currentProduct?.PV || 0,
      montantLettre: currentProduct?.montant_lettre || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const dataSubmit = {
        id: currentProduct.id,
        num_sur_facture: values.numFacture,
        date_facture: moment(values.dateFacture).format('YYYY-MM-DD'),
        Ref: parseInt(values.ref, 10),
        nom_client_2: values.nomClient,
        CIN_Num_Client_2: values.CIN,
        adresse_client_2: values.adresseClient,
        tel_client_2: values.contactClient,
        PU_HT: values.PUHT,
        TVA: values.TVA,
        PV: values.PV,
        montant_lettre: values.montantLettre
      };
      try {
        console.log(dataSubmit);
        await dispatch(updateMoto(dataSubmit));
        setSubmitting(false);
        enqueueSnackbar('Update success', {
          variant: 'success'
        });
        await dispatch(getMotos());
        resetForm(true);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
        enqueueSnackbar("Erreur d'enregistrement", { variant: 'danger' });
      }
    }
  });

  useEffect(() => {
    dispatch(getLastID());
    dispatch(getLastFacture());
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

  useEffect(() => {
    values.numFacture = lastFacture + 1;
  }, [lastFacture]);

  useEffect(() => {
    values.montantLettre = montantLettreIn;
  }, [montantLettreIn]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <Card sx={{ p: 3 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography variant="overline">moto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3} direction="column">
                    <Typography variant="body2">ID Moto: {IDMoto} </Typography>

                    <Typography variant="body2">Nom Moto: {nomMoto} </Typography>
                    <Typography variant="body2">Numéro moteur: {numMoteur} </Typography>
                    <Typography variant="body2">Volume moteur: {volumeMoteur} </Typography>
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('nomClient')}
                      error={Boolean(touched.nomClient && errors.nomClient)}
                      helperText={touched.renomClientf && errors.nomClient}
                    />
                    <TextField
                      fullWidth
                      label="Adresse"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('adresseClient')}
                      error={Boolean(touched.adresseClient && errors.adresseClient)}
                      helperText={touched.adresseClient && errors.adresseClient}
                    />
                    <TextField
                      fullWidth
                      label="Numéro CIN"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('CIN')}
                      error={Boolean(touched.CIN && errors.CIN)}
                      helperText={touched.CIN && errors.CIN}
                    />
                    <TextField
                      fullWidth
                      label="Contact"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      {...getFieldProps('contactClient')}
                      error={Boolean(touched.contactClient && errors.contactClient)}
                      helperText={touched.contactClient && errors.contactClient}
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
                    <Typography variant="subheading">
                      Montant en lettre: {values.montantLettre.toUpperCase()} Ar
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <ButtonGroup sx={{ mt: 3 }}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                  Enregistrer
                </LoadingButton>
                {isEdit && (
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.moto.root}/new`}
                    onClick={() => dispatch(resetCurrentData())}
                  >
                    Nouvelle entrée
                  </Button>
                )}

                <Button type="button" fullWidth variant="outlined" onClick={() => resetForm()}>
                  Annuler
                </Button>
              </ButtonGroup>
            </Card>
          </Form>
        </FormikProvider>
      </Grid>
      <Grid item xs={12} md={6}>
        <FacturePreview currentProduct={currentProduct} />
      </Grid>
    </Grid>
  );
}
