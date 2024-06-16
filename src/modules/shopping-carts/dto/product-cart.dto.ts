import { IsPositive, IsUUID } from 'class-validator';

export class ProductCartDto {
  @IsUUID()
  productId: string;

  @IsPositive()
  quantity: number;

  @IsUUID()
  branchId: string;
}
