const mongoose = require('mongoose')

const PlayerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "nome giocatore richiesto"] //https://mongoosejs.com/docs/validation.html
    },
    surname: {
        type: String,
        required: [true, "cognome giocatore richiesto"]
    },
    id: Number
})

module.exports = mongoose.model('Player', PlayerSchema)