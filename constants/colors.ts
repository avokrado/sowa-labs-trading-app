export const COLORS = {
  // Primary colors
  primary: '#287979',
  primaryLight: '#3fbebe',
  
  // UI colors
  background: '#ffffff',
  text: {
    primary: '#000000',
    secondary: '#666666',
    error: '#dc2626',
    success: '#16a34a',
  },
  
  // Button colors
  button: {
    background: '#153243',
    disabled: '#27294750',
    text: '#ffffff',
    textDisabled: '#ffffff80',
    error: {
      background: '#ff000020',
      border: '#ff0000',
      text: '#ff0000',
    }
  },
  
  // Chart colors
  chart: {
    line: '#287979',
    area: {
      start: '#3fbebe',
      end: 'rgba(63, 190, 190, 0.2)',
    },
    reference: '#3fbebe',
  },
  
  // Trade list
  tradeList: {
    background: '#F3F3F3',
  },
  
  // Input
  input: {
    background: '#f5f5f5',
    label: '#74cddc',
  }
} as const; 