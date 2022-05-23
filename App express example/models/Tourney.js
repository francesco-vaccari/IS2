const mongoose = require('mongoose')

const TourneySchema = mongoose.Schema({
    name: String,
    startingDate: String,
    endingDate: String,
    private: Boolean
})

module.exports = mongoose.model('Tuorney', TourneySchema)