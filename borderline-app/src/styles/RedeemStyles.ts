import styled from 'styled-components';
import DatePicker from "react-datepicker";
import { Stack } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

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

export const StyledDatePicker = styled(DatePicker)`
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