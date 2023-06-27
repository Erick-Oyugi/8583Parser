import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';

export const AccountCreationOneValidation = Joi.object({
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: Joi.string().valid(BankISO.ACCOUNT_CREATING_API_1),
  dataFields: {
    'Processing code': Joi.string(),
    'Amount transaction': Joi.string(),
    'Date and time transmission': Joi.string(),
    'Systems trace audit number': Joi.string(),
    'Time local transaction': Joi.string(),
    'Date local transaction': Joi.string(),
    'Date settlement': Joi.string(),
    'Point of service entry mode': Joi.string(),
    'Function code': Joi.string(),
    'Point of service condition code': Joi.string(),
    'Retrieval reference number': Joi.string(),
    'Authorization identification response': Joi.string(),
    'Card acceptor terminal identification': Joi.string(),
    'Card acceptor identification code': Joi.string(),
    'Additional response data': Joi.string(),
    'Currency code transaction': Joi.string(),
    'Account identification 2': Joi.string(),
    'Reserved for national use': Joi.string(),
    'Phone Number': Joi.string(),
  },
});

export const UpdatedAccountCreationOneValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  documentType: Joi.string().valid('PASSPORT', 'NATIONALID'),
  documentNumber: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  accountType: Joi.string().valid('CURRENT', 'SAVINGS'),
});
