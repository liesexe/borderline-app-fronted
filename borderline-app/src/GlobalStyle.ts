import styled from 'styled-components';
import { Stack } from '@mui/material';

export const FormContainer = styled(Stack)(({ theme }) => ({
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

export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid ${props => props.hasError ? '#ff0000' : '#ccc'};
  border-radius: 4px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;

  &.error {
    border-color: #ff0000;
  }
`;

export const CheckboxContainer = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;