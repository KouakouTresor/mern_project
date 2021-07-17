const express = require("express");
const { OrderItem } = require("../models/orderItem");
const { Order } = require("../models/order");
const { Product } = require("../models/products");
const orderRoute = express.Router();

orderRoute.get("/", async (req, res) => {
  const order = await Order.find().populate("user").populate("orderItems");
  if (!order) res.status(404).json("Pas d'ordre");
  res.json(order);
});

orderRoute.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user")
    .populate("orderItems");
  if (!order) res.status(404).json("Pas d'ordre");
  res.json(order);
});

orderRoute.post("/", async (req, res) => {
  const orderItemsResponse = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let orderItemId = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      orderItemId = await orderItemId.save();
      return orderItemId;
    })
  );
  const orderItdResolved = await orderItemsResponse;
 
  const totalPrices = await Promise.all(
    orderItdResolved.map(async (orderItemsId) => {
      const orderProductPrice = await OrderItem.findById(orderItemsId).populate(
        'product',
        'price'
      );
      const totalPrice =
        orderProductPrice.product.price * orderProductPrice.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  if (!orderItdResolved) {
    res.status(400).json("Aucunne commande");
  } else {
    let order = new Order({
      orderItems: orderItdResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
      dateOrdered: req.body.dateOrdered,
    });

    order = await order.save();
    if (!order) res.json("Resseyer");
    res.json(order);
  }
});

orderRoute.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ succes: true, messagge: "Le commande a été supprimer" });
      } else {
        return res.status(200).json({
          succes: false,
          messagge: "Le commande n'a pas été trouvé",
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        success: false,
        error: err,
      });
    });
});

module.exports = orderRoute;
