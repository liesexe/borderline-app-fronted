import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { makeStyles } from '@mui/styles';
import { createTheme, TextField, ThemeProvider } from '@mui/material';
import { Input } from '../../styles/RedeemStyles';

interface BirthDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  disabled?: boolean;
}

const BirthDatePicker = ({ value, onChange, error, disabled }: BirthDatePickerProps) => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
  
    const whiteTheme = createTheme({
      palette: {
        mode: 'light',
        background: {
          default: '#ffffff',
        },
        text: {
          primary: '#000000',
        },
      },
    });

      return (
        <ThemeProvider theme={whiteTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          value={value}
          onChange={onChange}
          format="dd/MM/yyyy"
          maxDate={maxDate}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={error}
              helperText={error ? 'Fecha inválida' : ''}
              placeholder="Fecha de nacimiento"
              disabled={disabled}
              InputProps={{
                style: { height: '33px', marginBottom: '9px', marginTop: '3px' },
              }}
              InputLabelProps={{
                style: { fontFamily: 'Inter, Roboto, sans-serif' },
              }}
            />
          )}
        />
      </LocalizationProvider>
      </ThemeProvider>
      );
  };

export default BirthDatePicker;