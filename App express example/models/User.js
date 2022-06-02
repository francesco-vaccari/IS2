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
    playerAssigned: {
        type: String, //true o false ma se metto boolean non funzionano le query
        require: [true, "playerAssigned richiesto"]
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
    }
})

module.exports = mongoose.model('User', UserSchema)