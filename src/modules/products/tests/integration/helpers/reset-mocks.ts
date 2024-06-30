import { PrismaService } from '../../../../prisma/prisma.service';
import {
  productSlugMock,
  getProductsMock,
  categoryMock,
  slugCategoryMock,
  brandMock,
  slugBrandMock,
} from '../mocks';

export const resetMocks = async (prismaService: PrismaService) => {
  await prismaService.$transaction([
    prismaService.product.deleteMany({
      where: {
        slug: {
          in: [
            productSlugMock.slug,
            ...getProductsMock.map(({ slug }) => slug),
          ],
        },
      },
    }),
    prismaService.productCategory.deleteMany({
      where: {
        categoryId: {
          in: [categoryMock.categoryId, slugCategoryMock.categoryId],
        },
      },
    }),
    prismaService.productBrand.deleteMany({
      where: { brandId: { in: [brandMock.brandId, slugBrandMock.brandId] } },
    }),
  ]);
};
