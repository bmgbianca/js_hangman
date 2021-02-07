import mongoose from 'mongoose';

const wordSchema = mongoose.Schema({
  word: {
    type: String,
    require: true,
  },
  level: {
    type: String,
    require: false,
  },
  score: {
    type: Number,
    require: false,
  },
});

const wordModel = mongoose.model('words', wordSchema, 'words');

export { wordSchema, wordModel };
