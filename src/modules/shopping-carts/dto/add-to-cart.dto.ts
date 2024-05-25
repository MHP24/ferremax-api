import { Type } from 'class-transformer';
import { ProductCartDto } from './product-cart.dto';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

export class AddToCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductCartDto)
  products: ProductCartDto[];
}
