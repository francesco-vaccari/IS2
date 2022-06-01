const mongoose = require('mongoose')

const GameSchema = mongoose.Schema({
    date: Number,
    teamUno: { // https://mongoosejs.com/docs/populate.html
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    }, 
    teamDue: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    }
})

module.exports = mongoose.model('Game', GameSchema)