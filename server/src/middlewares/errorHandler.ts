import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface ApiError extends Error {
  statusCode?: number;
  success?: boolean;
}

export const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err.message, { stack: err.stack, url: req.originalUrl });

  const statusCode = err.statusCode || 500;
  const success = statusCode < 400;

  res.status(statusCode).json({
    success,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    error: err.message || 'Internal Server Error',
  });
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};

// Async wrapper for controllers
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  Promise.resolve(fn(req, res, next)).catch(next);