import * as joi from 'joi';

export const productSchema = joi.object({
  productId: joi.string().uuid().required(),
  name: joi.string().required(),
  slug: joi.string().required(),
  price: joi.number().required(),
  stock: joi.number().required(),
  images: joi.array().items(joi.string()).required(),
  description: joi.string().required(),
  keywords: joi.array().items(joi.string()).required(),
  isActive: joi.boolean().required(),
  brandId: joi.string().uuid().required(),
  categoryId: joi.string().uuid().required(),
  createdAt: joi.date().required(),
  updatedAt: joi.date().required(),
});

export const productsValidationSchema = joi
  .array()
  .items(productSchema)
  .required();
