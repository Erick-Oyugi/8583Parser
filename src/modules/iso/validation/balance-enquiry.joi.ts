import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';

export const BalanceEnquiryValidation = Joi.object({
  type: Joi.string().valid('ACQUIRER_FINANCIAL_REQUEST'),
  bankIso: Joi.string().valid(BankISO.BALANCE_ENQUIRY),
  dataFields: {
    'Processing code': Joi.string(),
    'Date and time transmission': Joi.string(),
    'Systems trace audit number': Joi.string(),
    'Time local transaction': Joi.string(),
    'Date local transaction': Joi.string(),
    'Date settlement': Joi.string(),
    'Retrieval reference number': Joi.string(),
    'Authorization identification response': Joi.string(),
    'Card acceptor terminal identification': Joi.string(),
    'Card acceptor identification code': Joi.string(),
    'Currency code transaction': Joi.string(),
    'Account identification 1': Joi.string(),
  },
});

export const UpdatedBalanceEnquiryValidation = Joi.object({
  account: Joi.string().length(13),
});
