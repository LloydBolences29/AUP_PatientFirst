const mongoose = require("mongoose");

const icdSchema = new mongoose.Schema({
  code: String,
  shortdescription: String,
  longdescription: String,
  
});

// Create ICD Model
const icdModel = mongoose.model("icdcode", icdSchema)
module.exports = icdModel