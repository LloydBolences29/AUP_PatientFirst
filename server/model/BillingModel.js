const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patientname", required: true },
    department: { type: String, enum: ["Pharmacy", "Dental", "X-ray", "Laboratory", "Consultation"], required: true },
    items: [
      {
        type: { type: String, enum: ["medicine", "procedure", "test", "doctor-fee"], required: true },
        name: { type: String, required: true }, // Medicine name, Service name, Test name
        quantity: { type: Number, default: 1 }, // Quantity for medicine (default 1 for procedures/tests)
        price: { type: Number, required: true }, // Price per unit/item
        total: { type: Number, required: true }, // Auto-calculated: price * quantity
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  }, { timestamps: true });

  BillingSchema.pre("save", function (next) {
    this.items.forEach(item => {
      item.total = item.quantity * item.price;
    });
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
    next();
  });
  

const Billing = mongoose.model("billing", BillingSchema)
module.exports = Billing;