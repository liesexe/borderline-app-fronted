import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

interface TermAndConditionsProps {
  open: boolean;
  handleClose: () => void;
}

export default function TermAndConditions({ open, handleClose }: TermAndConditionsProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose();
        },
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>TERMINOS Y CONDICIONES</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText component="div" sx={{ whiteSpace: 'pre-line' }}>
          <strong>1. Acceso al Establecimiento</strong>{'\n'}
          1.1. El ingreso está permitido únicamente a mayores de 18 años. Se solicitará un documento de identidad válido para verificar la edad.{'\n'}
          1.2. La discoteca se reserva el derecho de admisión y permanencia.{'\n'}
          1.2. El ingreso gratis con la presentación del QR generado en el sitio es hasta las 22:59 horas salvo eventos especiales donde el establecimiento informará la hora máxima de ingreso gratis.{'\n\n'}

          <strong>2. Comportamiento</strong>{'\n'}
          2.1. No se tolerarán actos de violencia, discriminación, acoso o cualquier conducta inapropiada dentro del establecimiento.{'\n'}
          2.2. El cliente será responsable por cualquier daño causado a las instalaciones o mobiliario de la discoteca.{'\n\n'}

          <strong>3. Consumo de Bebidas</strong>{'\n'}
          3.1. La venta de bebidas alcohólicas está restringida a personas mayores de 18 años.{'\n'}
          3.2. Está prohibido el ingreso con bebidas alcohólicas externas.{'\n\n'}

          <strong>4. Seguridad</strong>{'\n'}
          4.1. Por razones de seguridad, el personal de la discoteca podrá realizar inspecciones en bolsos o mochilas al ingreso.{'\n'}
          4.2. No está permitido el ingreso de objetos peligrosos o sustancias ilícitas.{'\n\n'}

          <strong>5. Responsabilidad</strong>{'\n'}
          5.1. La discoteca no se hace responsable por la pérdida o robo de objetos personales dentro del establecimiento.{'\n'}
          5.2. El cliente deberá respetar las normas de seguridad y evacuación en caso de emergencia.{'\n\n'}

          <strong>6. Derechos de Imagen</strong>{'\n'}
          6.1. Al ingresar, el cliente acepta que la discoteca puede realizar fotografías o videos en el evento, que podrían ser utilizados con fines promocionales.{'\n'}
          6.2. Si el cliente no desea aparecer en material promocional, deberá informar al personal del establecimiento.{'\n\n'}

          <strong>7. Política de Reembolso</strong>{'\n'}
          7.1. No se realizarán reembolsos por entradas adquiridas, salvo cancelación del evento por parte de la discoteca.{'\n\n'}

          <strong>8. Modificaciones</strong>{'\n'}
          8.1. La discoteca se reserva el derecho de modificar estos términos y condiciones en cualquier momento.{'\n\n'}

          <strong>9. Aceptación</strong>{'\n'}
          9.1. Al ingresar al establecimiento, el cliente declara haber leído, entendido y aceptado estos términos y condiciones.{'\n\n'}

          <strong>Discoteca Bellaqueo - Fiestas Bravas</strong>{'\n'}
          <strong>Dirección: Av. Arborización Mz. 142, Pucallpa</strong>{'\n'}
          <strong>Contacto: 941 141 208</strong>{'\n'}
          <strong>Fecha actualización: 1 de enero del 2025</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button variant="contained" onClick={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
