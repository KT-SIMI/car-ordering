const Driver = require("../models/driverModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.profile = catchAsync(async (req, res) => {
    const UserId = req.user.userId;

    const user = await User.findOne({ _id: UserId }, { password: 0 });

    if (user === null) return res.status(401).redirect("/views/login");

    const driver = await Driver.findOne({ userId: UserId });
    const rOrders = driver.rejectOrder;
    const aOrders = driver.acceptOrder;

    const rejectedOrders = [];
    console.log(rejectedOrders)
    const acceptedOrders = [];

    for (const rOrder of rOrders) {
        const rejectOrder = await Order.findOne({ _id: rOrder })

        rejectedOrders.push(rejectOrder)
    }

    for (const aOrder of aOrders) {
        const acceptedOrder = await Order.findOne({ _id: aOrder })

        acceptedOrders.push(acceptedOrder)
    }

    const pendingOrders = await Order.find({ orderStatus: "pending" });

    res
        .status(200)
        .render("driverindex", {
            user,
            driver,
            rejectedOrders,
            acceptedOrders,
            pendingOrders
        });
});

exports.getSingleOrder = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const orderId = req.params.id;

    const q = await User.findOne({ _id: userId });
    const order = await Order.findOne({ _id: orderId });

    const sender = await User.findOne({ _id: order.userId });
    const driver = await User.findOne({ _id: order.assignDriver });

    res.status(200).render("order", { q, order, sender, driver });
});

exports.getAddCar = catchAsync(async (req, res, next) => {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId }, { password: 0 })
    const driver = await Driver.findOne({ userId })

    res.status(200).render("addCar", { user, driver });
});

exports.addCar = catchAsync(async (req, res, next) => {
    const userId = req.user.userId;
    const car = req.body.car;

    await Driver.updateOne({ userId: userId }, { car: car });

    res.status(200).redirect("/views/driver/");
});

exports.rejectOrder = catchAsync(async (req, res, next) => {
    const userId = req.user.userId;
    const orderId = req.params.orderId;

    const orderExists = await Order.findOne({ _id: orderId });

    if (!orderExists || orderExists.orderStatus === "accepted")
        return res.status(400).redirect("/views/driver/");

    await Order.updateOne({ _id: orderId }, { orderStatus: "rejected" });

    await Driver.updateOne(
        { userId },
        { $push: { rejectOrder: orderId } }
    );

    res.status(200).redirect("/views/driver/");
});

exports.acceptOrder = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const orderId = req.params.orderId;

    const orderExists = await Order.findOne({ _id: orderId });

    if (!orderExists || orderExists.orderStatus === "accepted")
        return res.status(400).redirect("/views/driver/");

    await Order.updateOne({ _id: orderId }, { orderStatus: "accepted" });

    await Driver.updateOne(
        { userId },
        { $push: { rejectOrder: orderId } }
    );

    res.status(200).redirect("/views/driver/");
});


exports.getReport = catchAsync(async (req, res, next) => {
    const userId = req.user.userId

    const user = await User.findOne({ _id: userId })
    const driver = await Driver.findOne({ userId })

    const aOrders = driver.acceptOrder

    console.log(aOrders)
    const rOrders = driver.rejectOrder

    const acceptedOrders = []
    const rejectedOrders = []

    for (const orderId of aOrders) {
        const acceptedOrder = await Order.findOne({ _id: orderId })
        acceptedOrders.push(acceptedOrder)
    }

    for (const orderId of rOrders) {
        const rejectedOrder = await Order.findOne({ _id: orderId })
        rejectedOrders.push(rejectedOrder)
    }

    res
        .status(200)
        .render("driver", {
            user,
            driver,
            acceptedOrders,
            rejectedOrders
        })

})

exports.getSingleOrder = catchAsync(async (req, res) => {
    const userId = req.user.userId
    const orderId = req.params.orderId

    const user = await User.findOne({ _id: userId })
    const order = await Order.findOne({ _id: orderId })

    const sender = await User.findOne({ userId: order.userId })
    const driver = await User.findOne({ _id: order.assignDriver })

    res.status(200).render("order", { user, order, sender, driver })


})