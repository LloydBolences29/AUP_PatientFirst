const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');

const connectDB = async () => {
  try {


    const conn = await mongoose.connect(
      "mongodb+srv://2051068:hindikoalam%4029@cluster0.9whxj.mongodb.net/Patientdb?retryWrites=true&w=majority&appName=Cluster0",

    );

    console.log(`MongoDB connected`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};



module.exports = connectDB;
