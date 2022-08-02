import { merge } from 'lodash';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField, Stack, CardContent } from '@material-ui/core';
//
import { useSelector, useDispatch } from 'react-redux';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import { BaseOptionChart } from '../../charts';
import JournPick from './motoJournPick';
import { getMotosHebdo, setChartSelect, getMotosMonthly } from '../../../redux/slices/moto';
import { styles } from './styles';
// ----------------------------------------------------------------------

export default function MotoDashboardJourn() {
  const [seriesData, setSeriesData] = useState('Year');
  const select = useSelector((state) => state.motos?.chartSelect || 'Hebdomadaire');
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const dispatch = useDispatch();

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
  }, [dispatch]);

  const motosHebdo = useSelector((state) => state.motos.motosHebdo);
  const motosMonth = useSelector((state) => state.motos.motosMonth);
  console.log(`motosHebdo`, motosHebdo);
  const total =
    select === 'Hebdomadaire'
      ? motosHebdo.nb.reduce((partialSum, a) => partialSum + a, 0)
      : motosMonth.nb.reduce((partialSum, a) => partialSum + a, 0);

  const handleChangeSeriesData = (event) => {
    setSeriesData(event.target.value);
    dispatch(setChartSelect(event.target.value));
  };
  console.log('Chart data');
  const CHART_DATA = [
    {
      year: 'Hebdomadaire',
      data: [{ name: 'Nombre', data: [...motosHebdo.nb] }]
    },
    {
      year: 'Mensuelle',
      data: [{ name: 'Nombre', data: [...motosMonth.nb] }]
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: select === 'Hebdomadaire' ? motosHebdo.date : motosMonth.date
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} ${val <= 1 ? 'vendu' : 'vendus'}`
      }
    }
  });

  return (
    <Card>
      <CardHeader
        title={`Vente ${select.toLowerCase()}`}
        subheader={`Total: ${total.toString()} vendus`}
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
      <CardContent>
        {CHART_DATA.map((item) => (
          <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
            {item.year === seriesData && (
              <ReactApexChart
                type="bar"
                series={item.data}
                options={chartOptions}
                height={select === 'Hebdomadaire' ? '200%' : 600}
              />
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
