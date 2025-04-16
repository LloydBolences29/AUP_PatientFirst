const mongoose = require('mongoose');

const LaboratoryTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Hematology',
      'Blood Chemistry & Immunology',
      'Test Package',
      'Other'
    ]
  },
  isPackage: {
    type: Boolean,
    default: false
  },
  includedTests: {
    type: [String], // Array of test names
    default: undefined, // will not appear if empty
    required: function () {
      return this.isPackage === true;
    }
  }
}, { timestamps: true });

const labtest = mongoose.model('labTest', LaboratoryTestSchema, 'labTests');
module.exports = labtest;