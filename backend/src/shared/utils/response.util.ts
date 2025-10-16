import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || '',
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data,
      message: message || '',
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static error(message: string, errorCode?: string, details?: any): ApiResponse {
    return {
      success: false,
      message,
      errorCode,
      details,
      timestamp: new Date().toISOString(),
    };
  }
}

