import * as Joi from 'joi';

export const CancelStandingOrder = Joi.object({
  stoId: Joi.string(),
  date: Joi.string().length(8),
});
