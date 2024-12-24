import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { FormHelperText } from '@mui/material';

interface Host {
  _id: string;
  name: string;
  lastname: string;
}

interface HostSelectProps extends Omit<SelectProps, 'onChange'> {
  hosts: Host[];
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
}

const StyledFormControl = styled(FormControl, {
    shouldForwardProp: (prop) => prop !== 'hasError',
  })<{ hasError?: boolean }>(({ theme, hasError }) => ({
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: hasError ? theme.palette.error.main : theme.palette.divider,
        borderWidth: hasError ? 2 : 1,
      },
      '&:hover fieldset': {
        borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
      }
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.error.main,
      marginLeft: 0
    }
  }));

export default function HostSelect({ hosts, value, hasError, onChange, ...props }: HostSelectProps) {
  return (
    <StyledFormControl fullWidth error={hasError}>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value as string)}
        displayEmpty
        error={hasError}
        {...props}
      >
        <MenuItem value="" disabled>
          <em>Selecciona anfitrion(a)</em>
        </MenuItem>
        {hosts.map((host) => (
          <MenuItem key={host._id} value={host._id}>
            {host.name} {host.lastname}
          </MenuItem>
        ))}
      </Select>
      {hasError && (
        <FormHelperText>Este campo es requerido</FormHelperText>
      )}
    </StyledFormControl>
  );
}