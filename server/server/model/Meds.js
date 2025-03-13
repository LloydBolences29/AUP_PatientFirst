const mongoose = require("mongoose");

const MedsSchema = new mongoose.Schema(
  {
    //for the list of medicines
    name: String,
    //for the list of medicines
    description: String,
    //for the list of medicines
    price: Number,
    //for the list of medicines
    quantity: Number,
    //for the list of medicines
    //no image
    //for the list of medicines
  },
  {
    timestamps: true,
  }
);
