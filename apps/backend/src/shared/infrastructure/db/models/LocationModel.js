const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const pointOfInterestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Model3D',
    },
    coordinates: { type: coordinatesSchema, required: true },
    url: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PointOfInterest', pointOfInterestSchema);
