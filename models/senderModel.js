const { default: mongoose } = require("mongoose");

const senderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    requestOrder: {
        type: [mongoose.Schema.Types.ObjectId]
    }
})

const Sender = mongoose.model("Sender", senderSchema)

module.exports = Sender