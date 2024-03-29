import { merge } from 'lodash';
import { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField, Stack } from '@material-ui/core';
//
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getMotosHebdo, setChartSelect, getMotosMonthly } from '../../../redux/slices/moto';
import { BaseOptionChart } from '../../charts';
import JournPick from './motoJournPick';
import useCheckMobile from '../../../hooks/useCheckMobile';
// ----------------------------------------------------------------------

export default function MotoDashboardChartHebdo() {
  const motosHebdo = useSelector((state) => state.motos.motosHebdo);
  const dispatch = useDispatch();
  const isMobile = useCheckMobile();
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });

  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    plotOptions: {
      bar: { horizontal: false, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: motosHebdo.date
    },
    yaxis: {
      labels: {
        formatter: (value) => Number(value).toFixed(0)
      },
      stepSize: 1
    },

    tooltip: {
      y: {
        formatter: (val) => `${val} ${val <= 1 ? 'vendu' : 'vendus'}`
      }
    }
  });

  useEffect(() => {
    dispatch(
      getMotosHebdo(
        start.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }),
        end.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        })
      )
    );
  }, []);

  const dataSeries = [{ name: 'Vente', data: [...motosHebdo.nb] }];
  const total = motosHebdo.nb.reduce((partialSum, a) => partialSum + a, 0);

  return (
    <Card>
      <CardHeader
        title="Vente hebdomadaire"
        subheader={`Total: ${total.toString()} vendus`}
        action={<JournPick select="Hebdomadaire" />}
      />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={dataSeries} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
