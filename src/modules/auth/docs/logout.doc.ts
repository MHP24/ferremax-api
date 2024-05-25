import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export const logoutDocumentation = [
  ApiBearerAuth(),
  ApiOperation({ summary: 'Finish current session' }),
  ApiResponse({
    status: 200,
    description: 'Last session disabled',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            userId: { type: 'string' },
          },
          required: ['message', 'userId'],
        },
      },
    },
  }),
];
