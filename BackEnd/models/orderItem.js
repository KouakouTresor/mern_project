const mongoose = require("mongoose");
const orderItem = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
      },
})

exports.OrderItem = mongoose.model("orderItem", orderItem)