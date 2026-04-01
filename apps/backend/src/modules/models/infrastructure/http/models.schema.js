const { z } = require('zod');

const createModelSchema = z.object({
  name: z.string().min(1),
  fileUrl: z.string().optional(),
  filename: z.string().optional(),
  pointOfInterestId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const updateModelSchema = createModelSchema.partial();

module.exports = { createModelSchema, updateModelSchema };
