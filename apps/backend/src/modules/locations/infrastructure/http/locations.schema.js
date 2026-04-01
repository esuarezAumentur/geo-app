const { z } = require('zod');

const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const createLocationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  tagId: z.string().optional(),
  modelId: z.string().optional().nullable(),
  coordinates: coordinatesSchema,
  url: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  isVisible: z.boolean().optional(),
});

const updateLocationSchema = createLocationSchema.partial();

module.exports = { createLocationSchema, updateLocationSchema };
