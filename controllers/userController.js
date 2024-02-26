const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Sender = require("../models/senderModel");
const Driver = require("../models/driverModel");
require("dotenv").config();

exports.signUp = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PWD_HASH_LENGTH)
  );

  const user = new User({
    email,
    password: hashedPassword,
    role,
  });

  const emailExists = await User.findOne({ email });

  if (emailExists)
    return res
      .status(401)
      .json({ status: "error", msg: "Email already exists" });

  await user.save();

  if (user.role === "sender") {
    const sender = new Sender({
      userId: user._id
    })

    await sender.save()
  } else {
    const driver = new Driver({
      userId: user._id
    })

    await driver.save()
  }

  const q = await User.findOne({ _id: user._id }, { password: 0 });

  res
    .status(200)
    .json({ status: "success", msg: "Signed up successfully", data: q });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: "error", msg: "Invalid email and/or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ status: "error", msg: "Invalid email and/or password" });
  }

  const payload = { userId: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "400h",
  });

  req.session.token = token;

  const q = await User.findOne({ _id: user._id }, { password: 0 });

  res
    .status(200)
    .json({ status: "success", msg: "Logged in successfully", data: q });
});
