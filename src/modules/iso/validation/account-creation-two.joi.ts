import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';

export const AccountCreationTwoValidation = Joi.object({
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: Joi.string().valid(BankISO.ACCOUNT_CREATING_API_2),
  dataFields: {
    'Processing code': Joi.string(),
    'Amount transaction': Joi.string(),
    'Date and time transmission': Joi.string(),
    'Systems trace audit number': Joi.string(),
    'Time local transaction': Joi.string(),
    'Date local transaction': Joi.string(),
    'Date settlement': Joi.string(),
    'Authorization identification response': Joi.string(),
    'Card acceptor terminal identification': Joi.string(),
    'Currency code transaction': Joi.string(),
    'Account identification 1': Joi.string(),
  },
});

export const UpdatedAccountCreationTwoValidation = Joi.object({
  key: Joi.string().required(),
  accountType: Joi.string().required().valid('CURRENT', 'SAVINGS'),
});
