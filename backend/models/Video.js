import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId:  { type: String, required: true },
  language: { type: String, default: 'English' },
  url:      { type: String, required: true },
  title:    { type: String, default: 'Untitled Video' },
  thumbnail: { type: String },
  duration:  { type: String },
  shortSummary:    { type: String },
  detailedSummary: { type: String },
  keyPoints:  [{ type: String }],
  timestamps: [{ time: String, seconds: Number, title: String }],
  createdAt:  { type: Date, default: Date.now },
});

// Compound unique index: same video can be cached in multiple languages
videoSchema.index({ videoId: 1, language: 1 }, { unique: true });

export default mongoose.model('Video', videoSchema);
