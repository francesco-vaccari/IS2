const mongoose = require('mongoose')
const User = require('./User')

const TourneySchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: [true, "id creatore richiesto"]
    },
    name: {
        type: String,
        required: [true, "nome richiesto"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        require: [true, "id creatore richiesto"]
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