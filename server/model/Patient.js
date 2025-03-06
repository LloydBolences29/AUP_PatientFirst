const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  patientID: String,
  name: String,
  gender: String,
  age: Number,
})

const patientModel = mongoose.model('patientname', UserSchema)
module.exports = patientModel