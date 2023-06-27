import * as Joi from 'joi';

export const UpdatedRtgsValidation = Joi.object({
  amount: Joi.number(),
  accountFrom: Joi.string().length(13),
  accountTo: Joi.string().length(13),
  beneficiaryName: Joi.string().max(999),
  paymentNarrative: Joi.string().max(999),
  swiftCode: Joi.string(),
});
