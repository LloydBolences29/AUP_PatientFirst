// mongodb+srv://2051068:hindikoalam@29@cluster0.9whxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const connectDB = require("./db.js");
const itemModel = require("./model/Item.js");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get("/",  async  (req, res) => {
  const response = await itemModel.find();
  return res.json({items : response});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
