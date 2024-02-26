const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
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
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
