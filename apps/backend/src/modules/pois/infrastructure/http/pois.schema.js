const { z } = require('zod');

const attachmentSchema = z.object({
  type: z.enum(['image', 'pdf', 'kml', 'other']),
  url: z.string().url(),
  filename: z.string().optional(),
});

const coordinatesSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  height: z.number().optional(),
});

const cameraSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  height: z.number(),
  heading: z.number().optional(),
  pitch: z.number().optional(),
  roll: z.number().optional(),
});

const createPoiSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  coordinates: coordinatesSchema,
  camera: cameraSchema.optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal('')),
  attachments: z.array(attachmentSchema).optional(),
  order: z.number().int().optional(),
  iconUrl: z.string().url().optional().or(z.literal('')),
});

const updatePoiSchema = createPoiSchema.partial();

module.exports = { createPoiSchema, updatePoiSchema };
