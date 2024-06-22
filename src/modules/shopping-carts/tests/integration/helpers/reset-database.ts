import { PrismaService } from '../../../../../modules/prisma/prisma.service';

export const resetDatabase = async (prismaService: PrismaService) => {
  await prismaService.$transaction([
    // * Delete transaction
    prismaService.logAccess.deleteMany({}),
    prismaService.orderItem.deleteMany({}),
    prismaService.order.deleteMany({}),
    prismaService.shoppingCartItem.deleteMany({}),
    prismaService.shoppingCart.deleteMany({}),
    prismaService.user.deleteMany({}),
    prismaService.productStock.deleteMany({}),
    prismaService.productPriceHistory.deleteMany({}),
    prismaService.product.deleteMany({}),
    prismaService.productBrand.deleteMany({}),
    prismaService.productCategory.deleteMany({}),
    prismaService.branch.deleteMany({}),
  ]);
};
