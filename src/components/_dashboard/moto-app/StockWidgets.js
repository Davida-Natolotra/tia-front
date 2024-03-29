import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme } from '@material-ui/core/styles';
import { Card, Typography, Stack, Divider, useMediaQuery } from '@material-ui/core';
// utils
import { useSelector } from 'react-redux';
import { fNumber } from '../../../utils/formatNumber';
import { BaseOptionChart } from '../../charts';
// ----------------------------------------------------------------------

const CHART_SIZE = { width: 106, height: 106 };

export default function BookingCheckInWidgets() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const stock = useSelector((state) => state.motos.stock);

  const TOTAL_CHECK_IN = stock?.depot || 0;
  const TOTAL_CHECK_OUT = stock?.showroom || 0;
  const CHART_DATA_CHECK_IN = [stock?.pDepot || 0];
  const CHART_DATA_CHECK_OUT = [stock?.pShowroom || 0];

  const chartOptionsCheckIn = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    grid: {
      padding: {
        top: -9,
        bottom: -9
      }
    },
    legend: { show: false },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize
          }
        }
      }
    }
  });

  const chartOptionsCheckOut = {
    ...chartOptionsCheckIn,
    colors: [theme.palette.chart.yellow[0]]
  };

  return (
    <Card>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={<Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem />}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          <ReactApexChart type="radialBar" series={CHART_DATA_CHECK_IN} options={chartOptionsCheckIn} {...CHART_SIZE} />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {fNumber(TOTAL_CHECK_IN)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Stock dépot
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          <ReactApexChart
            type="radialBar"
            series={CHART_DATA_CHECK_OUT}
            options={chartOptionsCheckOut}
            {...CHART_SIZE}
          />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {fNumber(TOTAL_CHECK_OUT)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Stock showroom
            </Typography>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}
