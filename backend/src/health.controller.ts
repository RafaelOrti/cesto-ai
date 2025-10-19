import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'cesto-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get()
  getRoot() {
    return {
      message: 'Cesto AI Backend API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
        api: '/api/v1',
        docs: '/api/docs',
      },
    };
  }
}

