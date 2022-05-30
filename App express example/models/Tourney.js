const mongoose = require('mongoose')

const TourneySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "cognome richiesto"]
    },
    startingDate: {
        type: String,
        required: [true, "data inizio richiesta"]
    },
    endingDate: {
        type: String,
        required: [true, "data fine richiesta"]
    },
    private: Boolean,
    format: String,
    teams: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    },
    games: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Game' 
    }
})

module.exports = mongoose.model('Tuorney', TourneySchema)