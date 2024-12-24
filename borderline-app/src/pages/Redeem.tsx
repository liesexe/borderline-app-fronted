import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import { format } from 'date-fns';
import {
  FormContainer,
  Input,
  StyledSelect,
  StyledDatePicker,
  CheckboxContainer,
  ErrorMessage
} from '../styles/RedeemStyles';
import { Host } from '../interfaces/Host';
import { HeaderData } from '../interfaces/HeaderData';
import { useLoading } from '../contexts/LoadingContext';
import AppTheme from '../theme/AppTheme';
import { Button, Checkbox, CssBaseline, FormControlLabel, Stack, styled } from '@mui/material';
import ColorModeSelect from '../theme/ColorModeSelect';
import HostSelect from '../components/Select/HostSelectProps';

registerLocale('es', es);
setDefaultLocale('es');

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const Redeem: React.FC = (props: { disableCustomTheme?: boolean }) => {
  const [formData, setFormData] = useState({
    documentNumber: '',
    name: '',
    lastname:'',
    email: '',
    phone: '',    
    birthDate: null as Date | null,
    host: '',
    consent: false
  });

  const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  const [headerError, setHeaderError] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const { setIsLoading } = useLoading();
  const [isSearchingDNI, setIsSearchingDNI] = useState(false);
  const [userFound, setUserFound] = useState(false);

  useEffect(() => {
    const fetchHosts = async () => {
        setIsLoading(true);
      try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
    };

    const response = await fetch('https://borderline-app-backend.onrender.com/api/hosts', {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setHosts(data);
    } catch (error) {
        console.error('Error fetching options:', error);
    } finally{
        setIsLoading(false);
    }
    };

    const fetchHeaderData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('https://borderline-app-backend.onrender.com/api/events/active');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: HeaderData[] = await response.json();
          setHeaderData(data);
        } catch (error) {
          console.error('Error fetching header data:', error);
          setHeaderError('Error cargando la información del formulario');
        } finally {
          setIsLoading(false);
        }
    };

    fetchHeaderData();
    fetchHosts();
  }, []);

  const clearForm = () => {
    setFormData(prev => ({
      ...prev,
      name: '',
      lastname: '',
      email: '',
      phone: '',
      birthDate: null,
      host: '',
      consent: false
    }));
    setUserFound(false);
  };

  const searchUserByDNI = async (dni: string) => {
    setIsSearchingDNI(true);
    try {
      const response = await fetch(`https://borderline-app-backend.onrender.com/api/customers/${dni}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthDate: userData.birthDate ? new Date(userData.birthDate) : null
      }));
      setUserFound(true);
    } catch (error) {
      console.error('Error searching user:', error);
      setUserFound(false);
    } finally {
      setIsSearchingDNI(false);
    }
  };

  const registerClient = async (clientData: typeof formData) => {
    const formattedData = {
      ...clientData,
      birthDate: clientData.birthDate ? format(clientData.birthDate, 'dd/MM/yyyy') : null
    };
    try{
        const response = await fetch('https://borderline-app-backend.onrender.com/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(formattedData)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        
          return await response.json();
    }catch(error){
        console.log('Error registrando cliente:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'documentNumber') {
      if (value.length < 8) {
        clearForm();
      }
      const numericValue = value.replace(/\D/g, '');
      if (numericValue !== value) {
        return;
      }
      if (value.length === 8) {
        searchUserByDNI(value);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const handleDateChange = (
    date: Date | null, 
    event: React.FormEvent<any> | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      birthDate: date
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      consent: e.target.checked
    }));
    if (e.target.checked) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    const fields = ['documentNumber', 'name', 'lastname', 'email', 'phone', 'birthDate', 'host'];
    
    fields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = true;
      }
    });
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  if (!validateForm()) {
    setError('Por favor complete todos los campos obligatorios');
    return;
  }

  if (!formData.consent) {
    setError('Debes aceptar los términos y condiciones');
    return;
  }

  try {
    setIsLoading(true);
    setError('');
    const result = await registerClient(formData);
  } catch (error) {
    console.error('Error registrando cliente:', error);
    setError('Error al registrar cliente. Por favor intente nuevamente.');
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <FormContainer>
              {headerError ? (
            <p>{headerError}</p>
          ) : headerData && headerData.length > 0 ? (
            <>
              <h1>{headerData[0].title}</h1>
              <p>{headerData[0].description}</p>
            </>
          ) : null}
            <form onSubmit={handleSubmit}>
            <Input
                type="text"
                name="documentNumber"
                placeholder="DNI"
                value={formData.documentNumber}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                maxLength={8}
                inputMode="numeric"
                pattern="\d*"
                hasError={validationErrors.documentNumber}
              />
              <Input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                hasError={validationErrors.name}
                disabled={userFound}
              />
              <Input
                type="text"
                name="lastname"
                placeholder="Apellidos"
                value={formData.lastname}
                onChange={handleChange}
                hasError={validationErrors.lastname}
                disabled={userFound}
              />
              <Input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                hasError={validationErrors.email}
                disabled={userFound}
              />
              <Input
                type="text"
                name="phone"
                placeholder="Celular"
                value={formData.phone}
                onChange={handleChange}
                hasError={validationErrors.phone}
                disabled={userFound}
              />
              <StyledDatePicker
                selected={formData.birthDate}
                onChange={handleDateChange}
                placeholderText="Fecha de nacimiento"
                locale="es"
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                dateFormat="dd/MM/yyyy"
                className={validationErrors.birthDate ? 'error' : ''}
                disabled={userFound}
              />
              <HostSelect
              hosts={hosts}
              value={formData.host}
              onChange={(value) => handleChange({
                target: { name: 'host', value }
              } as React.ChangeEvent<HTMLSelectElement>)}
              hasError={validationErrors.host}
              />
            <FormControlLabel
              control={<Checkbox onChange={handleCheckboxChange} checked={formData.consent} name="termsAccepted" value="termsAccepted" color="primary" />}
              label="Acepto los términos y condiciones"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
              <Button 
              type="submit"
              variant="contained"
              fullWidth
              >
              Enviar
              </Button>
            </form>
          </FormContainer>
      </SignInContainer>
    </AppTheme>
  );
};

export default Redeem;
