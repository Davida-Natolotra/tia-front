import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Grid,
  Stack,
  Button,
  DialogTitle,
  TextField,
  CardHeader,
  CardContent,
  Dialog,
  DialogContent,
  Tooltip
} from '@material-ui/core';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
// utils
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
//
import IconButton from '@mui/material/IconButton';
import frLocale from 'date-fns/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR as calFR } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { url, updateCaisseMoto, addCaisseMoto, setEdit, resetCaisse, setShow } from '../../../redux/slices/caisse';
// routes
import CarouselProductDetails from '../../carousel/CarouselProductDetails';
import { fileChangedHandler } from '../../../utils/imageCompress';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};
const urlBlank = 'https://placehold.jp/24/cccccc/525252/500x500.png?text=Aucune%20photo';

function ProductNewForm() {
  const currentProduct = useSelector((state) => state.caisseMoto.caisse);
  const { isEdit } = useSelector((state) => state.caisseMoto);
  const [isChanged, setIsChanged] = useState(false);
  const linkPJ = () => {
    let link;
    if (currentProduct.PJ) {
      if (currentProduct.PJ.includes('media')) {
        link = `${url}${currentProduct.PJ}`;
      } else {
        link = `${url}/media/${currentProduct.PJ}`;
      }
    } else {
      link = urlBlank;
    }
    return link;
  };
  const [PJ, setPJ] = useState(linkPJ());
  const [PJFile, setPJFile] = useState(null);
  const [PJURI, setPJURI] = useState(null);
  const [changedPJ, setChangedPJ] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewProductSchema = Yup.object().shape({
    libellee: Yup.string().required('Libellée requise'),
    date: Yup.date().required('La date requise'),
    depense: Yup.number().nullable().notRequired(),
    recette: Yup.number().nullable().notRequired()
    // commercial: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      libellee: isEdit ? currentProduct.libellee : '',
      date: isEdit ? currentProduct.date : null,
      depense: isEdit ? currentProduct.depense : 0,
      recette: isEdit ? currentProduct.recette : 0
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const dataSubmit = new FormData();
      dataSubmit.append('libellee', values.libellee);
      dataSubmit.append('date', moment(values.date).format('YYYY-MM-DD'));
      dataSubmit.append('depense', values.depense);
      dataSubmit.append('recette', values.recette);
      if (changedPJ) {
        dataSubmit.append('PJ', PJFile);
      }

      if (isEdit) {
        dataSubmit.id = currentProduct.id;
      }
      try {
        console.log(dataSubmit);
        if (isEdit) {
          await dispatch(updateCaisseMoto(dataSubmit, currentProduct.id));
        } else {
          await dispatch(addCaisseMoto(dataSubmit));
        }
        resetFormInit();
        enqueueSnackbar(!isEdit ? 'Nouvelle entrée enregistrée avec succès' : 'Update success', { variant: 'success' });

        setIsChanged(false);
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
    setSubmitting,
    setFieldValue,
    isSubmitting,
    resetForm
  } = formik;

  const resetFormInit = () => {
    setChangedPJ(false);
    setIsChanged(false);
    dispatch(setEdit(false));
    dispatch(resetCaisse());
    setSubmitting(false);
    resetForm();
  };

  const isInit = useRef(true);
  useEffect(() => {
    if (isInit.current) {
      isInit.current = false;
    } else if (changedPJ) {
      setPJ(PJURI);
    }
  }, [PJURI]);

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false;
    } else if (values.libellee !== '') {
      setIsChanged(true);
    }
  }, [values]);

  useEffect(() => {
    setPJ(linkPJ());
  }, [currentProduct]);

  useEffect(() => {
    if (!isEdit) {
      resetFormInit();
    }
  }, [isEdit]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={3} direction="column">
                  <TextField
                    fullWidth
                    label="Libellée"
                    disabled={currentProduct.is_moto}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    {...getFieldProps('libellee')}
                    error={Boolean(touched.libellee && errors.libellee)}
                    helperText={touched.libellee && errors.libellee}
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={frLocale}
                    localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <MobileDatePicker
                      label="Date"
                      value={values.date}
                      name="date"
                      disabled={currentProduct.is_moto}
                      onChange={(value) => setFieldValue('date', value)}
                      onBlur={handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.date && errors.date)}
                          helperText={touched.date && errors.date}
                        />
                      )}
                      disableFuture
                      variant="standard"
                    />
                  </LocalizationProvider>

                  <CurrencyTextField
                    disabled={currentProduct.is_moto}
                    label="Dépense"
                    name="depense"
                    variant="outlined"
                    value={values.depense}
                    currencySymbol="Ar"
                    placeholder="Dépense"
                    outputFormat="number"
                    decimalCharacter=","
                    digitGroupSeparator=" "
                    decimalPlaces={0}
                    onChange={(event, value) => setFieldValue('depense', value)}
                    error={Boolean(touched.depense && errors.depense)}
                    helperText={touched.depense && errors.depense}
                  />

                  <CurrencyTextField
                    disabled={currentProduct.is_moto}
                    label="Recette"
                    name="recette"
                    variant="outlined"
                    value={values.recette}
                    currencySymbol="Ar"
                    placeholder="Recette"
                    outputFormat="number"
                    decimalCharacter=","
                    digitGroupSeparator=" "
                    decimalPlaces={0}
                    onChange={(event, value) => setFieldValue('recette', value)}
                    error={Boolean(touched.recette && errors.recette)}
                    helperText={touched.recette && errors.recette}
                  />

                  <Stack spacing={1} direction="row">
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                      disabled={!isChanged || currentProduct.is_moto}
                    >
                      Enregistrer
                    </LoadingButton>

                    <Button type="button" fullWidth variant="outlined" onClick={() => resetFormInit()}>
                      Nouveau
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2} direction="column">
              <label htmlFor="PJ">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  id="PJ"
                  onChange={(event) =>
                    fileChangedHandler({
                      event,
                      setStateFile: setPJFile,
                      setStateURI: setPJURI,
                      setChange: setChangedPJ
                    })
                  }
                />
                <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />}>
                  Pièce jointe
                </Button>
              </label>
              <CarouselProductDetails images={[PJ]} />
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
export default function CaisseEdit() {
  const openDialog = useSelector((state) => state.caisseMoto.show);
  const { isEdit } = useSelector((state) => state.caisseMoto);
  const dispatch = useDispatch();
  const handleCloseDialog = () => dispatch(setShow(false));
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ p: 3 }}>
        {isEdit ? 'Edition' : 'Nouvelle entrée'}
        {openDialog ? (
          <Tooltip title="Fermer">
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <ProductNewForm />
      </DialogContent>
    </Dialog>
  );
}
