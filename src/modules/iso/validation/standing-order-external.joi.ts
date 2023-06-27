import * as Joi from 'joi';

export const ExternalStandingOrderValidation = Joi.object({
  amount: Joi.number(),
  accountFrom: Joi.string().length(13),
  accountTo: Joi.string().length(13),
  // phone: Joi.string().length(12),
  frequency: Joi.string().valid('M', 'W'),
  endDate: Joi.string().length(8),
  dateSettlement: Joi.string().length(4),
  sortCode: Joi.string().length(5),
  name: Joi.string(),
});
