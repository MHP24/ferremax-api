import { IsUUID } from 'class-validator';

export class CartDto {
  @IsUUID()
  cartId: string;
}
