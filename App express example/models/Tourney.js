const mongoose = require('mongoose')

const TourneySchema = mongoose.Schema({
    name: String,
    startingDate: Date,
    endingDate: Date,
    private: Boolean
})

module.exports = mongoose.model('Tourneys', TourneySchema)