import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PaginationDto, SlugDto } from '../../common/dto';
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from '../../common/swagger/decorators';
import {
  getAllProductsDocumentation,
  getProductBySlugDocumentation,
} from './docs';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Swagger(getAllProductsDocumentation)
  findManyProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('/slug/:slug')
  @Swagger(getProductBySlugDocumentation)
  findBySlug(@Param() slugParamDto: SlugDto) {
    return this.productsService.findBySlug(slugParamDto);
  }
}
