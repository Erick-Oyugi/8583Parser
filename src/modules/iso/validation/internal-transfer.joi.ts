import * as Joi from 'joi';
import { BankISO } from '../../../types/bank-iso.type';

export const UpdatedInternalTransferValidation = Joi.object({
  amount: Joi.number(),
  paymentNarrative: Joi.string().max(999),
  accountFrom: Joi.string().length(13),
  accountTo: Joi.string().length(13),
});
