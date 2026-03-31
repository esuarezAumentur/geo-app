const { z } = require('zod');

const cameraPositionSchema = z.object({
  label: z.string().optional(),
  longitude: z.number(),
  latitude: z.number(),
  height: z.number(),
  heading: z.number().optional(),
  pitch: z.number().optional(),
  roll: z.number().optional(),
  duration: z.number().optional(),
});

const brandingSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal('')),
  secondaryLogoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  title: z.string().optional(),
});

const createMapSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  navigationMode: z.enum(['scroll', 'guided', 'free']).optional(),
  allowFreeNavigation: z.boolean().optional(),
  cameraPositions: z.array(cameraPositionSchema).optional(),
  branding: brandingSchema.optional(),
});

const updateMapSchema = createMapSchema.partial();

module.exports = { createMapSchema, updateMapSchema };
