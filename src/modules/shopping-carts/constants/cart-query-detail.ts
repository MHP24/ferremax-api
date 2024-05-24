export const shoppingCartQueryDetail = {
  include: {
    ShoppingCartItem: {
      include: {
        Product: {
          select: {
            productId: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: true,
            isActive: true,
          },
        },
      },
    },
  },
};
