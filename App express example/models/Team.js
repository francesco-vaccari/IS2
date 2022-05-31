const mongoose = require('mongoose')

const TeamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "nome squadra richiesto"]
    },
    players: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player' 
    }]
})
    
    module.exports = mongoose.model('Team', TeamSchema)