import { PrismaService } from '../../../../prisma/prisma.service';
import { addToCart, userCredentialsMock } from '../mocks';

export const resetMocks = async (prismaService: PrismaService) => {
  await prismaService.$transaction([
    prismaService.shoppingCartItem.deleteMany({}),
    prismaService.shoppingCart.deleteMany({}),
    prismaService.productStock.deleteMany({
      where: { stockId: addToCart.productStockMock.stockId },
    }),
    prismaService.product.deleteMany({
      where: { productId: addToCart.productMock.productId },
    }),
    prismaService.productCategory.deleteMany({
      where: { categoryId: addToCart.categoryMock.categoryId },
    }),
    prismaService.branch.deleteMany({
      where: { branchId: addToCart.branchProductMock.branchId },
    }),
    prismaService.productBrand.deleteMany({
      where: { brandId: addToCart.brandMock.brandId },
    }),
    prismaService.logAccess.deleteMany({
      where: { User: { email: userCredentialsMock.email } },
    }),
    prismaService.user.deleteMany({
      where: { email: userCredentialsMock.email },
    }),
  ]);
};
