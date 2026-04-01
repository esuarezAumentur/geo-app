const { z } = require('zod');

const createRouteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  waypoints: z.array(z.string()).min(2),
  isActive: z.boolean().optional(),
});

const updateRouteSchema = createRouteSchema.partial();

module.exports = { createRouteSchema, updateRouteSchema };
