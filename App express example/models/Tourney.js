const mongoose = require('mongoose')

const TourneySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "nome richiesto"]
    },
    startingDate: {
        type: Number,
        required: [true, "data inizio richiesta"]
    },
    endingDate: {
        type: Number,
        required: [true, "data fine richiesta"]
    },
    private: Boolean,
    format: String,
    teams: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    }],
    games: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Game' 
    }]
})

module.exports = mongoose.model('Tourney', TourneySchema)