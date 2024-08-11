const express = require("express")
const userController = require("../controllers/userController")
const { auth } = require("../middleware/auth")
require("dotenv").config();

const router = express.Router()

router.get("/", auth, userController.index)
router.get("/signup", userController.getSignup)
router.get("/logout", userController.getLogout)
router.post("/signup", userController.signUp)

router.get("/login", userController.getLogin)
router.post("/login", userController.login)

module.exports = router