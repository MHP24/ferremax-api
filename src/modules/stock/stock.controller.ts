import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { GetStockBranchesDto } from './dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/stock-branches/:productId')
  getProductStockBranches(@Param() getStockBranchesDto: GetStockBranchesDto) {
    return this.stockService.getProductStockBranches(getStockBranchesDto);
  }
}
