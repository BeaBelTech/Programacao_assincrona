
const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  idea: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
  createdAt: { type: Date, default: Date.now }
});

VoteSchema.index({ user: 1, idea: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
