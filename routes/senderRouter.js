const express = require("express")
const senderController = require("../controllers/senderController")

const router = express.Router()

router.get("/", senderController.profile)
router.post("/becomeDriver", senderController.becomeDriver)
router.post("/requestOrder", senderController.requestOrder)

module.exports = router