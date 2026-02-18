import { z } from 'zod';
import { User } from '../types/models'; // Sync with client

// Auth schemas
export const signupSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).refine(PasswordUtils.isStrongPassword),
});

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

// Post schema
export const createPostSchema = z.object({
  content: z.string().min(1).max(500),
  imageUrls: z.array(z.string().url()).optional().default([]),
});

// User search
export const uniqueIdSchema = z.string().regex(/^[a-zA-Z0-9]{5,15}$/);

// Advanced Access code
export const accessCodeSchema = z.string().regex(/^d{6}$/);

// Validation middleware helper
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error instanceof z.ZodError ? error.errors : error,
      });
    }
  };
};

// Usage in routes:
// router.post('/signup', validate(signupSchema), authController.signup);