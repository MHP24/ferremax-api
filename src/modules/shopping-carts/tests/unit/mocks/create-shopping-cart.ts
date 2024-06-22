import { ValidRoles } from '@prisma/client';

export const createCartUserIdMock = '16af0aed-7ce3-4f28-a35a-d1b23a289b43';
export const createCartUserMock = {
  id: createCartUserIdMock,
  email: 'newuser@mail.com',
  roles: [ValidRoles.user],
};

const cartId = '97dd01e4-5a73-4e60-9763-21ce43a82816';
export const createShoppingCartMock = {
  [createCartUserIdMock]: {
    dbResponse: {
      cartId,
      userId: [createCartUserIdMock],
      isActive: true,
      createdAt: new Date('2024-06-20T14:12:06.088Z'),
      updatedAt: new Date('2024-06-20T14:12:06.088Z'),
    },
    serviceResponse: {
      cartId: cartId,
      message: 'Shopping cart created successfully',
    },
  },
};
