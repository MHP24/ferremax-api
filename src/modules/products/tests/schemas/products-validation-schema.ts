import * as joi from 'joi';
import { productSchema } from './product-schema';

export const productsValidationSchema = joi
  .array()
  .items(productSchema)
  .required();
