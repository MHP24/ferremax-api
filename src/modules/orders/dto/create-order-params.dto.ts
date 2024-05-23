import { IsUUID } from 'class-validator';

export class CreateOrderParamsDto {
  @IsUUID()
  cartId: string;
}
