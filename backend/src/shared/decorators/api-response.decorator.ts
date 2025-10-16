import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse as SwaggerApiResponse, ApiResponseOptions } from '@nestjs/swagger';
// import { ApiResponse as ApiResponseInterface } from '../interfaces/api-response.interface';

export function ApiResponseDecorator<T>(
  model: Type<T>,
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 200,
      description: 'Successful response',
      type: model,
      ...options,
    }),
  );
}

export function ApiPaginatedResponse<T>(model: Type<T>) {
  return applyDecorators(
    SwaggerApiResponse({
      status: 200,
      description: 'Successful paginated response',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: `#/components/schemas/${model.name}` },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              total: { type: 'number', example: 100 },
              totalPages: { type: 'number', example: 10 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}

export function ApiErrorResponse(status: number, description: string) {
  return applyDecorators(
    SwaggerApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errorCode: { type: 'string' },
          details: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
          path: { type: 'string' },
          method: { type: 'string' },
        },
      },
    }),
  );
}

