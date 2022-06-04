const mongoose = require('mongoose')

const GameSchema = mongoose.Schema({
    date: Number,
    teamUno: String,
    teamDue: String
})

module.exports = mongoose.model('Game', GameSchema)