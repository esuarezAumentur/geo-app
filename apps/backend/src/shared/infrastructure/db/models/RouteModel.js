const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String },
    waypoints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PointOfInterest',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
