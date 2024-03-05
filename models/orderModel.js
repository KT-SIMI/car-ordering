const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  location: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    default: "pending",
  },
  assignDriver: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
