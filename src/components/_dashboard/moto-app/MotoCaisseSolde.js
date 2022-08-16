import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import moment from 'moment';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Typography, Icon, Card, CardHeader, CardContent, Tooltip, Stack, IconButton, Box } from '@mui/material';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { useSelector, useDispatch } from 'react-redux';
import SyncIcon from '@mui/icons-material/Sync';
import { getSolde, updateSolde } from '../../../redux/slices/caisse';
// utils
import { fNumber } from '../../../utils/formatNumber';

export default function MotoCaisseSolde() {
  const soldes = useSelector((state) => state.caisseMoto.solde);
  const caisses = useSelector((state) => state.caisseMoto.caisses);
  const isLoading = useSelector((state) => state.caisseMoto.isLoading);
  const [tempValue, setTempValue] = useState(0);
  const soldeInitial = soldes.solde_initial;
  const soldeActuel = soldes.solde_actuel;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSolde());
  }, []);

  const updateSoldeFrom = () =>
    dispatch(
      updateSolde({
        solde_initial: tempValue,
        solde_actuel:
          tempValue +
          caisses.reduce((partialSum, a) => partialSum + Number(a.recette), 0) -
          caisses.reduce((partialSum, a) => partialSum + Number(a.depense), 0)
      })
    );

  const isInit = useRef(true);
  useEffect(() => {
    if (isInit.current) {
      isInit.current = false;
    } else if (!isLoading && !isInit.current) {
      dispatch(
        updateSolde({
          solde_initial: soldeInitial,
          solde_actuel:
            Number(soldeInitial) +
            caisses.reduce((partialSum, a) => partialSum + Number(a.recette), 0) -
            caisses.reduce((partialSum, a) => partialSum + Number(a.depense), 0)
        })
      );
    }
  }, [caisses]);

  return (
    <Card>
      <CardHeader title="Solde de la caisse" />
      <CardContent>
        <Stack direction="column" spacing={3}>
          <Stack direction="row" spacing={2} align="end" justify="end">
            <CurrencyTextField
              label="Solde initial"
              variant="standard"
              value={soldeInitial}
              currencySymbol="Ar"
              placeholder="Solde initial"
              outputFormat="number"
              decimalCharacter=","
              digitGroupSeparator=" "
              decimalPlaces={0}
              onChange={(event, value) => setTempValue(value)}
            />
            <Tooltip title="Mettre à jour">
              <IconButton color="primary" size="large" onClick={updateSoldeFrom}>
                <SyncIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Box>
            <Typography variant="overline">Solde actuel</Typography>
            <br />
            <Typography variant="overline" gutterBottom sx={{ fontWeight: 'bold', fontSize: 'large' }}>
              {fNumber(soldeActuel)} Ar
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
