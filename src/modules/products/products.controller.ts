import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PaginationDto } from '../../common/dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findManyProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
}
