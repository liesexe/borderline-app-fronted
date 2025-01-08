import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  FormContainer,
  Input,
  ErrorMessage
} from '../styles/RedeemStyles';
import { Host } from '../interfaces/Host';
import { HeaderData } from '../interfaces/HeaderData';
import { useLoading } from '../contexts/LoadingContext';
import AppTheme from '../theme/AppTheme';
import { Box, Button, Checkbox, CssBaseline, FormControl, FormControlLabel, FormLabel, Link, Stack, styled, TextField, Typography } from '@mui/material';
import ColorModeSelect from '../theme/ColorModeSelect';
import HostSelect from '../components/Select/HostSelectProps';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BirthDatePicker from '../components/DatePicker/BirthDatePickerProps';
import MuiCard from '@mui/material/Card';
import TermAndConditions from '../components/TermAndConditions/TermAndConditions';
import DocumentTypeSelect from '../components/Select/DocumentTypeProps';

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

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '110%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  maxHeight: '90vh',
  overflowY: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '500px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const defaultHeaderData = {
  title: 'FIESTAS BRAVAS',
  description: 'Obtén tu entrada gratis a la mejor fiesta de la ciudad',
};

const Redeem: React.FC = (props: { disableCustomTheme?: boolean }) => {
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    name: '',
    lastname:'',
    email: '',
    phone: '',    
    birthDate: null as Date | null,
    host: '',
    consent: false
  });
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  const [headerError, setHeaderError] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const { setIsLoading } = useLoading();
  const [isSearchingDNI, setIsSearchingDNI] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [searchParams] = useSearchParams();
  const hostParam = searchParams.get('host');
  const [isValidHost, setIsValidHost] = useState(false);
  const [open, setOpen] = React.useState(false);

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

    const data: Host[] = await response.json();
    setHosts(data);
    return data;
    } catch (error) {
        console.error('Error fetching options:', error);
        return [];
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

    const fetchData = async () => {
      try {
        await fetchHeaderData();
        const fetchedHosts = await fetchHosts();
        
        if (hostParam && fetchedHosts) {
          const selectedHost = fetchedHosts.find(
            host => host.alias?.toUpperCase() === hostParam.toUpperCase()
          );
          
          if (selectedHost) {
            setFormData(prev => ({
              ...prev,
              host: selectedHost._id
            }));
            setIsValidHost(true);
          }else{
            navigate('/redeem');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchHeaderData();
    fetchHosts();
    fetchData();
  }, [hostParam, navigate]);

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

  const searchUserByDocumentTypeAndDocumentNumber = async (documentType: string, documentNumber: string) => {
    setIsSearchingDNI(true);
    try {
      const response = await fetch(`https://borderline-app-backend.onrender.com/api/customers/${documentType}/${documentNumber}`);
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

    if (name === 'documentType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        documentNumber: '',
      }));
      setValidationErrors(prev => ({
        ...prev,
        documentNumber: false,
      }));
      return;
    }

    if (name === 'documentNumber') {
      let isValid = false;
      let minLength = 0;
      let maxLength = 0;
  
      switch (formData.documentType) {
        case 'DNI':
          minLength = 8;
          maxLength = 8;
          isValid = /^\d{8}$/.test(value);
          break;
        case 'PA':
          minLength = 9;
          maxLength = 12;
          isValid = /^[a-zA-Z0-9]{9,12}$/.test(value);
          break;
        case 'CE':
          minLength = 8;
          maxLength = 12;
          isValid = /^[a-zA-Z0-9]{8,12}$/.test(value);
          break;
        default:
          break;
      }
  
      if (value.length > maxLength) {
        return;
      }
  
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
  
      if (isValid) {
        searchUserByDocumentTypeAndDocumentNumber(formData.documentType, value);
      }
  
      setValidationErrors(prev => ({
        ...prev,
        [name]: !isValid,
      }));
      return;
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
    const fields = ['documentType', 'documentNumber', 'name', 'lastname', 'email', 'phone', 'birthDate'];
    
    fields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = true;
      }
    });  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (formData.documentType === 'DNI' && !/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
      e.preventDefault();
    }
    if ((formData.documentType === 'PA' || formData.documentType === 'CE') && !/[a-zA-Z0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
        <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {headerData.length > 0 ? headerData[0].title : defaultHeaderData.title}
          </Typography>
          <Typography
            component="p"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 1.15rem)' }}
          >
            {headerData.length > 0 ? headerData[0].description : defaultHeaderData.description}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
          <FormControl>
          <FormLabel htmlFor="documentType">Tipo de documento</FormLabel>
            <DocumentTypeSelect
                value={formData.documentType}
                onChange={(value) => handleChange({
                  target: { name: 'documentType', value }
                } as React.ChangeEvent<HTMLSelectElement>)}
                hasError={validationErrors.documentType}
            />
          </FormControl>
          <FormControl>
              <FormLabel htmlFor="documentNumber">Número de documento</FormLabel>
              <TextField
                error={validationErrors.documentNumber}
                id="documentNumber"
                type="text"
                name="documentNumber"
                placeholder="Número de documento"
                autoComplete="documentNumber"
                autoFocus
                inputProps={{ maxLength: formData.documentType === 'DNI' ? 8 : 12 }}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                required
                fullWidth
                variant="outlined"
                color={validationErrors.documentNumber ? 'error' : 'primary'}
              />
          </FormControl>
          <FormControl>
              <FormLabel htmlFor="name">Nombres</FormLabel>
              <TextField
                error={validationErrors.name}
                id="name"
                type="text"
                name="name"
                placeholder="Nombre"
                autoComplete="name"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={validationErrors.name ? 'error' : 'primary'}
                onChange={handleChange}
                disabled={userFound}
                value={formData.name}
              />
          </FormControl>
          <FormControl>
              <FormLabel htmlFor="lastname">Apellidos</FormLabel>
              <TextField
                error={validationErrors.lastname}
                id="lastname"
                type="text"
                name="lastname"
                placeholder="Apellidos"
                autoComplete="lastname"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={validationErrors.lastname ? 'error' : 'primary'}
                onChange={handleChange}
                disabled={userFound}
                value={formData.lastname}
              />
          </FormControl>
          <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={validationErrors.email}
                id="email"
                type="email"
                name="email"
                placeholder="correo@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={validationErrors.email ? 'error' : 'primary'}
                disabled={userFound}
                onChange={handleChange}
                value={formData.email}
              />
          </FormControl>
          <FormControl>
          <FormLabel htmlFor="phone">Celular</FormLabel>
              <TextField
                error={validationErrors.phone}
                id="phone"
                type="phone"
                name="phone"
                placeholder="987654321"
                autoComplete="phone"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={validationErrors.phone ? 'error' : 'primary'}
                disabled={userFound}
                onChange={handleChange}
                value={formData.phone}
              />
          </FormControl>
          <FormControl>
          <FormLabel htmlFor="birthDate">Fecha de nacimiento</FormLabel>
            <BirthDatePicker
                value={formData.birthDate}
                onChange={(date) => handleDateChange(date, undefined)}
                error={validationErrors.birthDate}
                disabled={userFound}
              />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="host">Promotor(a)</FormLabel>
            <HostSelect
                hosts={hosts}
                value={formData.host}
                onChange={(value) => handleChange({
                  target: { name: 'host', value }
                } as React.ChangeEvent<HTMLSelectElement>)}
                hasError={validationErrors.host}
                disabled={isValidHost}
                />
          </FormControl>
          <TermAndConditions open={open} handleClose={handleClose} />
          <FormControlLabel
              control={<Checkbox value="termsAccepted" color="primary" onChange={handleCheckboxChange} name="termsAccepted" checked={formData.consent}/>}
              label={
                <Typography sx={{ textAlign: 'center' }}>
              Acepto los {' '}
              <Link
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
              >
                términos y condiciones
              </Link>
            </Typography>
              }
            />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Enviar
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
};

export default Redeem;
