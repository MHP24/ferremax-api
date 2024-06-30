import { IsUUID } from 'class-validator';

export class GetStockBranchesDto {
  @IsUUID()
  productId: string;
}
