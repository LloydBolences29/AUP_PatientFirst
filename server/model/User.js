const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  role_ID: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true},
  role: { type: String, required: true, enum: ['Admin', 'Doctor', 'Nurse', 'Medical Record Officer ','Cashier','Pharmacist']},
}, { timestamps: true });



const User = mongoose.model("user", UserSchema);
module.exports = User;