import { merge } from 'lodash';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField, Stack } from '@material-ui/core';
//
import { useSelector, useDispatch } from 'react-redux';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import { BaseOptionChart } from '../../charts';
import JournPick from './motoJournPick';
import { getMotosHebdo } from '../../../redux/slices/moto';
// ----------------------------------------------------------------------

export default function MotoDashboardJourn() {
  const [seriesData, setSeriesData] = useState('Year');
  const [select, setSelect] = useState('Hebdomadaire');

  const dispatch = useDispatch();

  useEffect(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
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

  const motosHebdo = useSelector((state) => state.motos.motosHebdo);
  console.log(`motosHebdo`, motosHebdo);

  const handleChangeSeriesData = (event) => {
    setSeriesData(event.target.value);
    setSelect(event.target.value);
  };

  const CHART_DATA = [
    {
      year: 'Hebdomadaire',
      data: { name: 'Nombre', data: motosHebdo.nb }
    },
    {
      year: 'Mensuelle',
      data: { name: 'Nombre', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] }
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories:
        select === 'Hebdomadaire' &&
        motosHebdo.date.forEach((date) =>
          new Date(date).toLocaleDateString('fr-fr', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        )
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val}`
      }
    }
  });

  return (
    <Card>
      <CardHeader
        title="Vente journalière"
        subheader="En cours..."
        action={
          <Stack spacing={1} direction="row" alignItems="center">
            <JournPick select={select} />
            <TextField
              select
              fullWidth
              value={seriesData}
              SelectProps={{ native: true }}
              onChange={handleChangeSeriesData}
              sx={{
                '& fieldset': { border: '0 !important' },
                '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
                '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
                '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
              }}
            >
              {CHART_DATA.map((option) => (
                <option key={option.year} value={option.year}>
                  {option.year}
                </option>
              ))}
            </TextField>
          </Stack>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="bar" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
