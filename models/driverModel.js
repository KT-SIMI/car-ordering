const { default: mongoose } = require("mongoose");

const driverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    car: {
        type: String,
        // required: true
    },
    acceptOrder: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    rejectOrder: {
        type: [mongoose.Schema.Types.ObjectId]
    }
})

const Driver = mongoose.model('Driver', driverSchema)

module.exports = Driver