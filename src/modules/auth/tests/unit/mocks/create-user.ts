export const createUserMock = {
  email: 'newuser@mail.com',
  password: 'password12345',
};

export const dbCreateUserMock = {
  id: '44277448-4dfa-4998-a6b5-235053496327',
  email: 'newuser@mail.com',
  password: '$2b$10$02rQ978shyd7PSP04zfEvuqEKQ9Ce/ed7qHH5BfPEKjvmAu0y15de',
  roles: ['user'],
  isActive: true,
  sessionId: null,
  branchId: null,
  createdAt: '2024-06-16T03:22:25.290Z',
  lastAccess: null,
};

export const userServiceMock = {
  user: {
    id: '44277448-4dfa-4998-a6b5-235053496327',
    email: 'newuser@mail.com',
    roles: ['user'],
  },
};
