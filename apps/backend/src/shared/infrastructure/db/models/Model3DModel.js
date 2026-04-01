const mongoose = require('mongoose');

const model3DSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: { type: String },
    filename: { type: String },
    pointOfInterestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PointOfInterest',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Model3D', model3DSchema);
