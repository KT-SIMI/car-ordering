const express = require("express")
const senderController = require("../controllers/senderController")

const router = express.Router()

router.get("/", senderController.profile)
router.get("/requestOrder", senderController.getRequestOrder)
router.get("/becomeDriver", senderController.becomeDriver)
router.get("/getSingleOrder/:orderId", senderController.getSingleOrder)

router.post("/requestOrder", senderController.requestOrder)

module.exports = router