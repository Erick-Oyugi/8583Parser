import * as Joi from 'joi';
export const AccountStatementValidation = Joi.object({
  account: Joi.string(),
  startDate: Joi.string(),
  endDate: Joi.string(),
});
