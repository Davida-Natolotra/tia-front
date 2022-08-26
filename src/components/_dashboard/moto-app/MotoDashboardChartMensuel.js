import { merge } from 'lodash';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField, Stack } from '@material-ui/core';
//
import startOfWeek from 'date-fns/startOfWeek';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getMotosMonthly } from '../../../redux/slices/moto';

import { BaseOptionChart } from '../../charts';
import JournPick from './motoJournPick';
import useCheckMobile from '../../../hooks/useCheckMobile';
// ----------------------------------------------------------------------

export default function MotoDashboardChartMonth() {
  const motosMonth = useSelector((state) => state.motos.motosMonth);
  const isMobile = useCheckMobile();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMotosMonthly(new Date()));
  }, []);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    plotOptions: {
      bar: { horizontal: isMobile, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: motosMonth.date
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

  const dataSeries = [{ name: 'Vente', data: [...motosMonth.nb] }];
  const total = motosMonth.nb.reduce((partialSum, a) => partialSum + a, 0);

  return (
    <Card>
      <CardHeader
        title="Vente mensuelle"
        subheader={`Total: ${total.toString()} vendus`}
        action={
          <Stack spacing={1} direction="row" alignItems="center">
            <JournPick select="Mensuel" />
          </Stack>
        }
      />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={dataSeries} options={chartOptions} height={isMobile ? 600 : 364} />
      </Box>
    </Card>
  );
}
