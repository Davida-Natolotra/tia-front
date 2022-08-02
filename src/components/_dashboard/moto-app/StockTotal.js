// material
import { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { Card, Typography, Box } from '@material-ui/core';
// utils
import { Icon } from '@iconify/react';
import { useSelector, useDispatch } from 'react-redux';
import personFill from '@iconify/icons-eva/person-fill';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import { getStock } from '../../../redux/slices/moto';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 2, 3)
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

export default function BookingCheckIn() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStock());
  }, []);
  const TOTAL = useSelector((state) => state.motos.stock.number);
  return (
    <RootStyle>
      <div>
        <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Stock disponible
        </Typography>
      </div>
      <Box
        sx={{
          width: 140,
          height: 140,
          lineHeight: 0
        }}
      >
        <IconStyle icon={personFill} />
      </Box>
    </RootStyle>
  );
}
