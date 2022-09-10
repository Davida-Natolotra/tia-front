import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
import { fr as frLocale } from 'date-fns/locale';
import { frFR as calFR } from '@mui/x-date-pickers';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { MonthPicker } from '@mui/x-date-pickers/MonthPicker';
import { YearPicker } from '@mui/x-date-pickers/YearPicker';
import { Grid, Tooltip, Card, CardHeader, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getMotosHebdo, getMotosMonthly } from '../../../redux/slices/moto';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay'
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark
    }
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  })
}));

const minDate = new Date('2020-01-01T00:00:00.000');
const maxDate = new Date('2030-01-01T00:00:00.000');

export default function CustomDay({ select }) {
  const [value, setValue] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState([
    new Date(startOfWeek(value, { weekStartsOn: 1 })).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }),
    new Date(endOfWeek(value, { weekStartsOn: 1 })).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  ]);
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      dispatch(getMotosHebdo(range[0], range[1]));
    }
  }, [range]);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      dispatch(getMotosMonthly(date));
    }
  }, [date]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    const start = startOfWeek(value, { weekStartsOn: 1 });
    const end = endOfWeek(value, { weekStartsOn: 1 });

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(date, start);
    const isLastDay = isSameDay(date, end);

    const newRange = [
      new Date(start).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }),
      new Date(end).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      })
    ];

    const compareArrays = (array1, array2) =>
      array1.length === array2.length && array1.every((el) => array2.includes(el));

    if (!compareArrays(range, newRange)) {
      setRange(newRange);
    }

    if (!value) {
      return <PickersDay {...pickersDayProps} />;
    }
    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <div>
      <Tooltip title="Calendrier">
        <IconButton aria-describedby={id} variant="contained" onClick={handleClick} size="small" tooltips="Calendrier">
          <DateRangeIcon />
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{ width: '90%' }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={frLocale}
          localeText={calFR.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          {select === 'Hebdomadaire' ? (
            <StaticDatePicker
              label="Week picker"
              displayStaticWrapperAs="desktop"
              value={value}
              views={['year', 'month', 'day']}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderDay={renderWeekPickerDay}
              renderInput={(params) => <TextField {...params} />}
              inputFormat="'Week of' MMM d"
              disableFuture
            />
          ) : (
            <Card>
              <CardHeader
                title="Calendrier mensuel"
                subheader="Mois - Année"
                action={
                  <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MonthPicker
                      date={date}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(newDate) => setDate(newDate)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <YearPicker
                      date={date}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(newDate) => setDate(newDate)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </LocalizationProvider>
      </Popover>
    </div>
  );
}
