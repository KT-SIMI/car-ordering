const Driver = require("../models/driverModel");
const Order = require("../models/orderModel");
const Sender = require("../models/senderModel");
const User = require("../models/userModel");
const cron = require("node-cron");
const moment = require("moment");
const catchAsync = require("../utils/catchAsync");

exports.profile = catchAsync(async (req, res) => {
  const UserId = req.user.userId;

  const user = await User.findOne({ _id: UserId }, { password: 0 });

  if (user === null) return res.status(401).redirect('/views/login')

  const k = await Sender.findOne({ userId: UserId })

  const userOrders = k.requestOrder

  const orders = []

  for (const userOrder of userOrders) {
    const order = await Order.findOne({ _id: userOrder })

    orders.push(order)
  }

    //   const dateTime = new Date(Date.parse(date))

    // const day = dateTime.getDate()
    // const month = dateTime.toLocaleString('default', { month: 'long' });
    // const year = dateTime.getFullYear();
    // const hours = String(dateTime.getHours()).padStart(2, '0');
    // const minutes = String(dateTime.getMinutes()).padStart(2, '0');

    // const ordinalSuffix = (n) => {
    //   const s = ["th", "st", "nd", "rd"],
    //     v = n % 100;
    //   return n + (s[(v - 20) % 10] || s[v] || s[0]);
    // };

    // const formattedDate = `${ordinalSuffix(day)} of ${month}, ${year} at ${hours}:${minutes}`;

  res.status(200).render("index", { user, orders });
});


exports.becomeDriver = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const driver = new Driver({
    userId,
  });

  await driver.save()

  await Sender.deleteOne({ userId })
  await User.updateOne({ _id: userId }, { role: "driver" });

  res
    .status(403)
    .redirect("/views/driver/addCar");
});


exports.getRequestOrder = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const user = await User.findOne({ _id: userId })

  res.status(200).render("addOrder", { user })

})

exports.requestOrder = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const location = req.body.location

  // const orderEligibility = await Order.findOne({ userId, orderStatus: "pending" })
  // if (orderEligibility)
  //   return res
  //     .status(401)
  //     .redirect("/views/sender/")

  const order = new Order({
    userId,
    location,

  });

  await order.save();

  
  await Sender.updateOne(
    { userId: userId },
    { $push: { requestOrder: order._id } }
  );

  cron.schedule("*/1 * * * *", async () => {
    const minute = moment().subtract(5, "minute").toISOString();
   

    const outdatedOrders = await Order.find({
      orderStatus: { $ne: "accepted" || "rejected" },
      createdAt: { $lte: minute },
    });

    for (const outdatedOrder of outdatedOrders) {
      await Sender.updateOne(
        { userId: userId },
        { $pull: { requestOrder: outdatedOrder._id } }
      );

      await Order.deleteOne({ _id: outdatedOrder._id });
    }
  });


  res.status(200).redirect("/views/sender/")
});

exports.getSingleOrder = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const orderId = req.params.orderId

  const user = await User.findOne({ _id: userId })
  const order = await Order.findOne({ _id: orderId })

  const sender = await User.findOne({ userId: order.userId })
  const driver = await User.findOne({ _id: order.assignDriver })

  res.status(200).render("order", { user, order, sender, driver })


})