import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import personFill from '@iconify/icons-eva/person-fill';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, Typography, Box } from '@material-ui/core';
// utils
import { useSelector, useDispatch } from 'react-redux';
import { getLastBL } from '../../../redux/slices/moto';
import { fNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  padding: theme.spacing(3),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 120,
  height: 120,
  opacity: 0.12,
  position: 'absolute',
  right: theme.spacing(-3),
  color: theme.palette.common.warning
}));

// ----------------------------------------------------------------------

export default function AppLastBL() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLastBL());
  }, [dispatch]);
  const TOTAL = useSelector((state) => state.motos.lastBL);
  return (
    <RootStyle>
      <Box sx={{ ml: 3 }}>
        <Typography variant="h4"> {fNumber(TOTAL)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          Dernier BL
        </Typography>
      </Box>
      <IconStyle icon={personFill} />
    </RootStyle>
  );
}
