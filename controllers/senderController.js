const Driver = require("../models/driverModel");
const Order = require("../models/orderModel");
const Sender = require("../models/senderModel");
const User = require("../models/userModel");
const cron = require("node-cron");
const moment = require("moment");
const catchAsync = require("../utils/catchAsync");

exports.profile = catchAsync(async (req, res, next) => {
  const UserId = req.user.userId;

  const q = await User.findOne({ _id: UserId }, { password: 0 });

  res.status(200).json({ status: "success", msg: "Profile Gotten", data: q });
});

exports.becomeDriver = catchAsync(async (req, res, next) => {
  const car = req.body.car;
  const userId = req.user.userId;

  const driver = new Driver({
    userId,
    car,
  });
 
  await driver.save()

  await Sender.deleteOne({ userId })
  await User.updateOne({ _id: userId }, { role: "driver" });

  const q = await User.findOne({ _id: userId }, { password: 0 });

  res
    .status(200)
    .json({ status: "success", msg: "New driver Created", data: q });
});

exports.requestOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;
  const location = req.body.location

  const order = new Order({
    location,

  });

  await order.save();

  await Sender.updateOne(
    { _id: userId },
    { $push: { requestOrder: order._id } }
  );

  cron.schedule("*/1 * * * *", async () => {
    const minute = moment().subtract(1, "minute");


    const outdatedOrders = await Order.find({
      orderStatus: { $ne: "accepted" },
      createdAt: { $lte: minute },
    });

    for (const order of outdatedOrders) {
      await User.updateOne(
        { _id: userId },
        { $pull: { requestOrder: order._id } }
      );

      await Order.deleteOne({ _id: order._id });
    }
  });

   const q = await Order.findOne({ _id: order._id })

   res.status(200).json({ status: 'success', msg: "Order requested successfully", data: q })
});
