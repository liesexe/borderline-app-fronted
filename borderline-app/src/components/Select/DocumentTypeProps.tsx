import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { responsiveFontSizes, styled } from '@mui/material/styles';
import { FormHelperText } from '@mui/material';

interface DocumentType {
  code: string;
  description: string;
}

interface DocumentTypeProps extends Omit<SelectProps, 'onChange'> {
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
}

const StyledFormControl = styled(FormControl, {
    shouldForwardProp: (prop) => prop !== 'hasError',
  })<{ hasError?: boolean }>(({ theme, hasError }) => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: hasError ? theme.palette.error.main : theme.palette.divider,
        borderWidth: hasError ? 2 : 1,
        fontSize: 100
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

export default function DocumentTypeSelect({ value, hasError, onChange, ...props }: DocumentTypeProps) {
    const documentTypes: DocumentType[] = [
        {code: 'DNI', description: 'DNI'},
        {code: 'CE', description: 'Cédula de extranjería'},
        {code: 'PA', description: 'Pasaporte'}
    ];

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
          <em>Seleccione tipo documento</em>
        </MenuItem>
        {documentTypes.map((type) => (
          <MenuItem key={type.code} value={type.code}>
            {type.description}
          </MenuItem>
        ))}
      </Select>
      {hasError && (
        <FormHelperText>Este campo es requerido</FormHelperText>
      )}
    </StyledFormControl>
  );
}