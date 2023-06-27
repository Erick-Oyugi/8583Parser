import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';
export const ForexValidation = Joi.object({
  type: Joi.string().valid('ACQUIRER_FINANCIAL_REQUEST'),
  bankIso: Joi.string().valid(BankISO.FOREX),
  dataFields: {
    account: Joi.string().length(13),
    phone: Joi.string().length(12),
    'Date and time transmission': Joi.string(),
    'Systems trace audit number': Joi.string(),
    'Time local transaction': Joi.string(),
    'Date local transaction': Joi.string(),
    'Date settlement': Joi.string(),
    'Retrieval reference number': Joi.string(),
    'Authorization identification response': Joi.string(),
    'Card acceptor terminal identification': Joi.string(),
    'Currency code transaction': Joi.string(),
    'Account identification 1': Joi.string(),
  },
});

export const UpdatedForexValidation = Joi.object({
  account: Joi.string().length(13),
});
