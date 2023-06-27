import { SetMetadata } from '@nestjs/common';

export const ControllerSetMetadata = () => {
  console.log('NONI NONI');
  return SetMetadata('controllerName', 'BankISO');
};
