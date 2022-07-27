import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import personFill from '@iconify/icons-eva/person-fill';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, Typography, Box } from '@material-ui/core';
// utils
import { useSelector, useDispatch } from 'react-redux';
import { fNumber } from '../../../utils/formatNumber';
import { getStock } from '../../../redux/slices/moto';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.darker
}));

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 120,
  height: 120,
  opacity: 0.12,
  position: 'absolute',
  right: theme.spacing(-3),
  color: theme.palette.common.white
}));

// ----------------------------------------------------------------------

export default function AppStockState() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStock());
  }, [dispatch]);

  const TOTAL = useSelector((state) => state.motos.stock);

  return (
    <RootStyle>
      <Box sx={{ ml: 3, color: 'common.white' }}>
        <Typography variant="h4"> {fNumber(TOTAL)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          Stock disponible
        </Typography>
      </Box>
      <IconStyle icon={personFill} />
    </RootStyle>
  );
}
