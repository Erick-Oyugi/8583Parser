import { BankISO } from './bank-iso.type';

export type RestBody = {
  type: string;
  bankIso: BankISO;
  dataFields?: any;
};
