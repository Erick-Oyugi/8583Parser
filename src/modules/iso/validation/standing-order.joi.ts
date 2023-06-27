import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';
export const StandingOrderValidation = Joi.object({
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: Joi.string().valid(BankISO.STANDING_ORDER_INTERNAL),
  dataFields: {
    'Primary account number (PAN)': Joi.string(),
    'Processing code': Joi.string(),
    'Amount transaction': Joi.string(),
    'Date and time transmission': Joi.string(),
    'Systems trace audit number': Joi.string(),
    'Time local transaction': Joi.string(),
    'Date local transaction': Joi.string(),
    'Date settlement': Joi.string(),
    'Retrieval reference number': Joi.string(),
    'Additional response data': Joi.string(),
    'Account identification 1': Joi.string(),
    'Account identification 2': Joi.string(),
    'Reserved for national use': Joi.string(),
  },
});

export const UpdatedStandingOrderValidation = Joi.object({
  amount: Joi.number(),
  accountFrom: Joi.string().length(13),
  accountTo: Joi.string().length(13),
  frequency: Joi.string().valid('M', 'W'),
  endDate: Joi.string().length(8),
  dateSettlement: Joi.string().length(4),
});
