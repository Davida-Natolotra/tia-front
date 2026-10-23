import { useSnackbar } from 'notistack5';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Typography, Card, CardHeader, CardContent, Stack, Box } from '@mui/material';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { useSelector, useDispatch } from 'react-redux';
import { getSolde, updateSolde } from '../../redux/slices/caisse';
// utils
import { fNumber } from '../../utils/formatNumber';

// Wait this long after the last change before saving the balance
const SAVE_DELAY_MS = 800;

const toAmount = (value) => Math.round((Number(value) || 0) * 100) / 100;

export default function CaisseSolde() {
  const soldes = useSelector((state) => state.caisseMoto.solde);
  const caisses = useSelector((state) => state.caisseMoto.caisses);
  const isSoldeLoaded = useSelector((state) => state.caisseMoto.isSoldeLoaded);
  const isCaissesLoaded = useSelector((state) => state.caisseMoto.isCaissesLoaded);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // What the user typed; null means "use the saved value"
  const [initialInput, setInitialInput] = useState(null);
  const userEdited = useRef(false);

  useEffect(() => {
    dispatch(getSolde());
  }, [dispatch]);

  const soldeInitial = toAmount(initialInput ?? soldes.solde_initial);

  // Always derived from the current entries, so it is right as soon as the list changes
  const soldeActuel = useMemo(() => {
    const totals = (caisses || []).reduce(
      (acc, caisse) => ({
        recette: acc.recette + toAmount(caisse.recette),
        depense: acc.depense + toAmount(caisse.depense)
      }),
      { recette: 0, depense: 0 }
    );
    return toAmount(soldeInitial + totals.recette - totals.depense);
  }, [caisses, soldeInitial]);

  // Keep the saved balance in sync with what is shown
  useEffect(() => {
    if (!isSoldeLoaded || !isCaissesLoaded) return undefined;

    const isSaved = soldeInitial === toAmount(soldes.solde_initial) && soldeActuel === toAmount(soldes.solde_actuel);
    if (isSaved) return undefined;

    const timer = setTimeout(async () => {
      await dispatch(updateSolde({ solde_initial: soldeInitial, solde_actuel: soldeActuel }));
      if (userEdited.current) {
        userEdited.current = false;
        enqueueSnackbar('Solde mis à jour avec succès', { variant: 'success' });
      }
    }, SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [dispatch, enqueueSnackbar, isSoldeLoaded, isCaissesLoaded, soldeInitial, soldeActuel, soldes]);

  const handleInitialChange = (event, value) => {
    userEdited.current = true;
    setInitialInput(value);
  };

  return (
    <Card>
      <CardHeader title="Solde" />
      <CardContent>
        <Stack direction="column" spacing={3}>
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
            onChange={handleInitialChange}
          />
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
