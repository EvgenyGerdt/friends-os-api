import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const _logType =
        statusCode.toString().split('')[0] !== '4' ? 'log' : 'warn';

      this.logger[_logType](
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
      this.logger[_logType](
        `${method} ${url} REQUEST: ${JSON.stringify(request.body)}`,
      );
    });

    next();
  }
}
