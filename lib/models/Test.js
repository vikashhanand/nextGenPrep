import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  userId:   { type: String,  required: true },
  subject:  { type: String,  required: true },
  score:    { type: Number,  required: true },
  total:    { type: Number,  required: true },
  accuracy: { type: Number,  required: true },
  date:     { type: String,  required: true },
}, { timestamps: true });

export default mongoose.models.Test || mongoose.model('Test', TestSchema);
