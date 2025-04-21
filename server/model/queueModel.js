const mongoose = require('mongoose');

const queueTransactionSchema = new mongoose.Schema({
  queueNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    enum: ['pharmacy', 'cashier', 'lab', 'xray', 'consultation'],
    required: true,
  },
  status: {
    type: String,
    enum: [
      'waiting',
      'waiting-billing',
      'sent-to-cashier',
      'paid',
      'for-dispensing',
      'done',
    ],
    default: 'waiting',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Queue = mongoose.model('QueueTransaction', queueTransactionSchema);
module.exports = Queue;