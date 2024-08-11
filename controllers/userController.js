const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Sender = require("../models/senderModel");
const Driver = require("../models/driverModel");
require("dotenv").config();

exports.getSignup = catchAsync(async (req, res) => {
  res.render('signup')
})

exports.signUp = catchAsync(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    role } = req.body

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PWD_HASH_LENGTH)
  );

  const user = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role,
  });

  const emailExists = await User.findOne({ email });

  if (emailExists)
    return res
      .status(401)
      .redirect('/views/login');

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

  res
    .status(200)
    .redirect('/views/login');
});

exports.getLogin = catchAsync(async (req, res) => {
  res.render('login')
})

exports.login = catchAsync(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .render('/views/signup');
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .render('/views/signup');
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .render('/views/signup');
  }

  const payload = { userId: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "720h",
  });

  req.session.token = token;


  if (user.role === "driver") {
    res
      .status(200)
      .redirect('/views/driver/');
  } else {
    res.status(200).redirect("/views/sender/")
  }
});


exports.index = catchAsync(async (req, res) => {
  const userId = req.user.userId

  const q = await User.findOne({ _id: userId })

  if (q === null) return res.status(401).redirect('/views/login')

  if (q.role === "driver") return res.status(200).redirect("/views/driver/")

  res.status(200).redirect("/views/sender/")
})

exports.getLogout = catchAsync(async (req, res) => {
  req.session.token = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);

      res.redirect("/views/login");
    });
  });
});