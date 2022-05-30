const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username richiesto"]
    },
    password: {
        type: String,
        required: [true, "pwd richiesta"]
    },
})

module.exports = mongoose.model('User', UserSchema)