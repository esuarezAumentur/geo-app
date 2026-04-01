const { z } = require('zod');

const createTagSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateTagSchema = createTagSchema.partial();

module.exports = { createTagSchema, updateTagSchema };
