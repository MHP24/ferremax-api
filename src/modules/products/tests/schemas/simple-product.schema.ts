import * as joi from 'joi';

export const simpleProductSchema = joi
  .object({
    name: joi.string().required(),
    slug: joi.string().required(),
    price: joi.number().required(),
    images: joi.array().items(joi.string()).required(),
    isActive: joi.boolean().required(),
    stock: joi.number().required(),
  })
  .unknown(true);

export const simpleProductValidationSchema = simpleProductSchema.required();
