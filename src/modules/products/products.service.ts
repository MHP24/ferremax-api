import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, SlugParamDto } from '../../common/dto';
import { ProductFormatted, TProduct } from './types';
import { formatProduct } from './helpers/format-product';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  // * Find many products (supports pagination)
  async findAll(paginationDto: PaginationDto) {
    // * Pages and last page calc
    const totalPages = await this.prismaService.product.count({});
    const { page, limit } = paginationDto;
    const lastPage = Math.ceil(totalPages / limit);

    // * Products with all info
    const products = await this.prismaService.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        name: true,
        slug: true,
        price: true,
        images: true,
        isActive: true,
        stock: true,
      },
    });

    // * pagination metadata and products info
    return {
      data: products,
      meta: {
        page,
        results: products.length,
        total: totalPages,
        lastPage,
      },
    };
  }

  async findBySlug({ slug }: SlugParamDto): Promise<ProductFormatted> {
    const product: TProduct = await this.prismaService.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      select: {
        productId: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        images: true,
        description: true,
        keywords: true,
        ProductBrand: {
          select: {
            name: true,
          },
        },
        ProductCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product: ${slug} not found`);
    }

    return formatProduct(product);
  }

  // * Find many products by id as array of ids arg
  async findManyProductsById(ids: string[]) {
    const products = await this.prismaService.product.findMany({
      where: {
        isActive: true,
        productId: {
          in: ids,
        },
      },
    });

    if (!products.length) {
      throw new NotFoundException('No products found');
    }

    return products;
  }
}
