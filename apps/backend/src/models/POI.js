const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'pdf', 'kml', 'other'],
      required: true,
    },
    url: { type: String, required: true },
    filename: { type: String },
  },
  { _id: false }
);

const coordinatesSchema = new mongoose.Schema(
  {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    height: { type: Number, default: 0 },
  },
  { _id: false }
);

const cameraSchema = new mongoose.Schema(
  {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    height: { type: Number, required: true },
    heading: { type: Number, default: 0 },
    pitch: { type: Number, default: -30 },
    roll: { type: Number, default: 0 },
  },
  { _id: false }
);

const poiSchema = new mongoose.Schema(
  {
    mapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Map',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    coordinates: { type: coordinatesSchema, required: true },
    camera: { type: cameraSchema },
    googleMapsUrl: { type: String },
    attachments: [attachmentSchema],
    order: { type: Number, default: 0 },
    iconUrl: { type: String },
  },
  { timestamps: true }
);

poiSchema.index({ mapId: 1, order: 1 });

module.exports = mongoose.model('POI', poiSchema);
