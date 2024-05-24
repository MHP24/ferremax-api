import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PaginationDto, SlugParamDto } from '../../common/dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findManyProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('/slug/:slug')
  findBySlug(@Param() slugParamDto: SlugParamDto) {
    return this.productsService.findBySlug(slugParamDto);
  }
}
