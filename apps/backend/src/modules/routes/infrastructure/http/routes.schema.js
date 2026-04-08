const { z } = require('zod');

const waypointSchema = z.object({
  locationId: z.string().optional().nullable(),
  name: z.string().min(1),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

const createRouteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  waypoints: z.array(waypointSchema).min(2),
  isActive: z.boolean().optional(),
});

const updateRouteSchema = createRouteSchema.partial();

module.exports = { createRouteSchema, updateRouteSchema };
