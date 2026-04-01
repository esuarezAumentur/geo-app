const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  isActive: z.boolean().optional(),
});

module.exports = { createUserSchema, updateUserSchema };
