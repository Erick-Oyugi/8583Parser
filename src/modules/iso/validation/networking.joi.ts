import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';
export const NetworkingValidation = Joi.object({
  type: Joi.string().valid('NETWORK_MANAGEMENT_REQUEST'),
  bankIso: Joi.string().valid(BankISO.NETWORKING),
  dataFields: Joi.object({
    'Date and time transmission': Joi.string(),
    'Systems trace audit number': Joi.string(),
    'Time local transaction': Joi.string(),
    'Date local transaction': Joi.string(),
    'Network management information code': Joi.string(),
  }),
});

export const UpdatedNetworkingValidation = Joi.object({});
