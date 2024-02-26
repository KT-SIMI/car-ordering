const Driver = require("../models/driverModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.profile = catchAsync( async (req, res, next) => {
    const UserId = req.user.userId

    const q = await User.findOne({ _id: UserId }, { password: 0 })

    res.status(200).json({ status: "success", msg: "Profile Gotten", data: q })
})

exports.addCar = catchAsync( async (req, res, next) => {
    const userId = req.user.userId
    const car = req.body.car

    await Driver.updateOne({ _id: userId }, { car: car })

    const q = await User.findOne({ _id: userId }, { password: 0 })

    res.status(200).json({ status: 'success', msg: 'Car Added', data: q })
})

exports.rejectOrder = catchAsync ( async (req, res, next) => {
    // const userId = rq.user.userId
    const orderId = req.body.orderId
     
    const orderExists = await Order.findOne({ _id: orderId })

    if (!orderExists || orderExists.orderStatus == "accepted") return res.status(400).json({ status: 'error', msg: "Order no longer exists" })

    await Order.updateOne({ _id: orderId }, { orderStatus: "rejected" })

    const q = await Order.findOne({ _id: orderId })

    res.status(200).json({ status: 'succes', msg: 'Order Rejected', data: q })
})

exports.acceptOrder = catchAsync ( async (req, res, next) => {
    // const userId = rq.user.userId
    const orderId = req.body.orderId

    const orderExists = await Order.findOne({ _id: orderId })
    if (!orderExists || orderExists.orderStatus == "accepted") return res.status(400).json({ status: 'error', msg: "Order no longer exists" })

    await Order.updateOne({ _id: orderId }, { orderStatus: "accepted" })

    const q = await Order.findOne({ _id: orderId })

    res.status(200).json({ status: 'succes', msg: 'Order Accepted', data: q })
})