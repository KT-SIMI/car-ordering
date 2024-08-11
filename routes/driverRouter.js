const express = require("express")
const driverController = require("../controllers/driverController")

const router = express.Router()

router.get("/", driverController.profile)
router.get("/addCar", driverController.getAddCar)
router.get("/report", driverController.getReport)
router.get("/getSingleOrder/:orderId", driverController.getSingleOrder)
router.get("/acceptOrder/:orderId", driverController.acceptOrder)
router.get("/declineOrder/:orderId", driverController.rejectOrder)


router.post('/addCar', driverController.addCar)
router.post('/rejectOrder/:id', driverController.rejectOrder)
router.post('/acceptOrder/:id', driverController.acceptOrder)

module.exports = router