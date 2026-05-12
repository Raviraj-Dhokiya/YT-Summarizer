import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  title: { type: String, default: 'Untitled Video' },
  thumbnail: { type: String },
  duration: { type: String },
  shortSummary: { type: String },
  detailedSummary: { type: String },
  keyPoints: [{ type: String }],
  timestamps: [
    {
      time: String,
      seconds: Number,
      title: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Video', videoSchema);
