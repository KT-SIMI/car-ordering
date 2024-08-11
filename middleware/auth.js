const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const authenticate = catchAsync(async (req, res, next) => {

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
   
  } else if (req.session.token) {
    token = req.session.token;
    req.session.token = token;
    
  } else if (req.cookies.sessionId) {
    token = req.cookies.sessionId;
 
  }

  // console.log(token)
  if (!token) {
    return next(new AppError(401, 'You are not logged in! Please log in to get access'))
  }

  try {
    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.userId)
    // console.log(currentUser)

    if (!currentUser) {
      return res.status(401).redirect("/views/login")
    }

    // If successful, grant access to protected route
    req.user = decoded
    // console.log('polo::::   ', decoded)

    next();
  } catch (err) {
    return res.status(401).redirect("/views/login")
  }
})

const auth = (req, res, next) => {
  authenticate(req, res, () => {
    if (req?.user) {
      next();
    } else {
      return res.status(401).redirect("/views/login")
    }
  })
}

const authDriver = (req, res, next) => {
  
  authenticate(req, res, () => {
    // console.log('Headers ::::::', req.user);
    if (req?.user?.role === 'driver') {
      next();
    } else {
      return res.status(401).redirect("/views/login")
    }

  })
}

const authSender = (req, res, next) => {
  
  authenticate(req, res, () => {
    if (req?.user?.role === 'sender') {
      next();
    } else {
     
      return res.status(401).redirect("/views/login");
    }

  })
}

  module.exports = { auth, authSender, authDriver }
  

