const mongoose = require('mongoose');

const cameraPositionSchema = new mongoose.Schema(
  {
    label: { type: String },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    height: { type: Number, required: true },
    heading: { type: Number, default: 0 },
    pitch: { type: Number, default: -30 },
    roll: { type: Number, default: 0 },
    duration: { type: Number, default: 3 },
  },
  { _id: false }
);

const brandingSchema = new mongoose.Schema(
  {
    logoUrl: { type: String },
    secondaryLogoUrl: { type: String },
    primaryColor: { type: String },
    title: { type: String },
  },
  { _id: false }
);

const mapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    navigationMode: {
      type: String,
      enum: ['scroll', 'guided', 'free'],
      default: 'guided',
    },
    allowFreeNavigation: { type: Boolean, default: false },
    cameraPositions: [cameraPositionSchema],
    branding: { type: brandingSchema, default: () => ({}) },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Map', mapSchema);
