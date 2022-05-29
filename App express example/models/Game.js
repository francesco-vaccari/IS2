const mongoose = require('mongoose')

const GameSchema = mongoose.Schema({
    date: Date,
    hour: Number, //possiamo toglierlo e tenere solo "date" perchè nel formato Date c'è già l'ora
    teamUno: { // https://mongoosejs.com/docs/populate.html
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    }, 
    teamDue: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    }
})

module.exports = mongoose.model('Player', GameSchema)