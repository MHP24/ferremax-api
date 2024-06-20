export const validUserIdMock = 'f65fc959-225a-4817-8867-8b9d98f6b092';
export const invalidUserIdMock = 'invalid-id';

export const getMyShoppingCartMock = {
  [validUserIdMock]: {
    dbResponse: {
      cartId: 'ced4380c-fbac-450d-8df5-3ab96a012589',
      userId: 'f65fc959-225a-4817-8867-8b9d98f6b092',
      isActive: true,
      createdAt: '2024-06-16T03:22:01.342Z',
      updatedAt: '2024-06-16T03:22:01.342Z',
      ShoppingCartItem: [
        {
          itemId: '560f147c-dcf3-4b8b-b482-cc5c6df75077',
          productId: '8278ab0e-c71b-4304-9519-402f58bbcde3',
          quantity: 3,
          cartId: 'ced4380c-fbac-450d-8df5-3ab96a012589',
          branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
          createdAt: '2024-06-16T03:21:01.906Z',
          updatedAt: '2024-06-16T03:21:01.906Z',
          Product: {
            productId: '8278ab0e-c71b-4304-9519-402f58bbcde3',
            name: 'Martillo',
            slug: 'martillo',
            price: 20000,
            stock: 150,
            images: ['martillo.jpg'],
            isActive: true,
          },
        },
        {
          itemId: 'cd9f85c4-1a8a-4178-83f0-ff428da8bc49',
          productId: '50486796-9fe9-42e7-90f1-968e0282d3bb',
          quantity: 2,
          cartId: 'ced4380c-fbac-450d-8df5-3ab96a012589',
          branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
          createdAt: '2024-06-16T03:21:01.906Z',
          updatedAt: '2024-06-16T03:21:01.906Z',
          Product: {
            productId: '50486796-9fe9-42e7-90f1-968e0282d3bb',
            name: 'Destornillador',
            slug: 'destornillador',
            price: 15000,
            stock: 300,
            images: ['destornillador.jpg'],
            isActive: true,
          },
        },
      ],
    },
    serviceResponse: {
      cartId: 'ced4380c-fbac-450d-8df5-3ab96a012589',
      userId: 'f65fc959-225a-4817-8867-8b9d98f6b092',
      isActive: true,
      createdAt: '2024-06-16T03:22:01.342Z',
      updatedAt: '2024-06-16T03:22:01.342Z',
      items: [
        {
          itemId: '560f147c-dcf3-4b8b-b482-cc5c6df75077',
          branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
          quantity: 3,
          product: {
            productId: '8278ab0e-c71b-4304-9519-402f58bbcde3',
            name: 'Martillo',
            slug: 'martillo',
            price: 20000,
            stock: 150,
            images: ['martillo.jpg'],
            isActive: true,
          },
        },
        {
          itemId: 'cd9f85c4-1a8a-4178-83f0-ff428da8bc49',
          branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
          quantity: 2,
          product: {
            productId: '50486796-9fe9-42e7-90f1-968e0282d3bb',
            name: 'Destornillador',
            slug: 'destornillador',
            price: 15000,
            stock: 300,
            images: ['destornillador.jpg'],
            isActive: true,
          },
        },
      ],
    },
  },
};
