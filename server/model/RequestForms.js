const mongoose = require('mongoose');

const formRequestSchema = new mongoose.Schema({
 patientId: {
    type: String, // or Number if you're storing numbers
    required: true,
  },  requestTypes: [{ type: String }],
  purpose: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});


const FormRequest = mongoose.model('FormRequest', formRequestSchema);
module.exports = FormRequest;