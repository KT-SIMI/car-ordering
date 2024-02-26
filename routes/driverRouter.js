const express = require("express")
const driverController = require("../controllers/driverController")

const router = express.Router()

router.get("/", driverController.profile)
router.post('/addCar', driverController.addCar)
router.post('/rejectOrder', driverController.rejectOrder)
router.post('/acceptOrder', driverController.acceptOrder)

module.exports = router