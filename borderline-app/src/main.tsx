import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import './index.css';
import { LoadingProvider } from './contexts/LoadingContext';
import AppTheme from './theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppTheme>
      <CssBaseline enableColorScheme />
        <LoadingProvider>
          <AppRoutes />
        </LoadingProvider>
      <CssBaseline enableColorScheme />
    </AppTheme>
  </React.StrictMode>
);
