const mongoose = require('mongoose');

const queueCounterSchema = new mongoose.Schema({
  department: {
    type: String,
    enum: ['pharmacy', 'cashier', 'lab', 'xray', 'consultation'],
    required: true,
  },
  nextQueueNumber: {
    type: Number,
    required: true,
    default: 1,
  },
});

const QueueCounter = mongoose.model('QueueCounter', queueCounterSchema);
module.exports = QueueCounter;
