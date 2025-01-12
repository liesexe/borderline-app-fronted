import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { alpha, createTheme, outlinedInputClasses, TextField, ThemeProvider } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { brand, gray } from '../../theme/themePrimitives';

interface BirthDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  disabled?: boolean;
  userFound?: boolean;
}

const BirthDatePicker = ({ value, onChange, error, disabled, userFound }: BirthDatePickerProps) => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
  
    /*const whiteTheme = createTheme({
      palette: {
        mode: 'light',
        background: {
          default: '#ffffff',
        },
        text: {
          primary: '#000000',
        },
      },
      components:{
        MuiPickersDay: {
          styleOverrides: {
            root: {
              color: '#fffff',
              borderRadius: '2px',
              borderWidth: '0px',
              borderColor: '#2196f3',
              border: '2px solid',
              backgroundColor: '#fffff',
            }
          }
        },
        MuiCalendarPicker: {
          styleOverrides: {
            root: {
              color: 'black',
              borderRadius: '0px',
              borderWidth: '2px',
              borderColor: '#2196f3',
              border: '2px solid',
              backgroundColor: 'white',
            }
          }
        },
        MuiOutlinedInput: {
          styleOverrides: {
            input: {
              padding: 0,
            },
            root: ({ theme }) => ({
              padding: '8px 12px',
              color: theme.palette.text.primary,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              transition: 'border 120ms ease-in',
              '&:hover': {
                borderColor: gray[400],
              },
              [`&.${outlinedInputClasses.focused}`]: {
                outline: `3px solid ${alpha(brand[500], 0.5)}`,
                borderColor: brand[400],
              },
              ...theme.applyStyles('dark', {
                '&:hover': {
                  borderColor: gray[500],
                },
              }),
              variants: [
                {
                  props: {
                    size: 'small',
                  },
                  style: {
                    height: '2.25rem',
                  },
                },
                {
                  props: {
                    size: 'medium',
                  },
                  style: {
                    height: '2.5rem',
                  },
                },
              ],
            }),
            notchedOutline: {
              border: 'none',
            },
          },
        }
      }
    });*/

      return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <MobileDatePicker
          value={value}
          onChange={onChange}
          format="dd/MM/yyyy"
          maxDate={maxDate}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={error}
              helperText={error ? 'Fecha inválida' : ''}
              placeholder="Fecha de nacimiento"
              disabled={disabled}
              variant='outlined'
              sx={{
                   backgroundColor: "white",
                   border: "1px solid #ccc",
                   borderRadius: "2px",
                   color: "red"
              }}
              inputProps={{
                style: { 
                  color: userFound ? 'black' : 'inherit', 
                  opacity: userFound ? '0.5' : '1',
                  WebkitTextFillColor: userFound ? 'black' : 'inherit',
                },                 
              }}
            />
          )}
        />
      </LocalizationProvider>
      );
  };

export default BirthDatePicker;